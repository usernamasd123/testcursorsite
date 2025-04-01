export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, cardData } = req.body;

  try {
    console.log('API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('Request data:', { message, cardData });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);
    res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    res.status(500).json({ 
      message: 'Произошла ошибка при обработке запроса',
      error: error.message 
    });
  }
} 