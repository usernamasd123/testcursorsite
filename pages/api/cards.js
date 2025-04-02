import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    const cards = await prisma.card.findMany({
      where: type ? { type } : {},
      orderBy: {
        clicks: 'desc'
      }
    });

    res.status(200).json(cards);
  } catch (error) {
    console.error('Error in cards API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 