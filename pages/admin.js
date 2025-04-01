import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
        setError('Произошла ошибка при загрузке статистики. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Загрузка статистики...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600">Нет данных для отображения</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Сообщения</h2>
            <div className="space-y-2">
              <p>Всего: {stats.basic.totalMessages}</p>
              <p>От пользователей: {stats.basic.userMessages}</p>
              <p>От бота: {stats.basic.botMessages}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
            <div className="space-y-2">
              <p>Уникальных: {stats.basic.uniqueUsers}</p>
              <p>Диалогов: {stats.basic.totalDialogues}</p>
              <p>Среднее сообщений на пользователя: {Math.round(stats.basic.avgMessagesPerUser * 100) / 100}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Качество</h2>
            <div className="space-y-2">
              <p>Ошибки бота: {stats.botErrors}</p>
              <p>Возвращающиеся пользователи: {Math.round(stats.returningRate)}%</p>
              <p>Среднее время между сообщениями: {Math.round(stats.avgTimeBetweenMessages)} мин</p>
            </div>
          </div>
        </div>

        {/* Статистика по лидам */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Заявки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.leads.map((lead) => (
              <div key={lead.leadType} className="p-4 bg-gray-50 rounded">
                <p className="font-medium">{lead.leadType === 'advertisers' ? 'Рекламодатели' : 'Поставщики'}</p>
                <p className="text-2xl font-bold">{lead._count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Популярность карточек */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Популярность карточек</h2>
          <div className="space-y-4">
            {stats.cardPopularity.map((card) => (
              <div key={card.title} className="flex justify-between items-center">
                <span>{card.title}</span>
                <span className="font-bold">{card.clicks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Активность по часам */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Активность по часам</h2>
          <div className="grid grid-cols-12 gap-2">
            {stats.hourlyActivity.map((hour) => (
              <div key={hour.hour} className="text-center">
                <div className="bg-blue-100 rounded-t-lg p-2">
                  <p className="text-sm font-medium">{hour.hour}:00</p>
                </div>
                <div className="bg-blue-600 text-white rounded-b-lg p-2">
                  <p className="text-sm font-bold">{hour._count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Популярные вопросы */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Популярные вопросы</h2>
          <div className="space-y-2">
            {stats.popularQuestions.map((question, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p>{question.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 