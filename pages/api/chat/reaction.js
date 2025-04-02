import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messageId, type, sessionId } = req.body;

    if (!messageId || !type || !sessionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Проверяем существование сообщения
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Проверяем существование сессии
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      // Если сессия не найдена, создаем новую
      const newSession = await prisma.userSession.create({
        data: {
          id: sessionId,
          userId: 'default-user',
          messageCount: 0,
          isReturning: false,
          lastMessageTime: new Date(),
          messageTimes: []
        }
      });
    }

    // Создаем реакцию
    const reaction = await prisma.messageReaction.create({
      data: {
        messageId,
        sessionId,
        type
      }
    });

    res.status(201).json(reaction);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
} 