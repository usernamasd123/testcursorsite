import { PrismaClient } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';

const prisma = new PrismaClient();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, cardData } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const currentHour = new Date().getHours();

    // Создаем сообщение пользователя в базе данных
    const userMessage = await prisma.message.create({
      data: {
        content: message,
        role: 'user',
        cardId: cardData?.id,
        hour: currentHour
      }
    });

    // Обновляем статистику
    await prisma.stats.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        totalMessages: 1
      },
      update: {
        totalMessages: {
          increment: 1
        }
      }
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Вы - виртуальный помощник компании "${cardData?.title}". 
          Ваша задача - помогать пользователям узнать больше о компании и её услугах.
          Отвечайте вежливо и профессионально.`
        },
        { role: "user", content: message }
      ],
    });

    const assistantResponse = completion.data.choices[0].message.content;

    // Создаем сообщение ассистента в базе данных
    const assistantMessage = await prisma.message.create({
      data: {
        content: assistantResponse,
        role: 'assistant',
        cardId: cardData?.id,
        hour: currentHour
      }
    });

    // Обновляем статистику
    await prisma.stats.update({
      where: { id: 1 },
      data: {
        totalMessages: {
          increment: 1
        }
      }
    });

    res.status(200).json({ 
      message: assistantResponse,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  } finally {
    await prisma.$disconnect();
  }
} 