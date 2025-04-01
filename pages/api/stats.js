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
        basic: {
          totalMessages: 0,
          userMessages: 0,
          botMessages: 0,
          uniqueUsers: 0,
          totalDialogues: 0,
          avgMessagesPerUser: 0
        },
        leads: [],
        hourlyActivity: [],
        ratings: [],
        botErrors: 0,
        returningRate: 0,
        popularQuestions: [],
        cardPopularity: [],
        avgTimeBetweenMessages: 0,
        reactions: []
      });
    }

    // Основные метрики
    console.log('Calculating basic metrics...');
    const totalMessages = await prisma.message.count().catch(() => 0);
    console.log('Total messages:', totalMessages);

    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    }).catch(() => 0);
    console.log('User messages:', userMessages);

    const botMessages = await prisma.message.count({
      where: { role: 'assistant' }
    }).catch(() => 0);
    console.log('Bot messages:', botMessages);

    console.log('Calculating unique users...');
    const uniqueUsers = await prisma.userSession.count().catch(() => 0);
    console.log('Unique users:', uniqueUsers);

    const totalDialogues = await prisma.dialogue.count().catch(() => 0);
    console.log('Total dialogues:', totalDialogues);

    const avgMessagesPerUser = uniqueUsers > 0 ? totalMessages / uniqueUsers : 0;
    console.log('Average messages per user:', avgMessagesPerUser);

    // Статистика по лидам
    console.log('Calculating leads...');
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true
    }).catch(() => []);
    console.log('Leads:', leads);

    // Активность по часам
    console.log('Calculating hourly activity...');
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc'
      }
    }).catch(() => []);
    console.log('Hourly activity:', hourlyActivity);

    // Качество ответов
    console.log('Calculating ratings...');
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      where: { rating: { not: null } },
      _count: true
    }).catch(() => []);
    console.log('Ratings:', ratings);

    // Ошибки бота
    console.log('Calculating bot errors...');
    const botErrors = await prisma.message.count({
      where: { isError: true }
    }).catch(() => 0);
    console.log('Bot errors:', botErrors);

    // Возвращающиеся пользователи
    console.log('Calculating returning users...');
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    }).catch(() => 0);
    console.log('Returning users:', returningUsers);

    const returningRate = uniqueUsers > 0 ? (returningUsers / uniqueUsers) * 100 : 0;
    console.log('Returning rate:', returningRate);

    // Популярные вопросы
    console.log('Calculating popular questions...');
    const popularQuestions = await prisma.message.findMany({
      where: { role: 'user' },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }).catch(() => []);
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
    }).catch(() => []);
    console.log('Card popularity:', cardPopularity);

    // Среднее время между сообщениями
    console.log('Calculating average time between messages...');
    const userSessions = await prisma.userSession.findMany({
      select: {
        messageTimes: true
      }
    }).catch(() => []);
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
      where: { reactions: { isEmpty: false } },
      _count: true
    }).catch(() => []);
    console.log('Reactions:', reactions);

    // Форматируем данные для ответа
    console.log('Formatting response...');
    const stats = {
      basic: {
        totalMessages,
        userMessages,
        botMessages,
        uniqueUsers,
        totalDialogues,
        avgMessagesPerUser
      },
      leads,
      hourlyActivity,
      ratings,
      botErrors,
      returningRate,
      popularQuestions,
      cardPopularity,
      avgTimeBetweenMessages,
      reactions
    };

    console.log('Stats calculation completed successfully');
    
    // Отключаем кэширование для этого ответа
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Detailed error in stats calculation:', error);
    console.error('Error stack:', error.stack);
    
    // Возвращаем пустые данные в случае ошибки
    res.status(200).json({
      basic: {
        totalMessages: 0,
        userMessages: 0,
        botMessages: 0,
        uniqueUsers: 0,
        totalDialogues: 0,
        avgMessagesPerUser: 0
      },
      leads: [],
      hourlyActivity: [],
      ratings: [],
      botErrors: 0,
      returningRate: 0,
      popularQuestions: [],
      cardPopularity: [],
      avgTimeBetweenMessages: 0,
      reactions: []
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