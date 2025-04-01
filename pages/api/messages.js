import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content, role, userId, cardId, responseTime, hour } = req.body;

    const message = await prisma.message.create({
      data: {
        content,
        role,
        userId,
        cardId,
        responseTime,
        hour,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 