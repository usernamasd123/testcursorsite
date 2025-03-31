import Card from '../components/Card';

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
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Для поставщиков трафика</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
} 