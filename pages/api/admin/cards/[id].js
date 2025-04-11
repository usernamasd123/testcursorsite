import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const {
        title,
        description,
        type,
        budget,
        experience,
        foundedYear,
        trafficSources,
        goals,
        advantages,
        features
      } = req.body;

      // Подготавливаем данные для обновления
      const updateData = {
        title: title.trim(),
        description: description.trim(),
        type,
        budget: String(budget || '0'),
        budgetValue: parseInt(budget || '0', 10),
        experience: type === 'supplier' ? parseInt(experience || '0', 10) : null,
        foundedYear: type === 'advertiser' ? parseInt(foundedYear || '0', 10) : null,
        goals: Array.isArray(goals) ? goals : [],
        advantages: Array.isArray(advantages) ? advantages : [],
        features: Array.isArray(features) ? features : []
      };

      // Обновляем карточку
      const updatedCard = await prisma.card.update({
        where: { id },
        data: updateData
      });

      // Обновляем связи с источниками трафика
      if (Array.isArray(trafficSources)) {
        // Удаляем все существующие связи
        await prisma.cardTrafficSource.deleteMany({
          where: { cardId: id }
        });

        // Создаем новые связи
        for (const sourceName of trafficSources) {
          const source = await prisma.trafficSource.findFirst({
            where: { name: sourceName }
          });

          if (source) {
            await prisma.cardTrafficSource.create({
              data: {
                cardId: id,
                trafficSourceId: source.id
              }
            });
          }
        }
      }

      res.status(200).json(updatedCard);
    } else if (req.method === 'DELETE') {
      await prisma.card.delete({
        where: { id }
      });
      res.status(200).json({ message: 'Карточка удалена' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await prisma.$disconnect();
  }
} 