import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Базовые метрики
    const totalMessages = await prisma.message.count();
    const userMessages = await prisma.message.count({
      where: { role: 'user' }
    });
    const botMessages = await prisma.message.count({
      where: { role: 'assistant' }
    });
    const uniqueUsers = await prisma.message.groupBy({
      by: ['userId'],
      _count: true
    }).then(groups => groups.length);

    // Лиды
    const totalLeads = await prisma.message.count({
      where: { isLead: true }
    });

    // Активность по часам
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc'
      }
    });

    // Рейтинги
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      _count: true,
      where: {
        rating: { not: null }
      }
    });

    // Ошибки бота
    const botErrors = await prisma.message.count({
      where: { isError: true }
    });

    // Возвращающиеся пользователи
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    });

    // Популярные вопросы
    const popularQuestions = await prisma.message.findMany({
      where: { role: 'user' },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: {
        content: true,
        timestamp: true
      }
    });

    // Популярность карточек
    const cardPopularity = await prisma.card.findMany({
      orderBy: { clicks: 'desc' },
      select: {
        title: true,
        clicks: true
      }
    });

    // Среднее время между сообщениями
    const sessions = await prisma.userSession.findMany({
      select: { messageTimes: true },
      where: {
        messageTimes: { isEmpty: false }
      }
    });

    let totalTimeBetweenMessages = 0;
    let totalIntervals = 0;

    sessions.forEach(session => {
      const times = session.messageTimes.sort();
      for (let i = 1; i < times.length; i++) {
        totalTimeBetweenMessages += times[i] - times[i-1];
        totalIntervals++;
      }
    });

    const avgTimeBetweenMessages = totalIntervals > 0 
      ? totalTimeBetweenMessages / totalIntervals / 1000 // конвертируем в секунды
      : 0;

    // Формируем ответ
    const stats = {
      basicMetrics: {
        totalMessages,
        userMessages,
        botMessages,
        uniqueUsers,
        avgMessagesPerUser: uniqueUsers > 0 ? totalMessages / uniqueUsers : 0
      },
      leads: {
        total: totalLeads
      },
      hourlyActivity: hourlyActivity.map(h => ({
        hour: h.hour,
        count: h._count
      })),
      ratings: {
        distribution: ratings.map(r => ({
          rating: r.rating,
          count: r._count
        }))
      },
      botErrors: {
        total: botErrors
      },
      returningRate: {
        total: returningUsers
      },
      popularQuestions: popularQuestions.map(q => ({
        question: q.content,
        timestamp: q.timestamp
      })),
      cardPopularity: cardPopularity.map(c => ({
        title: c.title,
        clicks: c.clicks
      })),
      avgTimeBetweenMessages
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in stats API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 