import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trafficSources = [
  'Meta Ads',
  'Google Ads',
  'YouTube Ads',
  'TikTok Ads',
  'Snapchat Ads',
  'Twitter Ads (X)',
  'Bing Ads',
  'LinkedIn Ads',
  'Push-трафик',
  'Native Ads',
  'Adult Traffic',
  'In-App',
  'Telegram каналы',
  'Спам',
  'WhatsApp рассылки',
  'Email маркетинг',
  'SEO',
  'Блоги',
  'Приложения Android',
  'Приложения iOS',
  'Telegram-боты',
  'YouTube каналы'
];

async function main() {
  // Очищаем существующие данные
  await prisma.card.deleteMany();
  await prisma.trafficSource.deleteMany();

  // Создаем источники трафика
  for (const source of trafficSources) {
    await prisma.trafficSource.create({
      data: {
        name: source
      }
    });
  }

  // Создаем карточки рекламодателей
  const advertisers = [
    {
      title: 'AdPro Marketing',
      description: 'Профессиональное продвижение вашего бизнеса в интернете',
      type: 'advertiser',
      features: ['Таргетированная реклама', 'SEO-оптимизация', 'Контекстная реклама', 'Аналитика'],
      budget: '1000',
      budgetValue: 1000,
      foundedYear: 2020,
      sources: ['Meta Ads', 'Google Ads'],
      goals: ['Увеличение продаж', 'Привлечение клиентов'],
      advantages: ['Быстрая поддержка', 'Гибкие условия']
    },
    {
      title: 'Digital Solutions',
      description: 'Комплексные решения для цифрового маркетинга',
      type: 'advertiser',
      features: ['Медийная реклама', 'Email-маркетинг', 'SMM', 'Веб-аналитика'],
      budget: '2000',
      budgetValue: 2000,
      foundedYear: 2019,
      sources: ['YouTube Ads', 'TikTok Ads'],
      goals: ['Повышение узнаваемости', 'Генерация лидов'],
      advantages: ['Индивидуальный подход', 'Прозрачная отчетность']
    }
  ];

  // Создаем карточки поставщиков трафика
  const suppliers = [
    {
      title: 'Traffic Masters',
      description: 'Качественный трафик для вашего бизнеса',
      type: 'supplier',
      features: ['Мобильный трафик', 'Десктопный трафик', 'Push-уведомления', 'Программатик'],
      budget: '1500',
      budgetValue: 1500,
      experience: 3,
      trafficSource: 'Meta Ads',
      sources: ['Meta Ads', 'Google Ads'],
      advantages: ['Высокая конверсия', 'Быстрый запуск']
    },
    {
      title: 'WebFlow',
      description: 'Инновационные решения для привлечения трафика',
      type: 'supplier',
      features: ['Нативная реклама', 'Тизерная реклама', 'Видеореклама', 'RTB'],
      budget: '2500',
      budgetValue: 2500,
      experience: 5,
      trafficSource: 'Google Ads',
      sources: ['Google Ads', 'YouTube Ads'],
      advantages: ['Качественный трафик', 'Гибкие условия']
    }
  ];

  // Добавляем все карточки в базу данных
  for (const card of [...advertisers, ...suppliers]) {
    const createdCard = await prisma.card.create({
      data: {
        ...card,
        trafficSources: {
          connect: card.sources.map(source => ({ name: source }))
        }
      }
    });
  }

  console.log('База данных успешно заполнена тестовыми данными');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 