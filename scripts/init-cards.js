import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trafficProviders = [
  {
    id: "traffic-pro",
    title: "TrafficPro",
    description: "Профессиональный поставщик качественного трафика",
    type: "supplier",
    clicks: 0,
    features: [
      "Высокое качество трафика",
      "Быстрая обработка заявок",
      "Гибкие условия"
    ]
  },
  {
    id: "traffic-master",
    title: "TrafficMaster",
    description: "Опытный партнер с большим охватом",
    type: "supplier",
    clicks: 0,
    features: [
      "Большой охват аудитории",
      "Стабильные объемы",
      "Подробная аналитика"
    ]
  },
  {
    id: "traffic-expert",
    title: "TrafficExpert",
    description: "Специализированный трафик для вашего бизнеса",
    type: "supplier",
    clicks: 0,
    features: [
      "Целевой трафик",
      "Оптимизация под задачи",
      "Техническая поддержка"
    ]
  },
  {
    id: "traffic-flow",
    title: "TrafficFlow",
    description: "Стабильный поток целевого трафика",
    type: "supplier",
    clicks: 0,
    features: [
      "Стабильные объемы",
      "Регулярные выплаты",
      "Прозрачная статистика"
    ]
  },
  {
    id: "traffic-boost",
    title: "TrafficBoost",
    description: "Мощный источник трафика для роста",
    type: "supplier",
    clicks: 0,
    features: [
      "Быстрый старт",
      "Масштабируемость",
      "Оптимизация ROI"
    ]
  },
  {
    id: "traffic-prime",
    title: "TrafficPrime",
    description: "Премиальный трафик для вашего бизнеса",
    type: "supplier",
    clicks: 0,
    features: [
      "Премиум-качество",
      "VIP-поддержка",
      "Эксклюзивные условия"
    ]
  },
  {
    id: "traffic-smart",
    title: "TrafficSmart",
    description: "Умный трафик с AI-оптимизацией",
    type: "supplier",
    clicks: 0,
    features: [
      "AI-оптимизация",
      "Автоматизация",
      "Умная аналитика"
    ]
  },
  {
    id: "traffic-global",
    title: "TrafficGlobal",
    description: "Международный трафик высокого качества",
    type: "supplier",
    clicks: 0,
    features: [
      "Мультигео",
      "Мультиязычность",
      "Глобальная поддержка"
    ]
  },
  {
    id: "traffic-elite",
    title: "TrafficElite",
    description: "Элитный трафик для премиум-клиентов",
    type: "supplier",
    clicks: 0,
    features: [
      "Премиум-трафик",
      "VIP-поддержка",
      "Приоритетная обработка"
    ]
  }
];

async function initCards() {
  try {
    console.log('Начинаем инициализацию карточек...');

    // Удаляем существующие карточки поставщиков
    await prisma.card.deleteMany({
      where: { type: 'supplier' }
    });

    // Создаем новые карточки
    for (const card of trafficProviders) {
      const createdCard = await prisma.card.create({
        data: card
      });
      console.log('Создана карточка:', createdCard.title);
    }

    console.log('Инициализация карточек завершена');
  } catch (error) {
    console.error('Ошибка при инициализации карточек:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCards(); 