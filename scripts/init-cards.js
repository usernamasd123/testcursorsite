import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    title: "TrafficPro",
    description: "Профессиональный поставщик качественного трафика с многолетним опытом",
    type: "supplier",
    features: ["Высокое качество трафика", "Быстрая обработка заявок", "Гибкие условия"],
    budget: "от 100 000 ₽",
    sources: ["Facebook", "Instagram", "Google Ads", "Яндекс.Директ"],
    advantages: ["Собственная система антифрода", "Персональный менеджер", "Еженедельные выплаты"],
    clicks: 0
  },
  {
    title: "TrafficMaster",
    description: "Надежный поставщик трафика для масштабирования вашего бизнеса",
    type: "supplier",
    features: ["Таргетированный трафик", "Масштабируемые объемы", "Прозрачная статистика"],
    budget: "от 150 000 ₽",
    sources: ["TikTok", "YouTube", "Telegram", "VK"],
    advantages: ["Уникальные рекламные форматы", "API интеграция", "Гарантия качества"],
    clicks: 0
  },
  {
    title: "TrafficExpert",
    description: "Эксперты в области мобильного и веб-трафика",
    type: "supplier",
    features: ["Мобильный трафик", "Веб-трафик", "Push-уведомления"],
    budget: "от 200 000 ₽",
    sources: ["Mobile Apps", "Push Traffic", "Email Marketing", "Native Ads"],
    advantages: ["Собственная рекламная сеть", "Таргетинг по GEO", "Оптимизация ROI"],
    clicks: 0
  }
];

const advertisers = [
  {
    title: "AdPro Marketing",
    description: "Крупное маркетинговое агентство с международным присутствием",
    type: "advertiser",
    features: ["Международные кампании", "Мультиязычные проекты", "Высокая конверсия"],
    budget: "500 000 ₽ - 1 000 000 ₽",
    goals: ["Увеличение продаж", "Масштабирование на новые рынки", "Повышение узнаваемости бренда"],
    advantages: ["Быстрый запуск кампаний", "Оплата за результат", "Премиальная поддержка"],
    clicks: 0
  },
  {
    title: "Digital Solutions",
    description: "Инновационное агентство цифрового маркетинга",
    type: "advertiser",
    features: ["Digital-стратегии", "Performance-маркетинг", "Аналитика"],
    budget: "300 000 ₽ - 600 000 ₽",
    goals: ["Лиды для B2B", "Автоматизация маркетинга", "Повышение ROI"],
    advantages: ["AI-оптимизация кампаний", "Прозрачная отчетность", "Гибкие условия"],
    clicks: 0
  },
  {
    title: "Growth Hackers",
    description: "Агентство роста с фокусом на быстрые результаты",
    type: "advertiser",
    features: ["Growth Hacking", "A/B тестирование", "Быстрое масштабирование"],
    budget: "400 000 ₽ - 800 000 ₽",
    goals: ["Быстрый рост", "Оптимизация воронки", "Увеличение LTV"],
    advantages: ["Инновационные подходы", "Быстрые итерации", "Фокус на метриках"],
    clicks: 0
  }
];

async function initCards() {
  try {
    // Удаляем существующие карточки
    await prisma.card.deleteMany();

    // Создаем карточки поставщиков
    for (const supplier of suppliers) {
      await prisma.card.create({
        data: supplier
      });
    }

    // Создаем карточки рекламодателей
    for (const advertiser of advertisers) {
      await prisma.card.create({
        data: advertiser
      });
    }

    console.log('Карточки успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании карточек:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCards(); 