import { useState } from 'react';
import ChatDialog from './ChatDialog';

export default function Card({ id, title, description, features, type, budget, budgetValue, experience, foundedYear, trafficSource, sources, goals, advantages }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleContactClick = async () => {
    try {
      const response = await fetch('/api/card/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to track click');
      }

      setIsChatOpen(true);
    } catch (error) {
      console.error('Ошибка при обработке клика:', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        
        {/* Опыт или год основания */}
        <div className="mb-4">
          <p className="text-gray-600">
            {type === 'supplier' ? `Опыт ${experience} лет` : `Основано в ${foundedYear}`}
          </p>
        </div>
        
        {/* Источник трафика */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Источник трафика</h3>
          <p className="text-blue-600">{trafficSource}</p>
        </div>

        {/* Бюджет */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {type === 'advertiser' ? 'Бюджет на месяц' : 'Минимальный бюджет'}
          </h3>
          <p className="text-blue-600 font-medium">{budget}</p>
        </div>

        {/* Источники трафика для поставщиков */}
        {type === 'supplier' && sources && sources.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Источники трафика</h3>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {source}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Цели для рекламодателей */}
        {type === 'advertiser' && goals && goals.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Хочет получить</h3>
            <ul className="space-y-2">
              {goals.map((goal, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Преимущества */}
        {advantages && advantages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Преимущества</h3>
            <ul className="space-y-2">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleContactClick}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Связаться
        </button>
      </div>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cardData={{ id, title, description, features, type, budget, budgetValue, experience, foundedYear, trafficSource, sources, goals, advantages }}
      />
    </>
  );
} 