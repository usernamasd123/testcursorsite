import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Starting stats calculation...');
    
    // Проверяем подключение к базе данных
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw new Error(`Database connection failed: ${dbError.message}`);
    }

    // Проверяем существование таблиц
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Message" LIMIT 1`;
      await prisma.$queryRaw`SELECT 1 FROM "UserSession" LIMIT 1`;
      await prisma.$queryRaw`SELECT 1 FROM "Card" LIMIT 1`;
    } catch (error) {
      console.error('Tables check failed:', error);
      // Если таблицы не существуют, возвращаем пустые данные
      return res.status(200).json({
        totalDialogs: 0,
        messages: {
          total: 0,
          user: 0,
          bot: 0
        },
        leads: {
          advertisers: 0,
          suppliers: 0
        },
        avgMessagesPerUser: 0,
        hourlyActivity: [],
        maxHourlyActivity: 0,
        ratings: {
          positive: 0,
          negative: 0
        },
        botErrors: 0,
        returningRate: 0,
        popularQuestions: [],
        cardPopularity: [],
        avgTimeBetweenMessages: 0
      });
    }

    // Основные метрики
    console.log('Calculating basic metrics...');
    const totalMessages = await prisma.message.count();
    console.log('Total messages:', totalMessages);

    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    });
    console.log('User messages:', userMessages);

    const botMessages = await prisma.message.count({
      where: { role: 'assistant' }
    });
    console.log('Bot messages:', botMessages);

    console.log('Calculating unique users...');
    const uniqueUsers = await prisma.userSession.count();
    console.log('Unique users:', uniqueUsers);

    const totalDialogues = await prisma.dialogue.count();
    console.log('Total dialogues:', totalDialogues);

    const avgMessagesPerUser = totalMessages / uniqueUsers || 0;
    console.log('Average messages per user:', avgMessagesPerUser);

    // Статистика по лидам
    console.log('Calculating leads...');
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true
    });
    console.log('Leads:', leads);

    // Активность по часам
    console.log('Calculating hourly activity...');
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true
    });
    console.log('Hourly activity:', hourlyActivity);

    // Качество ответов
    console.log('Calculating ratings...');
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      _count: true
    });
    console.log('Ratings:', ratings);

    // Ошибки бота
    console.log('Calculating bot errors...');
    const botErrors = await prisma.message.count({
      where: { isError: true }
    });
    console.log('Bot errors:', botErrors);

    // Возвращающиеся пользователи
    console.log('Calculating returning users...');
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    });
    console.log('Returning users:', returningUsers);

    const returningRate = (returningUsers / uniqueUsers) * 100 || 0;
    console.log('Returning rate:', returningRate);

    // Популярные вопросы
    console.log('Calculating popular questions...');
    const popularQuestions = await prisma.message.findMany({
      where: { role: 'user' },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('Popular questions:', popularQuestions);

    // Популярность карточек
    console.log('Calculating card popularity...');
    const cardPopularity = await prisma.card.findMany({
      select: {
        title: true,
        clicks: true
      },
      orderBy: {
        clicks: 'desc'
      }
    });
    console.log('Card popularity:', cardPopularity);

    // Получаем информацию о карточках
    console.log('Fetching card details...');
    const cards = await prisma.card.findMany({
      where: {
        id: {
          in: cardPopularity.map(c => c.cardId)
        }
      }
    }).catch(() => []);
    console.log('Cards:', cards);

    // Среднее время между сообщениями
    console.log('Calculating average time between messages...');
    const userSessions = await prisma.userSession.findMany({
      select: {
        messageTimes: true
      }
    });
    console.log('User sessions:', userSessions.length);

    let totalTimeBetweenMessages = 0;
    let messagePairsCount = 0;

    userSessions.forEach(session => {
      const times = session.messageTimes.sort((a, b) => new Date(a) - new Date(b));
      for (let i = 1; i < times.length; i++) {
        const timeDiff = new Date(times[i]) - new Date(times[i - 1]);
        totalTimeBetweenMessages += timeDiff;
        messagePairsCount++;
      }
    });

    const avgTimeBetweenMessages = messagePairsCount > 0 
      ? totalTimeBetweenMessages / messagePairsCount / 1000 / 60 // в минутах
      : 0;
    console.log('Average time between messages:', avgTimeBetweenMessages);

    // Реакции на сообщения
    console.log('Calculating reactions...');
    const reactions = await prisma.message.groupBy({
      by: ['reactions'],
      _count: true
    });
    console.log('Reactions:', reactions);

    // Форматируем данные для ответа
    console.log('Formatting response...');
    const stats = {
      // Основные метрики
      totalDialogs: totalDialogues,
      messages: {
        total: totalMessages,
        user: userMessages,
        bot: botMessages
      },
      leads: {
        advertisers: leads.find(l => l.leadType === 'advertisers')?._count || 0,
        suppliers: leads.find(l => l.leadType === 'suppliers')?._count || 0
      },
      avgMessagesPerUser: Math.round(avgMessagesPerUser * 100) / 100,
      hourlyActivity: hourlyActivity.map(hour => ({
        hour: hour.hour,
        count: hour._count,
      })),
      maxHourlyActivity: hourlyActivity.length > 0 ? Math.max(...hourlyActivity.map(h => h._count)) : 0,

      // Качество
      ratings: {
        positive: ratings.find(r => r.rating === 'positive')?._count || 0,
        negative: ratings.find(r => r.rating === 'negative')?._count || 0
      },
      botErrors,
      returningRate: Math.round(returningRate * 100) / 100,
      popularQuestions: popularQuestions.map(q => ({
        question: q.content,
        count: q._count
      })),

      // Остальное
      cardPopularity: cardPopularity.map(cp => {
        const card = cards.find(c => c.id === cp.cardId);
        return {
          title: card?.title || 'Неизвестная карточка',
          count: cp._count
        };
      }),
      avgTimeBetweenMessages: Math.round(avgTimeBetweenMessages / 1000) // в секундах
    };

    console.log('Stats calculation completed successfully');
    res.status(200).json(stats);
  } catch (error) {
    console.error('Detailed error in stats calculation:', error);
    console.error('Error stack:', error.stack);
    
    // Возвращаем пустые данные в случае ошибки
    res.status(200).json({
      totalDialogs: 0,
      messages: {
        total: 0,
        user: 0,
        bot: 0
      },
      leads: {
        advertisers: 0,
        suppliers: 0
      },
      avgMessagesPerUser: 0,
      hourlyActivity: [],
      maxHourlyActivity: 0,
      ratings: {
        positive: 0,
        negative: 0
      },
      botErrors: 0,
      returningRate: 0,
      popularQuestions: [],
      cardPopularity: [],
      avgTimeBetweenMessages: 0
    });
  } finally {
    try {
      await prisma.$disconnect();
      console.log('Database connection closed');
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 