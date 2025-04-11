import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import AdminLayout from '../../../components/AdminLayout';

export default function EditCard({ card, trafficSources }) {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'advertiser',
    features: [],
    budget: '',
    budgetValue: 0,
    experience: 0,
    foundedYear: 0,
    trafficSources: [],
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

  useEffect(() => {
    if (card) {
      setFormData({
        ...card,
        budget: card.budget || '',
        budgetValue: card.budgetValue || 0,
        experience: card.experience || 0,
        foundedYear: card.foundedYear || 0,
        trafficSources: card.trafficSources?.map(ts => ts.name) || [],
        goals: card.goals || [],
        advantages: card.advantages || []
      });
    }
  }, [card]);

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

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split('\n').filter(item => item.trim() !== '')
    }));
  };

  const handleTrafficSourceChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      trafficSources: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/cards/${card?.id || ''}`, {
        method: card ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/cards');
      } else {
        console.error('Ошибка при сохранении карточки');
      }
    } catch (error) {
      console.error('Ошибка:', error);
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

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4" onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Тип</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="advertiser">Рекламодатель</option>
              <option value="supplier">Поставщик трафика</option>
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

          {formData.type === 'advertiser' ? (
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Опыт работы (лет)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
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
            <label className="block text-sm font-medium text-gray-700">Источники трафика</label>
            <select
              name="trafficSources"
              multiple
              value={formData.trafficSources}
              onChange={handleTrafficSourceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              size="5"
            >
              {trafficSources.map(source => (
                <option key={source.id} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Удерживайте Ctrl (или Command на Mac) для выбора нескольких источников
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Цели</label>
            <textarea
              name="goals"
              value={formData.goals.join('\n')}
              onChange={handleArrayChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Преимущества</label>
            <textarea
              name="advantages"
              value={formData.advantages.join('\n')}
              onChange={handleArrayChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
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

export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const { id } = context.params;

  try {
    const card = id ? await prisma.card.findUnique({
      where: { id },
      include: {
        trafficSources: true
      }
    }) : null;

    const trafficSources = await prisma.trafficSource.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return {
      props: {
        card: card ? {
          ...card,
          createdAt: card.createdAt.toISOString(),
          updatedAt: card.updatedAt.toISOString()
        } : null,
        trafficSources
      }
    };
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return {
      props: {
        card: null,
        trafficSources: []
      }
    };
  } finally {
    await prisma.$disconnect();
  }
} 