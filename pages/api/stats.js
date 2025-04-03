import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем общую статистику
    const stats = await prisma.stats.findFirst({
      where: { id: 1 }
    });

    // Если статистики нет, создаем начальную
    if (!stats) {
      const newStats = await prisma.stats.create({
        data: {
          id: 1,
          likes: 0,
          dislikes: 0,
          totalMessages: 0,
          totalDialogues: 0
        }
      });
      return res.status(200).json(newStats);
    }

    // Получаем количество сообщений за последние 24 часа
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messagesLast24h = await prisma.message.count({
      where: {
        createdAt: {
          gte: last24Hours
        }
      }
    });

    // Получаем количество активных диалогов (за последние 24 часа)
    const activeDialogues = await prisma.message.groupBy({
      by: ['cardId'],
      where: {
        createdAt: {
          gte: last24Hours
        },
        cardId: {
          not: null
        }
      },
      _count: true
    });

    // Получаем статистику по часам
    const messagesByHour = await prisma.message.groupBy({
      by: ['hour'],
      _count: true
    });

    // Получаем популярные вопросы
    const userMessages = await prisma.message.findMany({
      where: { 
        role: 'user',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // За последнюю неделю
        }
      },
      select: {
        content: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Подсчитываем количество повторений каждого вопроса
    const questionCounts = {};
    const questionLastAsked = {};
    userMessages.forEach(msg => {
      questionCounts[msg.content] = (questionCounts[msg.content] || 0) + 1;
      if (!questionLastAsked[msg.content] || msg.createdAt > questionLastAsked[msg.content]) {
        questionLastAsked[msg.content] = msg.createdAt;
      }
    });

    const popularQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({
        question,
        count,
        lastAsked: questionLastAsked[question]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Получаем популярность карточек по типам
    const advertisers = await prisma.card.findMany({
      where: { type: 'advertiser' },
      orderBy: { clicks: 'desc' },
      take: 5,
      select: {
        title: true,
        clicks: true
      }
    });

    const suppliers = await prisma.card.findMany({
      where: { type: 'supplier' },
      orderBy: { clicks: 'desc' },
      take: 5,
      select: {
        title: true,
        clicks: true
      }
    });

    // Формируем полный ответ
    const response = {
      ...stats,
      messagesLast24h,
      activeDialogues: activeDialogues.length,
      messagesByHour: messagesByHour.reduce((acc, item) => {
        acc[item.hour] = item._count;
        return acc;
      }, {}),
      popularQuestions,
      cardPopularity: {
        advertisers,
        suppliers
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  } finally {
    await prisma.$disconnect();
  }
} 