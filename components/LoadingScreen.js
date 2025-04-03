export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Внешний круг */}
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {/* Внутренний круг */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        {/* Текст загрузки */}
        <div className="mt-4 text-lg font-medium text-gray-700">
          Загрузка...
        </div>
        {/* Точки загрузки */}
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
} 