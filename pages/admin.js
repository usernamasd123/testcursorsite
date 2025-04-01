import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке статистики');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Произошла ошибка при загрузке статистики. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Загружаем статистику при монтировании компонента
    fetchStats();

    // Устанавливаем интервал обновления каждые 30 секунд
    const interval = setInterval(fetchStats, 30000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-lg font-medium mb-2">Ошибка</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Загрузка статистики...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Обновить статистику
          </button>
        </div>

        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Всего сообщений</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.basic.totalMessages}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Сообщений от пользователей</h3>
            <p className="text-3xl font-bold text-green-600">{stats.basic.userMessages}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Сообщений от бота</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.basic.botMessages}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Уникальных пользователей</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.basic.uniqueUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Всего диалогов</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.basic.totalDialogues}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Среднее количество сообщений на пользователя</h3>
            <p className="text-3xl font-bold text-pink-600">{stats.basic.avgMessagesPerUser.toFixed(1)}</p>
          </div>
        </div>

        {/* Статистика по лидам */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Статистика по лидам</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.leads.map((lead) => (
              <div key={lead.leadType} className="bg-gray-50 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {lead.leadType === 'advertiser' ? 'Рекламодатели' : 'Поставщики'}
                </h3>
                <p className="text-2xl font-bold text-blue-600">{lead._count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Активность по часам */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Активность по часам</h2>
          <div className="grid grid-cols-12 gap-2">
            {stats.hourlyActivity.map((hour) => (
              <div key={hour.hour} className="bg-blue-50 rounded p-2 text-center">
                <div className="text-sm text-gray-600">{hour.hour}:00</div>
                <div className="text-lg font-bold text-blue-600">{hour._count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Качество ответов */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Качество ответов</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.ratings.map((rating) => (
              <div key={rating.rating} className="bg-gray-50 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {rating.rating === 'positive' ? 'Положительные' : 'Отрицательные'}
                </h3>
                <p className="text-2xl font-bold text-blue-600">{rating._count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ошибки бота */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ошибки бота</h2>
          <p className="text-3xl font-bold text-red-600">{stats.botErrors}</p>
        </div>

        {/* Возвращающиеся пользователи */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Возвращающиеся пользователи</h2>
          <p className="text-3xl font-bold text-green-600">{stats.returningRate.toFixed(1)}%</p>
        </div>

        {/* Популярные вопросы */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Популярные вопросы</h2>
          <ul className="space-y-2">
            {stats.popularQuestions.map((question, index) => (
              <li key={index} className="text-gray-600">{question.content}</li>
            ))}
          </ul>
        </div>

        {/* Популярность карточек */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Популярность карточек</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.cardPopularity.map((card) => (
              <div key={card.title} className="bg-gray-50 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-2">{card.title}</h3>
                <p className="text-2xl font-bold text-blue-600">{card.clicks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Среднее время между сообщениями */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Среднее время между сообщениями</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.avgTimeBetweenMessages.toFixed(1)} мин</p>
        </div>

        {/* Реакции на сообщения */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Реакции на сообщения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.reactions.map((reaction) => (
              <div key={reaction.reactions} className="bg-gray-50 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-2">{reaction.reactions}</h3>
                <p className="text-2xl font-bold text-blue-600">{reaction._count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 