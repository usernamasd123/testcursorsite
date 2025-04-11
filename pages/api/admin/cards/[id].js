import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const card = await prisma.card.findUnique({
        where: { id },
        include: {
          trafficSources: {
            include: {
              trafficSource: true
            }
          }
        }
      });

      if (!card) {
        return res.status(404).json({ error: 'Карточка не найдена' });
      }

      res.status(200).json(card);
    } else if (req.method === 'PUT') {
      const {
        title,
        description,
        type,
        budget,
        experience,
        foundedYear,
        trafficSources,
        goals,
        advantages,
        features
      } = req.body;

      // Обновляем карточку
      const updatedCard = await prisma.card.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description.trim(),
          type,
          budget: String(budget || '0'),
          budgetValue: parseInt(budget || '0', 10),
          experience: type === 'supplier' ? parseInt(experience || '0', 10) : null,
          foundedYear: type === 'advertiser' ? parseInt(foundedYear || '0', 10) : null,
          goals: Array.isArray(goals) ? goals : [],
          advantages: Array.isArray(advantages) ? advantages : [],
          features: Array.isArray(features) ? features : [],
          trafficSources: {
            deleteMany: {},
            create: Array.isArray(trafficSources) ? trafficSources.map(sourceName => ({
              trafficSource: {
                connect: {
                  name: sourceName
                }
              }
            })) : []
          }
        },
        include: {
          trafficSources: {
            include: {
              trafficSource: true
            }
          }
        }
      });

      res.status(200).json(updatedCard);
    } else if (req.method === 'DELETE') {
      await prisma.card.delete({
        where: { id }
      });
      res.status(200).json({ message: 'Карточка удалена' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await prisma.$disconnect();
  }
} 