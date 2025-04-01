import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Основные метрики
    const totalMessages = await prisma.message.count().catch(() => 0);
    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    }).catch(() => 0);
    const botMessages = await prisma.message.count({
      where: { role: 'assistant' }
    }).catch(() => 0);
    const uniqueUsers = await prisma.userSession.count().catch(() => 0);
    const totalDialogues = await prisma.dialogue.count().catch(() => 0);
    const avgMessagesPerUser = uniqueUsers > 0 ? totalMessages / uniqueUsers : 0;

    // Статистика по лидам
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true
    }).catch(() => []);

    // Активность по часам
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc'
      }
    }).catch(() => []);

    // Качество ответов
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      where: { rating: { not: null } },
      _count: true
    }).catch(() => []);

    // Ошибки бота
    const botErrors = await prisma.message.count({
      where: { isError: true }
    }).catch(() => 0);

    // Возвращающиеся пользователи
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    }).catch(() => 0);
    const returningRate = uniqueUsers > 0 ? (returningUsers / uniqueUsers) * 100 : 0;

    // Популярные вопросы
    const popularQuestions = await prisma.message.findMany({
      where: { role: 'user' },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    }).catch(() => []);

    // Популярность карточек
    const cardPopularity = await prisma.card.findMany({
      select: {
        title: true,
        clicks: true
      },
      orderBy: {
        clicks: 'desc'
      }
    }).catch(() => []);

    // Среднее время между сообщениями
    const userSessions = await prisma.userSession.findMany({
      select: {
        messageTimes: true
      }
    }).catch(() => []);

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

    // Реакции на сообщения
    const reactions = await prisma.message.groupBy({
      by: ['reactions'],
      where: { reactions: { isEmpty: false } },
      _count: true
    }).catch(() => []);

    return res.status(200).json({
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
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 