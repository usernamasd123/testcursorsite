import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const advertiserCards = [
  {
    id: "advertiser-wide",
    title: "Широкий охват аудитории",
    description: "Доступ к миллионам потенциальных клиентов",
    type: "advertiser",
    clicks: 0
  },
  {
    id: "advertiser-analytics",
    title: "Аналитика и отчетность",
    description: "Подробная статистика по всем кампаниям",
    type: "advertiser",
    clicks: 0
  },
  {
    id: "advertiser-flexible",
    title: "Гибкие условия",
    description: "Настраиваемые параметры для вашего бизнеса",
    type: "advertiser",
    clicks: 0
  }
];

async function initAdvertiserCards() {
  try {
    console.log('Начинаем инициализацию карточек рекламодателей...');
    
    for (const card of advertiserCards) {
      const existingCard = await prisma.card.findUnique({
        where: { id: card.id }
      });

      if (!existingCard) {
        await prisma.card.create({
          data: card
        });
        console.log(`Создана карточка рекламодателя: ${card.title}`);
      } else {
        console.log(`Карточка рекламодателя уже существует: ${card.title}`);
      }
    }

    console.log('Инициализация карточек рекламодателей завершена');
  } catch (error) {
    console.error('Ошибка при инициализации карточек рекламодателей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initAdvertiserCards(); 