import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Добро пожаловать в</span>
            <span className="block text-blue-600">AdTraffic</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Ваша платформа для эффективной рекламы и качественного трафика
          </p>
        </div>

        <div className="mt-10 max-w-xl mx-auto sm:mt-12 sm:max-w-lg md:mt-16 md:max-w-2xl lg:mx-0 lg:mt-20 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Link href="/advertisers">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Для рекламодателей</h3>
                    <p className="mt-1 text-sm text-gray-500">Эффективные рекламные кампании и широкий охват аудитории</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/traffic-providers">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-green-500 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Для поставщиков трафика</h3>
                    <p className="mt-1 text-sm text-gray-500">Монетизация трафика и высокие выплаты</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 