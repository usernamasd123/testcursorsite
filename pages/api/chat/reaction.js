import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId, type, sessionId } = req.body;

    if (!messageId || !type || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Проверяем существование сессии
    let session = await prisma.userSession.findUnique({
      where: { userId: sessionId }
    });

    // Если сессия не существует, создаем новую
    if (!session) {
      session = await prisma.userSession.create({
        data: {
          userId: sessionId,
          messageCount: 0,
          isReturning: false,
          lastMessageTime: new Date(),
          messageTimes: []
        }
      });
    }

    // Проверяем существование сообщения
    const message = await prisma.message.findFirst({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Проверяем существование реакции
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId: messageId,
        sessionId: session.id
      }
    });

    let reaction;

    if (existingReaction) {
      // Обновляем существующую реакцию
      reaction = await prisma.messageReaction.update({
        where: { id: existingReaction.id },
        data: { type }
      });
    } else {
      // Создаем новую реакцию
      reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          type,
          sessionId: session.id
        }
      });

      // Обновляем статистику только для новых реакций
      await prisma.stats.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          [type === 'like' ? 'likes' : 'dislikes']: 1
        },
        update: {
          [type === 'like' ? 'likes' : 'dislikes']: {
            increment: 1
          }
        }
      });
    }

    return res.status(200).json(reaction);
  } catch (error) {
    console.error('Error saving reaction:', error);
    return res.status(500).json({ error: 'Failed to save reaction' });
  } finally {
    await prisma.$disconnect();
  }
} 