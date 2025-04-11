import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  try {
    if (req.method === 'GET') {
      const cards = await prisma.card.findMany({
        include: {
          trafficSources: {
            include: {
              trafficSource: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.status(200).json(cards);
    } else if (req.method === 'POST') {
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

      // Создаем новую карточку
      const newCard = await prisma.card.create({
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

      res.status(201).json(newCard);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await prisma.$disconnect();
  }
} 