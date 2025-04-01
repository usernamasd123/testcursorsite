import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ message: 'Card ID is required' });
    }

    const dialogue = await prisma.dialogue.create({
      data: {
        cardId,
        startTime: new Date(),
        status: 'active'
      }
    });

    res.status(200).json(dialogue);
  } catch (error) {
    console.error('Error creating dialogue:', error);
    res.status(500).json({ message: 'Error creating dialogue' });
  }
} 