import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Основные метрики
    const totalMessages = await prisma.message.count();
    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    });
    const botMessages = await prisma.message.count({
      where: { role: 'assistant' }
    });
    const uniqueUsers = await prisma.userSession.count();
    const totalDialogues = await prisma.dialogue.count();
    const avgMessagesPerUser = totalMessages / uniqueUsers || 0;

    // Статистика по лидам
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true
    });

    // Активность по часам
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc'
      }
    });

    // Качество ответов
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      where: { rating: { not: null } },
      _count: true
    });

    // Ошибки бота
    const botErrors = await prisma.message.count({
      where: { isError: true }
    });

    // Возвращающиеся пользователи
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    });
    const returningRate = (returningUsers / uniqueUsers) * 100 || 0;

    // Популярные вопросы
    const popularQuestions = await prisma.message.findMany({
      where: { role: 'user' },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Популярность карточек
    const cardPopularity = await prisma.card.findMany({
      select: {
        title: true,
        clicks: true
      },
      orderBy: {
        clicks: 'desc'
      }
    });

    // Среднее время между сообщениями
    const userSessions = await prisma.userSession.findMany({
      select: {
        messageTimes: true
      }
    });

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
    });

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
    return res.status(500).json({ message: 'Internal server error' });
  }
} 