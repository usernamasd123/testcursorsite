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
      if (type === 'supplier') {
        if (!req.body.experience) {
          return res.status(400).json({ error: 'Experience is required for suppliers' });
        }
        if (!trafficSource) {
          return res.status(400).json({ error: 'Traffic source is required for suppliers' });
        }
      }
      
      if (type === 'advertiser') {
        if (!req.body.foundedYear) {
          return res.status(400).json({ error: 'Founded year is required for advertisers' });
        }
        if (!req.body.sources || !req.body.sources.length) {
          return res.status(400).json({ error: 'At least one traffic source is required for advertisers' });
        }
      }

      // Создаем карточку
      const card = await prisma.card.create({
        data: {
          title: req.body.title.trim(),
          description: req.body.description.trim(),
          type: req.body.type,
          budget: String(req.body.budget || '0'),
          budgetValue: parseInt(req.body.budget || '0', 10),
          experience: req.body.type === 'supplier' ? parseInt(req.body.experience || '0', 10) : null,
          foundedYear: req.body.type === 'advertiser' ? parseInt(req.body.foundedYear || '0', 10) : null,
          trafficSource: req.body.type === 'supplier' ? (req.body.trafficSource || '').trim() : '',
          sources: req.body.type === 'advertiser' ? 
            (Array.isArray(req.body.sources) ? req.body.sources.map(s => s.trim()).filter(Boolean) : []) : [],
          goals: Array.isArray(req.body.goals) ? req.body.goals.map(g => g.trim()).filter(Boolean) : [],
          advantages: Array.isArray(req.body.advantages) ? req.body.advantages.map(a => a.trim()).filter(Boolean) : [],
          features: [],
          clicks: 0
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