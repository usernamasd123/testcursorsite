import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/cards');
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setCards(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке карточек:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
      try {
        const response = await fetch(`/api/admin/cards/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        setCards(cards.filter(card => card.id !== id));
      } catch (err) {
        console.error('Ошибка при удалении карточки:', err);
        alert('Ошибка при удалении карточки');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Карточки</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Карточки</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Ошибка при загрузке карточек: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Карточки</h1>
        <Link href="/admin/cards/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Создать карточку
        </Link>
      </div>

      {cards.length === 0 ? (
        <p>Нет доступных карточек</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600 mb-2">{card.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {card.trafficSources?.map(source => (
                  <span key={source.id} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {source.trafficSource.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/cards/${card.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 