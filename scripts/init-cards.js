import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    title: "TraffExpert",
    description: "Опыт 5 лет",
    type: "supplier",
    features: ["Таргетированная реклама", "Аналитика", "Оптимизация"],
    budget: "от $1,000",
    budgetValue: 1000,
    experience: 5,
    trafficSource: "Facebook Ads",
    sources: ["Facebook Ads", "Instagram Ads", "Google Ads"],
    advantages: ["Всегда на связи", "Прозрачная отчетность", "Гибкие условия"],
    clicks: 0
  },
  {
    title: "TrafficMaster",
    description: "Опыт 3 года",
    type: "supplier",
    features: ["Нативная реклама", "Контент-маркетинг", "PR"],
    budget: "от $2,000",
    budgetValue: 2000,
    experience: 3,
    trafficSource: "Telegram",
    sources: ["Telegram", "Яндекс.Дзен", "ВКонтакте"],
    advantages: ["Быстрый запуск", "Высокая конверсия", "Еженедельные отчеты"],
    clicks: 0
  },
  {
    title: "WebTraffic",
    description: "Опыт 7 лет",
    type: "supplier",
    features: ["SEO", "Контекстная реклама", "Аналитика"],
    budget: "от $3,000",
    budgetValue: 3000,
    experience: 7,
    trafficSource: "Google Ads",
    sources: ["Google Ads", "Яндекс.Директ", "Bing Ads"],
    advantages: ["Комплексный подход", "Детальная аналитика", "Оптимизация ROI"],
    clicks: 0
  },
  {
    title: "MobileFlow",
    description: "Опыт 4 года",
    type: "supplier",
    features: ["Мобильная реклама", "ASO", "Push-уведомления"],
    budget: "от $5,000",
    budgetValue: 5000,
    experience: 4,
    trafficSource: "Mobile Apps",
    sources: ["Google Play", "App Store", "Huawei AppGallery"],
    advantages: ["Таргетинг по устройствам", "Высокий CR", "Масштабируемость"],
    clicks: 0
  }
];

const advertisers = [
  {
    title: "GameStudio",
    description: "Основано в 2022",
    type: "advertiser",
    features: ["Мобильные игры", "Быстрые выплаты", "Высокий ROI"],
    budget: "$1,000",
    budgetValue: 1000,
    foundedYear: 2022,
    trafficSource: "Facebook Ads",
    goals: ["Ищем качественный трафик", "Рост установок", "Увеличение удержания"],
    advantages: ["Стабильные выплаты", "Масштабируемость", "Быстрая модерация"],
    clicks: 0
  },
  {
    title: "CryptoTrade",
    description: "Основано в 2021",
    type: "advertiser",
    features: ["Криптовалюта", "Высокий CPL", "Быстрые выплаты"],
    budget: "$5,000",
    budgetValue: 5000,
    foundedYear: 2021,
    trafficSource: "Google Ads",
    goals: ["Привлечение трейдеров", "Регистрации", "Первые депозиты"],
    advantages: ["Высокие ставки", "Быстрые выплаты", "API интеграция"],
    clicks: 0
  },
  {
    title: "TechSchool",
    description: "Основано в 2020",
    type: "advertiser",
    features: ["IT курсы", "CPA", "Высокий LTV"],
    budget: "$3,000",
    budgetValue: 3000,
    foundedYear: 2020,
    trafficSource: "Instagram",
    goals: ["Заявки на обучение", "Продажи курсов", "Узнаваемость бренда"],
    advantages: ["Конкурентные условия", "Программа лояльности", "Реферальная система"],
    clicks: 0
  },
  {
    title: "FitLife",
    description: "Основано в 2023",
    type: "advertiser",
    features: ["Фитнес приложение", "Подписочная модель", "Retention focus"],
    budget: "$2,000",
    budgetValue: 2000,
    foundedYear: 2023,
    trafficSource: "TikTok",
    goals: ["Установки приложения", "Активные пользователи", "Подписки"],
    advantages: ["Уникальный продукт", "Высокий LTV", "Программа мотивации"],
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