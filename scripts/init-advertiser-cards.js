import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const advertiserCards = [
  {
    id: 'adpro',
    title: 'AdPro',
    description: 'Крупный рекламодатель с высокими бюджетами',
    type: 'advertiser',
    features: [
      'Высокие ставки',
      'Стабильные выплаты',
      'Долгосрочное сотрудничество'
    ]
  },
  {
    id: 'admaster',
    title: 'AdMaster',
    description: 'Опытный рекламодатель с разнообразными офферами',
    type: 'advertiser',
    features: [
      'Разные вертикали',
      'Гибкие условия',
      'Быстрые выплаты'
    ]
  },
  {
    id: 'adexpert',
    title: 'AdExpert',
    description: 'Специализированные рекламные кампании',
    type: 'advertiser',
    features: [
      'Нишевые офферы',
      'Высокий конверт',
      'Персональный подход'
    ]
  },
  {
    id: 'adflow',
    title: 'AdFlow',
    description: 'Стабильный рекламодатель с регулярными кампаниями',
    type: 'advertiser',
    features: [
      'Регулярные выплаты',
      'Прозрачные условия',
      'Техническая поддержка'
    ]
  },
  {
    id: 'adboost',
    title: 'AdBoost',
    description: 'Амбициозный рекламодатель с растущими бюджетами',
    type: 'advertiser',
    features: [
      'Растущие бюджеты',
      'Современные офферы',
      'Быстрая обработка'
    ]
  },
  {
    id: 'adprime',
    title: 'AdPrime',
    description: 'Премиальный рекламодатель с высокими ставками',
    type: 'advertiser',
    features: [
      'Премиум-ставки',
      'VIP-поддержка',
      'Эксклюзивные условия'
    ]
  },
  {
    id: 'adsmart',
    title: 'AdSmart',
    description: 'Инновационный рекламодатель с умными кампаниями',
    type: 'advertiser',
    features: [
      'AI-оптимизация',
      'Автоматизация',
      'Умная аналитика'
    ]
  },
  {
    id: 'adglobal',
    title: 'AdGlobal',
    description: 'Международный рекламодатель с глобальным охватом',
    type: 'advertiser',
    features: [
      'Мультигео',
      'Мультиязычность',
      'Глобальная поддержка'
    ]
  },
  {
    id: 'adelite',
    title: 'AdElite',
    description: 'Элитный рекламодатель с премиальными офферами',
    type: 'advertiser',
    features: [
      'Премиум-офферы',
      'VIP-поддержка',
      'Приоритетная обработка'
    ]
  }
];

async function initAdvertiserCards() {
  try {
    // Удаляем существующие карточки рекламодателей
    await prisma.card.deleteMany({
      where: { type: 'advertiser' }
    });

    // Создаем новые карточки
    for (const card of advertiserCards) {
      await prisma.card.create({
        data: card
      });
    }

    console.log('Карточки рекламодателей успешно инициализированы');
  } catch (error) {
    console.error('Ошибка при инициализации карточек:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initAdvertiserCards(); 