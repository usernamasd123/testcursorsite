import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, role, dialogueId, cardId, hour, isError } = req.body;

    if (!content || !role || !dialogueId || !cardId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Получаем диалог
    const dialogue = await prisma.dialogue.findUnique({
      where: { id: dialogueId }
    });

    if (!dialogue) {
      return res.status(404).json({ error: 'Dialogue not found' });
    }

    // Создаем сообщение
    const message = await prisma.message.create({
      data: {
        content,
        role,
        cardId,
        hour,
        isError: isError || false,
        sessionId: 'default-session' // Временно используем дефолтную сессию
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 