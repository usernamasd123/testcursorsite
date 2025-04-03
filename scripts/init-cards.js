import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    title: "TrafficPro",
    description: "Профессиональный поставщик трафика с фокусом на качество конверсий",
    type: "supplier",
    features: ["Высокая конверсия", "Таргетированный трафик", "Быстрый запуск"],
    budget: "от $5,000",
    sources: ["Facebook", "Instagram", "TikTok", "Google Ads"],
    advantages: ["Собственная система антифрода", "Персональный менеджер 24/7", "Еженедельные выплаты"],
    clicks: 0
  },
  {
    title: "MediaFlow",
    description: "Эксперты в нативной рекламе и контент-маркетинге",
    type: "supplier",
    features: ["Нативная реклама", "Контент-маркетинг", "PR"],
    budget: "от $3,000",
    sources: ["Telegram", "Яндекс.Дзен", "ВКонтакте", "Новостные сайты"],
    advantages: ["Собственная сеть площадок", "Прозрачная статистика", "Гарантия качества трафика"],
    clicks: 0
  },
  {
    title: "AppTraffic",
    description: "Специалисты по мобильному трафику и приложениям",
    type: "supplier",
    features: ["Мобильные приложения", "ASO", "Mobile UA"],
    budget: "от $10,000",
    sources: ["App Store", "Google Play", "Mobile Web", "In-App Ads"],
    advantages: ["Опыт с топовыми приложениями", "Таргетинг по устройствам", "Оплата за целевые действия"],
    clicks: 0
  }
];

const advertisers = [
  {
    title: "GameStudio",
    description: "Издатель мобильных игр ищет качественный трафик",
    type: "advertiser",
    features: ["Игровые приложения", "Высокий LTV", "Быстрая интеграция"],
    budget: "$50,000 - $100,000",
    goals: ["Привлечение платящих игроков", "Увеличение retention rate", "Рост DAU/MAU"],
    advantages: ["Быстрая модерация", "Высокие выплаты", "Масштабируемость"],
    clicks: 0
  },
  {
    title: "FinTech Pro",
    description: "Финансовая компания в поиске целевой аудитории",
    type: "advertiser",
    features: ["Финансовые продукты", "Высокий CPL", "Быстрые выплаты"],
    budget: "$30,000 - $70,000",
    goals: ["Привлечение инвесторов", "Регистрации с депозитом", "Активные трейдеры"],
    advantages: ["Высокие ставки", "Быстрая оплата", "Детальная аналитика"],
    clicks: 0
  },
  {
    title: "EduTech",
    description: "Образовательная платформа ищет мотивированных студентов",
    type: "advertiser",
    features: ["Онлайн-курсы", "Долгосрочное сотрудничество", "CPA"],
    budget: "$20,000 - $40,000",
    goals: ["Регистрации на пробные уроки", "Покупка курсов", "Долгосрочные подписки"],
    advantages: ["Высокий процент конверсии", "Регулярное обновление креативов", "Программа лояльности"],
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