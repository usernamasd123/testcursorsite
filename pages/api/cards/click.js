import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ message: 'Missing cardId' });
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        clicks: {
          increment: 1
        }
      }
    });

    return res.status(200).json(card);
  } catch (error) {
    console.error('Error tracking card click:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 