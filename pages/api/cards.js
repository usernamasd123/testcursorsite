import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: 'Type parameter is required' });
  }

  try {
    const cards = await prisma.card.findMany({
      where: {
        type: type
      }
    });

    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  } finally {
    await prisma.$disconnect();
  }
} 