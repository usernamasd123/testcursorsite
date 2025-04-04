import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const cards = await prisma.card.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.status(200).json(cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  } else if (req.method === 'POST') {
    try {
      // Проверяем обязательные поля
      const { title, description, type, budget, trafficSource } = req.body;
      
      if (!title || !description || !type || !budget) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Проверяем специфичные поля для каждого типа
      if (type === 'supplier' && !req.body.experience) {
        return res.status(400).json({ error: 'Experience is required for suppliers' });
      }
      if (type === 'advertiser' && !req.body.foundedYear) {
        return res.status(400).json({ error: 'Founded year is required for advertisers' });
      }

      // Создаем карточку
      const card = await prisma.card.create({
        data: {
          ...req.body,
          clicks: 0,
          views: 0,
          // Убеждаемся, что все массивы существуют
          sources: Array.isArray(req.body.sources) ? req.body.sources : [],
          goals: Array.isArray(req.body.goals) ? req.body.goals : [],
          advantages: Array.isArray(req.body.advantages) ? req.body.advantages : []
        }
      });
      
      res.status(201).json(card);
    } catch (error) {
      console.error('Error creating card:', error);
      res.status(500).json({ error: error.message || 'Failed to create card' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 