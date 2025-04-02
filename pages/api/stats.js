import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Базовые метрики
    const totalMessages = await prisma.message.count();
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

    // Популярные вопросы с подсчетом повторений
    const allUserMessages = await prisma.message.findMany({
      where: { role: 'user' },
      select: {
        content: true,
        timestamp: true
      }
    });

    // Подсчитываем количество повторений каждого вопроса
    const questionCounts = allUserMessages.reduce((acc, msg) => {
      acc[msg.content] = (acc[msg.content] || 0) + 1;
      return acc;
    }, {});

    // Сортируем вопросы по количеству повторений
    const popularQuestions = Object.entries(questionCounts)
      .map(([content, count]) => ({
        content,
        count,
        lastAsked: allUserMessages
          .filter(m => m.content === content)
          .sort((a, b) => b.timestamp - a.timestamp)[0]
          .timestamp
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Получаем популярность карточек по типам
    const advertiserCards = await prisma.card.findMany({
      where: {
        type: 'advertiser'
      },
      orderBy: {
        clicks: 'desc'
      },
      take: 5
    });

    const supplierCards = await prisma.card.findMany({
      where: {
        type: 'supplier'
      },
      orderBy: {
        clicks: 'desc'
      },
      take: 5
    });

    // Формируем ответ
    const stats = {
      basicMetrics: {
        totalMessages,
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
        })),
        average: ratings.reduce((acc, r) => acc + r.rating * r._count, 0) / ratings.reduce((acc, r) => acc + r._count, 0)
      },
      botErrors: {
        total: botErrors
      },
      returningRate: {
        total: returningUsers
      },
      popularQuestions: popularQuestions.map(q => ({
        question: q.content,
        count: q.count,
        lastAsked: q.lastAsked
      })),
      cardPopularity: {
        advertisers: advertiserCards.map(c => ({
          title: c.title,
          clicks: c.clicks
        })),
        suppliers: supplierCards.map(c => ({
          title: c.title,
          clicks: c.clicks
        }))
      }
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