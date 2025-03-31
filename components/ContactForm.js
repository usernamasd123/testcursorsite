export default function ContactForm({ title, description }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const telegram = e.target.telegram.value;
    const message = e.target.message.value;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}&text=${encodeURIComponent(`Новая заявка от: ${telegram}\nСообщение: ${message}`)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
            Telegram контакт
          </label>
          <input
            type="text"
            name="telegram"
            id="telegram"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="@username"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Сообщение
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Опишите вашу заявку..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Отправить заявку
        </button>
      </form>
    </div>
  );
} 