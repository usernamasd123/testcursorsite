import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очищаем существующие данные
  await prisma.card.deleteMany();

  // Создаем карточки рекламодателей
  const advertisers = [
    {
      title: 'AdPro Marketing',
      description: 'Профессиональное продвижение вашего бизнеса в интернете',
      type: 'advertiser',
      features: ['Таргетированная реклама', 'SEO-оптимизация', 'Контекстная реклама', 'Аналитика']
    },
    {
      title: 'Digital Solutions',
      description: 'Комплексные решения для цифрового маркетинга',
      type: 'advertiser',
      features: ['Медийная реклама', 'Email-маркетинг', 'SMM', 'Веб-аналитика']
    }
  ];

  // Создаем карточки поставщиков трафика
  const suppliers = [
    {
      title: 'Traffic Masters',
      description: 'Качественный трафик для вашего бизнеса',
      type: 'supplier',
      features: ['Мобильный трафик', 'Десктопный трафик', 'Push-уведомления', 'Программатик']
    },
    {
      title: 'WebFlow',
      description: 'Инновационные решения для привлечения трафика',
      type: 'supplier',
      features: ['Нативная реклама', 'Тизерная реклама', 'Видеореклама', 'RTB']
    }
  ];

  // Добавляем все карточки в базу данных
  for (const card of [...advertisers, ...suppliers]) {
    await prisma.card.create({
      data: card
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