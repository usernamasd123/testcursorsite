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
      _count: true,
      orderBy: {
        hour: 'asc'
      }
    });

    // Получаем топ карточек по кликам
    const topCards = await prisma.card.findMany({
      orderBy: {
        clicks: 'desc'
      },
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
      topCards
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  } finally {
    await prisma.$disconnect();
  }
} 