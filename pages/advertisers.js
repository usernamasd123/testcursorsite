import Card from '../components/Card';

export default function Advertisers() {
  const cards = [
    {
      title: "Широкий охват аудитории",
      description: "Доступ к миллионам потенциальных клиентов",
      features: [
        "Глобальная аудитория",
        "Таргетированная реклама",
        "Высокий CTR"
      ]
    },
    {
      title: "Аналитика и отчетность",
      description: "Подробная статистика по всем кампаниям",
      features: [
        "Детальная аналитика",
        "Автоматические отчеты",
        "ROI-метрики"
      ]
    },
    {
      title: "Гибкие условия",
      description: "Настраиваемые параметры для вашего бизнеса",
      features: [
        "Гибкие бюджеты",
        "Разные форматы рекламы",
        "Индивидуальный подход"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Для рекламодателей</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
} 