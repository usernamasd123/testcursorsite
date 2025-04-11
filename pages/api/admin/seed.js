import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testCards = [
  {
    title: 'Криптовалютная биржа Binance',
    description: 'Ведущая мировая криптовалютная биржа с высоким объемом торгов',
    type: 'advertiser',
    budget: '50000',
    foundedYear: 2017,
    goals: ['Привлечение новых пользователей', 'Увеличение объема торгов', 'Продвижение новых продуктов'],
    advantages: ['Высокая ликвидность', 'Низкие комиссии', 'Широкий выбор активов'],
    features: ['Мобильное приложение', 'API для трейдинга', 'Фьючерсы и опционы'],
    trafficSources: ['CryptoTrade', 'Binance', 'CoinMarketCap']
  },
  {
    title: 'Крипто-кошелек Trust Wallet',
    description: 'Безопасный мультивалютный кошелек с поддержкой DeFi',
    type: 'advertiser',
    budget: '30000',
    foundedYear: 2017,
    goals: ['Увеличение установок приложения', 'Продвижение DeFi сервисов', 'Обучение пользователей'],
    advantages: ['Мультивалютность', 'Безопасность', 'Интеграция с DeFi'],
    features: ['Холодное хранение', 'Стейкинг', 'NFT поддержка'],
    trafficSources: ['CryptoTrade', 'Trust Wallet', 'DeFi Pulse']
  },
  {
    title: 'NFT маркетплейс OpenSea',
    description: 'Крупнейший маркетплейс для торговли NFT',
    type: 'advertiser',
    budget: '40000',
    foundedYear: 2017,
    goals: ['Привлечение художников', 'Увеличение объема продаж', 'Расширение коллекций'],
    advantages: ['Низкие комиссии', 'Широкий выбор', 'Простота использования'],
    features: ['Аукционы', 'Роялти для создателей', 'Мультичейн поддержка'],
    trafficSources: ['CryptoTrade', 'OpenSea', 'NFT Calendar']
  },
  {
    title: 'Крипто-трафик агентство CryptoAds',
    description: 'Специализированное агентство по привлечению трафика для криптопроектов',
    type: 'supplier',
    budget: '20000',
    experience: 5,
    goals: ['Привлечение инвесторов', 'Продвижение ICO', 'Увеличение пользовательской базы'],
    advantages: ['Опытная команда', 'Высокая конверсия', 'Гибкие тарифы'],
    features: ['Таргетированная реклама', 'Email-маркетинг', 'Контент-маркетинг'],
    trafficSources: ['CryptoTrade', 'Binance', 'CoinMarketCap']
  },
  {
    title: 'Крипто-маркетинг студия BlockPromo',
    description: 'Комплексное продвижение криптопроектов',
    type: 'supplier',
    budget: '25000',
    experience: 4,
    goals: ['Повышение узнаваемости', 'Привлечение инвестиций', 'Увеличение активности'],
    advantages: ['Креативный подход', 'Глубокая аналитика', 'Индивидуальные решения'],
    features: ['SMM продвижение', 'PR кампании', 'Влиятельные лица'],
    trafficSources: ['CryptoTrade', 'Trust Wallet', 'DeFi Pulse']
  },
  {
    title: 'Крипто-консалтинг CryptoConsult',
    description: 'Профессиональные консультации по продвижению криптопроектов',
    type: 'supplier',
    budget: '15000',
    experience: 3,
    goals: ['Оптимизация маркетинга', 'Увеличение ROI', 'Стратегическое планирование'],
    advantages: ['Экспертные знания', 'Персональный подход', 'Результативность'],
    features: ['Аудит проектов', 'Стратегия продвижения', 'Анализ конкурентов'],
    trafficSources: ['CryptoTrade', 'OpenSea', 'NFT Calendar']
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Создаем источники трафика, если их нет
    const trafficSources = ['CryptoTrade', 'Binance', 'CoinMarketCap', 'Trust Wallet', 'DeFi Pulse', 'OpenSea', 'NFT Calendar'];
    
    for (const sourceName of trafficSources) {
      await prisma.trafficSource.upsert({
        where: { name: sourceName },
        update: {},
        create: { name: sourceName }
      });
    }

    // Удаляем существующие карточки
    await prisma.card.deleteMany({});

    // Создаем новые карточки
    for (const cardData of testCards) {
      const { trafficSources, ...cardFields } = cardData;
      
      await prisma.card.create({
        data: {
          ...cardFields,
          trafficSources: {
            create: trafficSources.map(sourceName => ({
              trafficSource: {
                connect: {
                  name: sourceName
                }
              }
            }))
          }
        }
      });
    }

    res.status(200).json({ message: 'Тестовые данные успешно созданы' });
  } catch (error) {
    console.error('Ошибка при создании тестовых данных:', error);
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
} 