import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">Добро пожаловать</h1>
        <div className="space-y-4">
          <Link href="/advertisers">
            <div className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors">
              Для рекламодателей
            </div>
          </Link>
          <Link href="/traffic-providers">
            <div className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors">
              Для поставщиков трафика
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 