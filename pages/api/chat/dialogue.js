import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cardId } = req.body;
    console.log('Создание диалога для карточки:', cardId);

    if (!cardId) {
      console.log('Ошибка: ID карточки не указан');
      return res.status(400).json({ message: 'Card ID is required' });
    }

    // Проверяем существование карточки
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      console.log('Ошибка: Карточка не найдена:', cardId);
      return res.status(404).json({ message: 'Card not found' });
    }

    console.log('Карточка найдена:', card);

    // Создаем диалог
    const dialogue = await prisma.dialogue.create({
      data: {
        cardId,
        startTime: new Date(),
        status: 'active'
      }
    });

    console.log('Диалог создан:', dialogue);
    res.status(200).json(dialogue);
  } catch (error) {
    console.error('Ошибка при создании диалога:', error);
    res.status(500).json({ message: 'Error creating dialogue', error: error.message });
  }
} 