import Card from '../components/Card';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';

export default function TrafficProviders() {
  const advertisers = [
    {
      id: "adpro",
      title: "AdPro",
      description: "Крупный рекламодатель с высокими бюджетами",
      features: [
        "Высокие ставки",
        "Стабильные выплаты",
        "Долгосрочное сотрудничество"
      ]
    },
    {
      id: "admaster",
      title: "AdMaster",
      description: "Опытный рекламодатель с разнообразными офферами",
      features: [
        "Разные вертикали",
        "Гибкие условия",
        "Быстрые выплаты"
      ]
    },
    {
      id: "adexpert",
      title: "AdExpert",
      description: "Специализированные рекламные кампании",
      features: [
        "Нишевые офферы",
        "Высокий конверт",
        "Персональный подход"
      ]
    },
    {
      id: "adflow",
      title: "AdFlow",
      description: "Стабильный рекламодатель с регулярными кампаниями",
      features: [
        "Регулярные выплаты",
        "Прозрачные условия",
        "Техническая поддержка"
      ]
    },
    {
      id: "adboost",
      title: "AdBoost",
      description: "Амбициозный рекламодатель с растущими бюджетами",
      features: [
        "Растущие бюджеты",
        "Современные офферы",
        "Быстрая обработка"
      ]
    },
    {
      id: "adprime",
      title: "AdPrime",
      description: "Премиальный рекламодатель с высокими ставками",
      features: [
        "Премиум-ставки",
        "VIP-поддержка",
        "Эксклюзивные условия"
      ]
    },
    {
      id: "adsmart",
      title: "AdSmart",
      description: "Инновационный рекламодатель с умными кампаниями",
      features: [
        "AI-оптимизация",
        "Автоматизация",
        "Умная аналитика"
      ]
    },
    {
      id: "adglobal",
      title: "AdGlobal",
      description: "Международный рекламодатель с глобальным охватом",
      features: [
        "Мультигео",
        "Мультиязычность",
        "Глобальная поддержка"
      ]
    },
    {
      id: "adelite",
      title: "AdElite",
      description: "Элитный рекламодатель с премиальными офферами",
      features: [
        "Премиум-офферы",
        "VIP-поддержка",
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
            Для поставщиков трафика
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Монетизируйте ваш трафик с максимальной эффективностью
          </p>
        </div>

        <div className="mt-10">
          <ContactForm 
            title="Подать заявку на подключение"
            description="Заполните форму, и мы свяжемся с вами для обсуждения деталей сотрудничества"
          />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Наши рекламодатели</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {advertisers.map((advertiser) => (
              <Card 
                key={advertiser.id}
                id={advertiser.id}
                title={advertiser.title}
                description={advertiser.description}
                features={advertiser.features}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 