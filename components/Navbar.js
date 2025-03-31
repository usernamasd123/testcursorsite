import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">AdTraffic</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/advertisers" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Рекламодателям
              </Link>
              <Link href="/traffic-providers" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Поставщикам трафика
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 