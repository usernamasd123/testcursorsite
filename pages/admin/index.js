import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function AdminPage() {
  const router = useRouter();
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

  const hourLabels = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
        
        {loading ? (
          <div className="text-center">
            <div className="text-2xl font-semibold mb-4">Загрузка статистики...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <div className="text-2xl font-semibold mb-4">{error}</div>
            <button 
              onClick={fetchStats}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Попробовать снова
            </button>
          </div>
        ) : stats && (
          <>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {hourLabels.map((label, hour) => {
                  const count = stats.messagesByHour?.[hour] || 0;
                  return (
                    <div key={hour} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-blue-600">{count}</span>
                    </div>
                  );
                })}
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
                        <div className="flex-1">
                          <div className="text-gray-900">{card.title}</div>
                          <div className="text-sm text-gray-500">
                            Просмотров: {card.views}
                          </div>
                        </div>
                        <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          {card.clicks} кликов
                        </span>
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
                        <div className="flex-1">
                          <div className="text-gray-900">{card.title}</div>
                          <div className="text-sm text-gray-500">
                            Просмотров: {card.views}
                          </div>
                        </div>
                        <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          {card.clicks} кликов
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {/* Карточка для управления карточками */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Управление карточками</h2>
            <p className="text-gray-600 mb-4">Добавление, редактирование и удаление карточек поставщиков и рекламодателей</p>
            <button
              onClick={() => router.push('/admin/cards')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Перейти к управлению
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 