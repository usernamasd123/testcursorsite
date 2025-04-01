import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testStats() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful');

    // Проверяем таблицы
    console.log('\nChecking tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables);

    // Проверяем сообщения
    console.log('\nChecking messages...');
    const messages = await prisma.message.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' }
    });
    console.log('Latest messages:', messages);

    // Проверяем диалоги
    console.log('\nChecking cards...');
    const cards = await prisma.card.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Latest cards:', cards);

    // Проверяем сессии пользователей
    console.log('\nChecking user sessions...');
    const sessions = await prisma.userSession.findMany({
      take: 5,
      orderBy: { lastMessageTime: 'desc' }
    });
    console.log('Latest user sessions:', sessions);

    // Проверяем статистику
    console.log('\nCalculating statistics...');
    const totalMessages = await prisma.message.count();
    const uniqueUsers = await prisma.userSession.count();
    const totalCards = await prisma.card.count();
    const totalLeads = await prisma.message.count({
      where: { isLead: true }
    });

    console.log('Statistics:', {
      totalMessages,
      uniqueUsers,
      totalCards,
      totalLeads
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStats(); 