import Card from '../components/Card';
import Navbar from '../components/Navbar';

export default function TrafficProviders() {
  const cards = [
    {
      title: "Высокие выплаты",
      description: "Конкурентные условия для партнеров",
      features: [
        "Еженедельные выплаты",
        "Прозрачные условия",
        "Бонусная программа"
      ]
    },
    {
      title: "Техническая поддержка",
      description: "Профессиональная помощь 24/7",
      features: [
        "Дедicated менеджер",
        "Быстрая поддержка",
        "Техническая документация"
      ]
    },
    {
      title: "Инструменты для роста",
      description: "Все необходимое для масштабирования",
      features: [
        "API доступ",
        "Мониторинг статистики",
        "Обучающие материалы"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Для поставщиков трафика
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Монетизируйте ваш трафик с максимальной эффективностью
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 