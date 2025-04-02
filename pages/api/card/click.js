import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: 'Card ID is required' });
    }

    // Увеличиваем счетчик кликов для карточки
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        clicks: {
          increment: 1
        }
      }
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Error tracking card click:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 