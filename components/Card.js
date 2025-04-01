import { useState } from 'react';
import ChatDialog from './ChatDialog';

export default function Card({ title, description, features }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleContactClick = async () => {
    try {
      // Увеличиваем счетчик кликов
      await fetch('/api/cards/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: card.id
        }),
      });

      // Открываем чат
      onContactClick(card);
    } catch (error) {
      console.error('Error tracking card click:', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
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
        cardData={{ title, description, features }}
      />
    </>
  );
} 