import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId, rating } = req.body;

    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        rating,
      },
    });

    return res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message rating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 