import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trafficProviders = [
  {
    id: "traffic-pro",
    title: "TrafficPro",
    description: "Профессиональный поставщик качественного трафика",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-master",
    title: "TrafficMaster",
    description: "Опытный партнер с большим охватом",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-expert",
    title: "TrafficExpert",
    description: "Специализированный трафик для вашего бизнеса",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-flow",
    title: "TrafficFlow",
    description: "Стабильный поток целевого трафика",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-boost",
    title: "TrafficBoost",
    description: "Мощный источник трафика для роста",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-prime",
    title: "TrafficPrime",
    description: "Премиальный трафик для вашего бизнеса",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-smart",
    title: "TrafficSmart",
    description: "Умный трафик с AI-оптимизацией",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-global",
    title: "TrafficGlobal",
    description: "Международный трафик высокого качества",
    type: "supplier",
    clicks: 0
  },
  {
    id: "traffic-elite",
    title: "TrafficElite",
    description: "Элитный трафик для премиум-клиентов",
    type: "supplier",
    clicks: 0
  }
];

async function initCards() {
  try {
    console.log('Начинаем инициализацию карточек...');
    
    for (const provider of trafficProviders) {
      const existingCard = await prisma.card.findUnique({
        where: { id: provider.id }
      });

      if (!existingCard) {
        await prisma.card.create({
          data: provider
        });
        console.log(`Создана карточка: ${provider.title}`);
      } else {
        console.log(`Карточка уже существует: ${provider.title}`);
      }
    }

    console.log('Инициализация карточек завершена');
  } catch (error) {
    console.error('Ошибка при инициализации карточек:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCards(); 