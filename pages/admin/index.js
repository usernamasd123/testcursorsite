import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function AdminPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Здесь можно добавить другие карточки для управления другими разделами */}
        </div>
      </div>
    </AdminLayout>
  );
} 