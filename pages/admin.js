import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    // Обновляем статистику каждые 30 секунд
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center">
            <div className="text-2xl font-semibold mb-4">Загрузка статистики...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="text-center text-red-500">
            <div className="text-2xl font-semibold mb-4">{error}</div>
            <button 
              onClick={fetchStats}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  return (
    <>
      <Head>
        <title>Админ панель - Статистика</title>
      </Head>

      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Статистика</h1>

          {/* Основные метрики */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Всего сообщений
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalMessages || 0}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Сообщений за 24ч
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.messagesLast24h || 0}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Активных диалогов
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.activeDialogues || 0}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Реакции
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  👍 {stats.likes || 0} / 👎 {stats.dislikes || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Популярные вопросы */}
          {stats.popularQuestions && stats.popularQuestions.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Популярные вопросы
              </h2>
              <div className="space-y-4">
                {stats.popularQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="text-gray-900">{q.question}</div>
                      <div className="text-sm text-gray-500">
                        Последний раз: {new Date(q.lastAsked).toLocaleString()}
                      </div>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {q.count} раз
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* График активности по часам */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Активность по часам
            </h2>
            <div className="h-64 mt-6">
              <div className="relative h-full">
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                  {hourLabels.map((_, hour) => {
                    const count = stats.messagesByHour?.[hour] || 0;
                    const maxCount = Math.max(...Object.values(stats.messagesByHour || {}));
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div
                        key={hour}
                        className="flex-1 mx-0.5"
                        style={{ height: '100%' }}
                      >
                        <div
                          className="bg-blue-500 rounded-t"
                          style={{
                            height: `${height}%`,
                            transition: 'height 0.3s ease'
                          }}
                          title={`${count} сообщений`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-600 overflow-x-hidden">
                {hourLabels.filter((_, i) => i % 3 === 0).map(label => (
                  <div key={label} className="transform -rotate-45 origin-top-left translate-y-3">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Карточки по типам */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Рекламодатели */}
            {stats.cardPopularity?.advertisers && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Популярные рекламодатели
                </h2>
                <div className="space-y-4">
                  {stats.cardPopularity.advertisers.map((card, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-gray-900">{card.title}</span>
                      <span className="text-gray-500">{card.clicks} кликов</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Поставщики */}
            {stats.cardPopularity?.suppliers && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Популярные поставщики
                </h2>
                <div className="space-y-4">
                  {stats.cardPopularity.suppliers.map((card, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <span className="text-gray-900">{card.title}</span>
                      <span className="text-gray-500">{card.clicks} кликов</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 