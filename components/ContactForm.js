import { useState } from 'react';
import ChatDialog from './ChatDialog';

export default function ContactForm({ title, description }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 mb-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="telegram" className="block text-xs font-medium text-gray-700">
              Telegram контакт
            </label>
            <input
              type="text"
              name="telegram"
              id="telegram"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="@username"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs font-medium text-gray-700">
              Сообщение
            </label>
            <textarea
              name="message"
              id="message"
              rows={2}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Опишите вашу заявку..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            Отправить заявку
          </button>
        </form>
      </div>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cardData={{
          title: "Форма обратной связи",
          description: "Заполните форму, и мы свяжемся с вами для обсуждения деталей сотрудничества",
          features: ["Быстрый ответ", "Индивидуальный подход", "Профессиональная поддержка"]
        }}
      />
    </>
  );
} 