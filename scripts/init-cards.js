import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    title: "TraffExpert",
    description: "Специализируемся на Facebook Ads и Instagram Ads с высокой конверсией",
    type: "supplier",
    features: ["Таргетированная реклама", "Аналитика", "Оптимизация"],
    budget: "1000",
    budgetValue: 1000,
    experience: 5,
    trafficSource: "Facebook Ads",
    sources: ["Facebook Ads", "Instagram Ads"],
    advantages: ["Всегда на связи", "Прозрачная отчетность"],
    clicks: 0
  },
  {
    title: "TrafficMaster",
    description: "Профессиональный арбитраж трафика из TikTok и Facebook",
    type: "supplier",
    features: ["Таргетированная реклама", "Контент-маркетинг"],
    budget: "2000",
    budgetValue: 2000,
    experience: 3,
    trafficSource: "TikTok",
    sources: ["TikTok", "Facebook Ads"],
    advantages: ["Быстрый запуск", "Высокая конверсия"],
    clicks: 0
  },
  {
    title: "WebTraffic",
    description: "Качественный трафик из Google Ads с точным таргетингом",
    type: "supplier",
    features: ["Контекстная реклама", "Аналитика"],
    budget: "1500",
    budgetValue: 1500,
    experience: 4,
    trafficSource: "Google Ads",
    sources: ["Google Ads", "YouTube Ads"],
    advantages: ["Детальная аналитика", "Оптимизация ROI"],
    clicks: 0
  }
];

const advertisers = [
  {
    title: "GameStudio",
    description: "Мобильная игровая студия ищет качественный трафик для своих проектов",
    type: "advertiser",
    features: ["Мобильные игры", "Быстрые выплаты"],
    budget: "1000",
    budgetValue: 1000,
    foundedYear: 2022,
    trafficSource: "Facebook Ads",
    goals: ["Установки приложений", "Активные пользователи"],
    advantages: ["Стабильные выплаты", "Масштабируемость"],
    clicks: 0
  },
  {
    title: "CryptoTrade",
    description: "Криптовалютная платформа в поиске целевой аудитории",
    type: "advertiser",
    features: ["Криптовалюта", "Высокий CPL"],
    budget: "1000",
    budgetValue: 1000,
    foundedYear: 2021,
    trafficSource: "Google Ads",
    goals: ["Привлечение трейдеров", "Первые депозиты"],
    advantages: ["Высокие ставки", "Быстрые выплаты"],
    clicks: 0
  },
  {
    title: "TechSchool",
    description: "Онлайн-школа программирования ищет мотивированных студентов",
    type: "advertiser",
    features: ["IT курсы", "CPA"],
    budget: "1000",
    budgetValue: 1000,
    foundedYear: 2020,
    trafficSource: "Facebook Ads",
    goals: ["Заявки на обучение", "Продажи курсов"],
    advantages: ["Конкурентные условия", "Программа лояльности"],
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