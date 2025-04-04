import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';

export default function EditCard() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'supplier',
    budget: '',
    budgetValue: 0,
    experience: '',
    foundedYear: '',
    trafficSource: '',
    sources: [],
    goals: [],
    advantages: []
  });

  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isNew && id) {
      fetchCard();
    }
  }, [id]);

  const fetchCard = async () => {
    try {
      const response = await fetch(`/api/admin/cards/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch card');
      }
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/admin/cards' : `/api/admin/cards/${id}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      router.push('/admin/cards');
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Ошибка при сохранении карточки');
    }
  };

  if (loading) return <AdminLayout><div>Загрузка...</div></AdminLayout>;
  if (error) return <AdminLayout><div>Ошибка: {error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isNew ? 'Создание новой карточки' : 'Редактирование карточки'}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Тип</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="supplier">Поставщик трафика</option>
              <option value="advertiser">Рекламодатель</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {formData.type === 'supplier' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Опыт (лет)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Год основания</label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Бюджет</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Значение бюджета</label>
            <input
              type="number"
              name="budgetValue"
              value={formData.budgetValue}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Источник трафика</label>
            <input
              type="text"
              name="trafficSource"
              value={formData.trafficSource}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {formData.type === 'supplier' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Источники трафика (через запятую)</label>
              <input
                type="text"
                value={formData.sources.join(', ')}
                onChange={(e) => handleArrayChange(e, 'sources')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.type === 'advertiser' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Цели (через запятую)</label>
              <input
                type="text"
                value={formData.goals.join(', ')}
                onChange={(e) => handleArrayChange(e, 'goals')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Преимущества (через запятую)</label>
            <input
              type="text"
              value={formData.advantages.join(', ')}
              onChange={(e) => handleArrayChange(e, 'advantages')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {isNew ? 'Создать' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/cards')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 