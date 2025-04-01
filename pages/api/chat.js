export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, cardData } = req.body;

  // Проверяем наличие необходимых данных
  if (!message || !cardData) {
    return res.status(400).json({ 
      message: 'Отсутствуют необходимые данные',
      received: { message, cardData }
    });
  }

  // Проверяем наличие API ключа
  if (!process.env.OPENAI_API_KEY) {
    console.error('API Key is missing');
    return res.status(500).json({ 
      message: 'Ошибка конфигурации: отсутствует API ключ',
      error: 'OPENAI_API_KEY is not set'
    });
  }

  try {
    console.log('Starting request processing...');
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('Request data:', { message, cardData });

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Вы - помощник по вопросам о ${cardData.title}. 
          Используйте следующую информацию для ответов:
          - Название: ${cardData.title}
          - Описание: ${cardData.description}
          - Особенности: ${cardData.features.join(', ')}
          
          Отвечайте кратко и по существу.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Произошла ошибка при обработке запроса',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 