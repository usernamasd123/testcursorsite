import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';

export default function AdminCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards');
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту карточку?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Ошибка при удалении карточки');
    }
  };

  if (loading) return <AdminLayout><div>Загрузка...</div></AdminLayout>;
  if (error) return <AdminLayout><div>Ошибка: {error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление карточками</h1>
          <button
            onClick={() => router.push('/admin/cards/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить карточку
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-gray-600">{card.type === 'supplier' ? 'Поставщик трафика' : 'Рекламодатель'}</p>
                <p className="text-sm text-gray-500">
                  {card.type === 'supplier' 
                    ? `Опыт: ${card.experience} лет • Бюджет: $${card.budget}`
                    : `Основано: ${card.foundedYear} • Бюджет: $${card.budget}`
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/cards/${card.id}`)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
} 