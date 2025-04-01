import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию при загрузке страницы
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchStats();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Testpassw13!') {
      localStorage.setItem('adminToken', 'admin-token');
      setIsAuthenticated(true);
      fetchStats();
    } else {
      setError('Неверные учетные данные');
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке статистики');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Произошла ошибка при загрузке статистики. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Вход в панель администратора</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Обновление...' : 'Обновить'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Выйти
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Навигация по разделам */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'main'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Основные метрики
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'quality'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Качество
          </button>
          <button
            onClick={() => setActiveTab('other')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'other'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Остальное
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'main' && (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Общая статистика</h2>
                  <div className="space-y-2">
                    <p>Всего диалогов: {stats.totalDialogs}</p>
                    <p>Сообщений пользователей: {stats.messages.user}</p>
                    <p>Сообщений бота: {stats.messages.bot}</p>
                    <p>Среднее количество сообщений на пользователя: {stats.avgMessagesPerUser}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Заявки</h2>
                  <div className="space-y-2">
                    <p>Рекламодатели: {stats.leads.advertisers}</p>
                    <p>Поставщики: {stats.leads.suppliers}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Активность по часам</h2>
                  <div className="space-y-2">
                    {stats.hourlyActivity.map((hour, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-20">{hour.hour}:00</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(hour.count / stats.maxHourlyActivity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{hour.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'quality' && (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Удовлетворенность ответами</h2>
                  <div className="space-y-2">
                    <p>👍 Положительные: {stats.ratings.positive}</p>
                    <p>👎 Отрицательные: {stats.ratings.negative}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Ошибки и повторные обращения</h2>
                  <div className="space-y-2">
                    <p>Ошибки бота: {stats.botErrors}</p>
                    <p>Процент повторных обращений: {stats.returningRate}%</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Топ-10 вопросов</h2>
                  <div className="space-y-2">
                    {stats.popularQuestions.map((q, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{q.question}</span>
                        <span className="text-gray-600">{q.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'other' && (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Популярность карточек</h2>
                  <div className="space-y-2">
                    {stats.cardPopularity.map((card, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{card.title}</span>
                        <span className="text-gray-600">{card.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Среднее время между сообщениями</h2>
                  <div className="space-y-2">
                    <p>{stats.avgTimeBetweenMessages} секунд</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Нет данных для отображения
          </div>
        )}
      </div>
    </div>
  );
} 