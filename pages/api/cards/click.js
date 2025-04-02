import { prisma } from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cardId } = req.body;
    console.log('Получен запрос на клик для карточки:', cardId);

    if (!cardId) {
      console.log('Ошибка: ID карточки не указан');
      return res.status(400).json({ message: 'Missing cardId' });
    }

    // Проверяем существование карточки
    const existingCard = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!existingCard) {
      console.log('Ошибка: Карточка не найдена:', cardId);
      return res.status(404).json({ message: 'Card not found' });
    }

    console.log('Карточка найдена:', existingCard);

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        clicks: {
          increment: 1
        }
      }
    });

    console.log('Карточка обновлена:', card);
    return res.status(200).json(card);
  } catch (error) {
    console.error('Ошибка при обработке клика:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 