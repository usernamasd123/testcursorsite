import Card from '../components/Card';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Для рекламодателей
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Эффективные рекламные решения для вашего бизнеса
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