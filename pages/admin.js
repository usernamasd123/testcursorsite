import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Загружаем статистику при монтировании компонента
    fetchStats();

    // Добавляем обработчик события обновления статистики
    const handleStatsUpdate = () => {
      fetchStats();
    };
    window.addEventListener('statsUpdate', handleStatsUpdate);

    // Устанавливаем интервал обновления каждые 30 секунд
    const interval = setInterval(fetchStats, 30000);

    // Очищаем обработчики при размонтировании компонента
    return () => {
      clearInterval(interval);
      window.removeEventListener('statsUpdate', handleStatsUpdate);
    };
  }, []);

  if (loading) {
    return <div className="p-4">Загрузка статистики...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Ошибка: {error}</div>;
  }

  if (!stats) {
    return <div className="p-4">Нет данных</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Статистика</h1>

      {/* Базовые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Основные показатели</h2>
          <ul className="space-y-2">
            <li>Всего сообщений: {stats.basicMetrics.totalMessages}</li>
            <li>Сообщений бота: {stats.basicMetrics.botMessages}</li>
            <li>Уникальных пользователей: {stats.basicMetrics.uniqueUsers}</li>
            <li>Среднее кол-во сообщений на пользователя: {stats.basicMetrics.avgMessagesPerUser.toFixed(2)}</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Лиды и ошибки</h2>
          <ul className="space-y-2">
            <li>Всего лидов: {stats.leads.total}</li>
            <li>Ошибок бота: {stats.botErrors.total}</li>
            <li>Возвращающихся пользователей: {stats.returningRate.total}</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Активность по часам</h2>
          <div className="space-y-1">
            {stats.hourlyActivity.map(hour => (
              <div key={hour.hour} className="flex justify-between">
                <span>{hour.hour}:00</span>
                <span>{hour.count} сообщений</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Рейтинги */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Рейтинги</h2>
        <div className="space-y-2">
          {stats.ratings.distribution.map(rating => (
            <div key={rating.rating} className="flex justify-between">
              <span>{rating.rating || 'Без оценки'}</span>
              <span>{rating.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Популярные вопросы */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Популярные вопросы</h2>
        <div className="space-y-2">
          {stats.popularQuestions.map((q, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="font-medium">{q.question}</span>
                <span className="text-gray-500 ml-2">
                  (Последний раз: {new Date(q.lastAsked).toLocaleString()})
                </span>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {q.count} раз{q.count === 1 ? '' : 'а'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Популярность карточек */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Популярность карточек</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Карточки рекламодателей */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Рекламодатели</h4>
            <div className="space-y-2">
              {stats.cardPopularity.advertisers.map((card, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{card.title}</span>
                  <span className="text-sm font-medium text-gray-900">{card.clicks} кликов</span>
                </div>
              ))}
            </div>
          </div>
          {/* Карточки поставщиков */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Поставщики</h4>
            <div className="space-y-2">
              {stats.cardPopularity.suppliers.map((card, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{card.title}</span>
                  <span className="text-sm font-medium text-gray-900">{card.clicks} кликов</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 