import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messageId, type, sessionId } = req.body;

  if (!messageId || !type || !sessionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Проверяем существование сессии или создаем новую
    let session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      session = await prisma.userSession.create({
        data: { id: sessionId }
      });
    }

    // Проверяем существование сообщения
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Проверяем существующую реакцию
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageId,
        sessionId: sessionId
      }
    });

    let reaction;
    if (existingReaction) {
      // Обновляем существующую реакцию
      reaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type }
      });
    } else {
      // Создаем новую реакцию
      reaction = await prisma.reaction.create({
        data: {
          type,
          messageId,
          sessionId
        }
      });

      // Обновляем статистику
      await prisma.stats.update({
        where: { id: 1 },
        data: {
          [type === 'like' ? 'likes' : 'dislikes']: {
            increment: 1
          }
        },
        create: {
          id: 1,
          [type === 'like' ? 'likes' : 'dislikes']: 1
        }
      });
    }

    res.status(200).json(reaction);
  } catch (error) {
    console.error('Error handling reaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
} 