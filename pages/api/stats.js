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

    const uniqueUsers = await prisma.message.groupBy({
      by: ['userId'],
      where: { userId: { not: null } },
      _count: true,
    });

    const totalDialogs = await prisma.userSession.count();
    const avgMessagesPerUser = uniqueUsers.length > 0 ? totalMessages / uniqueUsers.length : 0;

    // Статистика по заявкам
    const leads = await prisma.message.groupBy({
      by: ['leadType'],
      where: { isLead: true },
      _count: true,
    });

    // Активность по часам
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc',
      },
    });

    // Качество ответов
    const ratings = await prisma.message.groupBy({
      by: ['rating'],
      where: { rating: { not: null } },
      _count: true,
    });

    // Ошибки бота
    const botErrors = await prisma.message.count({
      where: { isError: true }
    });

    // Повторные обращения
    const returningUsers = await prisma.userSession.count({
      where: { isReturning: true }
    });
    const returningRate = totalDialogs > 0 ? (returningUsers / totalDialogs) * 100 : 0;

    // Популярные вопросы
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

    // Популярность карточек
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

    // Получаем информацию о карточках
    const cards = await prisma.card.findMany({
      where: {
        id: {
          in: cardPopularity.map(c => c.cardId)
        }
      }
    });

    // Среднее время между сообщениями
    const userSessions = await prisma.userSession.findMany({
      where: {
        lastMessageTime: { not: null }
      }
    });

    let avgTimeBetweenMessages = 0;
    if (userSessions.length > 0) {
      const totalTime = userSessions.reduce((acc, session) => {
        const timeDiff = new Date() - new Date(session.lastMessageTime);
        return acc + (timeDiff / (session.messageCount || 1));
      }, 0);
      avgTimeBetweenMessages = totalTime / userSessions.length;
    }

    // Форматируем данные для ответа
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

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 