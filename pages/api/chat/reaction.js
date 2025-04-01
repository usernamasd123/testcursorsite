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

    // Получаем текущее сообщение
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Обновляем сообщение с новой реакцией
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        reactions: {
          push: reaction
        }
      }
    });

    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error adding reaction:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 