import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId, type, sessionId } = req.body;

    if (!messageId || !type || !['like', 'dislike'].includes(type)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Если sessionId не предоставлен, используем дефолтную сессию
    const actualSessionId = sessionId || 'default-session';

    // Проверяем существование сообщения
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Создаем или обновляем реакцию
    const reaction = await prisma.messageReaction.upsert({
      where: {
        messageId_sessionId: {
          messageId,
          sessionId: actualSessionId
        }
      },
      update: {
        type
      },
      create: {
        messageId,
        sessionId: actualSessionId,
        type
      }
    });

    res.status(200).json(reaction);
  } catch (error) {
    console.error('Error in reaction API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 