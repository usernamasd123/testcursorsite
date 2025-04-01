import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messageId, reaction } = req.body;

    if (!messageId || !reaction) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: {
          push: reaction
        }
      }
    });

    return res.status(200).json(message);
  } catch (error) {
    console.error('Error adding reaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 