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
    const uniqueUsers = await prisma.message.groupBy({
      by: ['userId'],
      where: { userId: { not: null } },
      _count: true,
    });
    console.log('Unique users:', uniqueUsers.length);

    const totalDialogs = await prisma.userSession.count();
    console.log('Total dialogs:', totalDialogs);

    const avgMessagesPerUser = uniqueUsers.length > 0 ? totalMessages / uniqueUsers.length : 0;
    console.log('Average messages per user:', avgMessagesPerUser);

    // Статистика по заявкам
    console.log('Calculating leads...');
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true,
    });
    console.log('Leads:', leads);

    // Активность по часам
    console.log('Calculating hourly activity...');
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc',
      },
    });
    console.log('Hourly activity:', hourlyActivity);

    // Качество ответов
    console.log('Calculating ratings...');
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      where: { rating: { not: null } },
      _count: true,
    });
    console.log('Ratings:', ratings);

    // Ошибки бота
    console.log('Calculating bot errors...');
    const botErrors = await prisma.message.count({
      where: { isError: true }
    });
    console.log('Bot errors:', botErrors);

    // Повторные обращения
    console.log('Calculating returning users...');
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    });
    console.log('Returning users:', returningUsers);

    const returningRate = totalDialogs > 0 ? (returningUsers / totalDialogs) * 100 : 0;
    console.log('Returning rate:', returningRate);

    // Популярные вопросы
    console.log('Calculating popular questions...');
    const popularQuestions = await prisma.message.groupBy({
      by: ['content'],
      where: { role: 'user' },
      _count: true,
      orderBy: {
        _count: {
          content: 'desc',
        },
      },
      take: 10,
    });
    console.log('Popular questions:', popularQuestions);

    // Популярность карточек
    console.log('Calculating card popularity...');
    const cardPopularity = await prisma.message.groupBy({
      by: ['cardId'],
      where: { cardId: { not: null } },
      _count: true,
      orderBy: {
        _count: {
          cardId: 'desc',
        },
      },
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
    });
    console.log('Cards:', cards);

    // Среднее время между сообщениями
    console.log('Calculating average time between messages...');
    const userSessions = await prisma.userSession.findMany({
      where: {
        lastMessageTime: { not: null }
      }
    });
    console.log('User sessions:', userSessions.length);

    let avgTimeBetweenMessages = 0;
    if (userSessions.length > 0) {
      const totalTime = userSessions.reduce((acc, session) => {
        const timeDiff = new Date() - new Date(session.lastMessageTime);
        return acc + (timeDiff / (session.messageCount || 1));
      }, 0);
      avgTimeBetweenMessages = totalTime / userSessions.length;
    }
    console.log('Average time between messages:', avgTimeBetweenMessages);

    // Форматируем данные для ответа
    console.log('Formatting response...');
    const stats = {
      // Основные метрики
      totalDialogs,
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
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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