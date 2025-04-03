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
    let session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    // Если сессия не существует, создаем новую
    if (!session) {
      session = await prisma.session.create({
        data: { id: sessionId }
      });
    }

    // Проверяем существование реакции
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: messageId,
        sessionId: sessionId
      }
    });

    if (existingReaction) {
      // Обновляем существующую реакцию
      const updatedReaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type }
      });
      return res.status(200).json(updatedReaction);
    }

    // Создаем новую реакцию
    const reaction = await prisma.reaction.create({
      data: {
        messageId,
        type,
        sessionId
      }
    });

    // Обновляем статистику
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

    return res.status(200).json(reaction);
  } catch (error) {
    console.error('Error saving reaction:', error);
    return res.status(500).json({ error: 'Failed to save reaction' });
  } finally {
    await prisma.$disconnect();
  }
} 