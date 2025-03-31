import Card from '../components/Card';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';

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

  const trafficProviders = [
    {
      title: "TrafficPro",
      description: "Профессиональный поставщик качественного трафика",
      features: [
        "Высокий CTR",
        "Геотаргетинг",
        "Подробная аналитика"
      ]
    },
    {
      title: "TrafficMaster",
      description: "Опытный партнер с большим охватом",
      features: [
        "Глобальный охват",
        "Гибкие условия",
        "Техническая поддержка"
      ]
    },
    {
      title: "TrafficExpert",
      description: "Специализированный трафик для вашего бизнеса",
      features: [
        "Нишевый трафик",
        "Высокое качество",
        "Индивидуальный подход"
      ]
    },
    {
      title: "TrafficFlow",
      description: "Стабильный поток целевого трафика",
      features: [
        "Постоянный объем",
        "Высокое качество",
        "Быстрая интеграция"
      ]
    },
    {
      title: "TrafficBoost",
      description: "Мощный источник трафика для роста",
      features: [
        "Масштабируемость",
        "Конкурентные цены",
        "Оперативная поддержка"
      ]
    },
    {
      title: "TrafficPrime",
      description: "Премиальный трафик для вашего бизнеса",
      features: [
        "Премиум-качество",
        "Гарантированные показатели",
        "Персональный менеджер"
      ]
    },
    {
      title: "TrafficSmart",
      description: "Умный трафик с AI-оптимизацией",
      features: [
        "AI-таргетинг",
        "Автоматическая оптимизация",
        "Умная аналитика"
      ]
    },
    {
      title: "TrafficGlobal",
      description: "Международный трафик высокого качества",
      features: [
        "Мультигео",
        "Мультиязычность",
        "Глобальная поддержка"
      ]
    },
    {
      title: "TrafficElite",
      description: "Элитный трафик для премиум-клиентов",
      features: [
        "VIP-поддержка",
        "Эксклюзивные условия",
        "Приоритетная обработка"
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
          <ContactForm 
            title="Подать заявку на подключение"
            description="Заполните форму, и мы свяжемся с вами для обсуждения деталей сотрудничества"
          />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Наши поставщики трафика</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trafficProviders.map((provider, index) => (
              <Card key={index} {...provider} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 