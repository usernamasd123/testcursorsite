import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Получаем общую статистику
    const totalMessages = await prisma.message.count();
    const uniqueUsers = await prisma.message.groupBy({
      by: ['userId'],
      _count: true,
    });

    // Получаем среднее время ответа
    const avgResponseTime = await prisma.message.aggregate({
      _avg: {
        responseTime: true,
      },
    });

    // Получаем активность по часам
    const hourlyActivity = await prisma.message.groupBy({
      by: ['hour'],
      _count: true,
      orderBy: {
        hour: 'asc',
      },
    });

    // Получаем популярные темы
    const popularTopics = await prisma.message.groupBy({
      by: ['topic'],
      _count: true,
      orderBy: {
        _count: {
          topic: 'desc',
        },
      },
      take: 5,
    });

    // Форматируем данные для ответа
    const stats = {
      totalMessages,
      uniqueUsers: uniqueUsers.length,
      avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      hourlyActivity: hourlyActivity.map(hour => ({
        hour: hour.hour,
        count: hour._count,
      })),
      maxHourlyActivity: Math.max(...hourlyActivity.map(h => h._count)),
      popularTopics: popularTopics.map(topic => ({
        name: topic.topic,
        count: topic._count,
      })),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 