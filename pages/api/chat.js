export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, cardData } = req.body;

  try {
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

    const data = await response.json();
    res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Произошла ошибка при обработке запроса' });
  }
} 