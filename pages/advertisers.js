import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';

export default function Advertisers() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards?type=advertiser');
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const trafficProviders = [
    {
      id: "traffic-pro",
      title: "TrafficPro",
      description: "Профессиональный поставщик качественного трафика",
      features: [
        "Высокий CTR",
        "Геотаргетинг",
        "Подробная аналитика"
      ]
    },
    {
      id: "traffic-master",
      title: "TrafficMaster",
      description: "Опытный партнер с большим охватом",
      features: [
        "Глобальный охват",
        "Гибкие условия",
        "Техническая поддержка"
      ]
    },
    {
      id: "traffic-expert",
      title: "TrafficExpert",
      description: "Специализированный трафик для вашего бизнеса",
      features: [
        "Нишевый трафик",
        "Высокое качество",
        "Индивидуальный подход"
      ]
    },
    {
      id: "traffic-flow",
      title: "TrafficFlow",
      description: "Стабильный поток целевого трафика",
      features: [
        "Постоянный объем",
        "Высокое качество",
        "Быстрая интеграция"
      ]
    },
    {
      id: "traffic-boost",
      title: "TrafficBoost",
      description: "Мощный источник трафика для роста",
      features: [
        "Масштабируемость",
        "Конкурентные цены",
        "Оперативная поддержка"
      ]
    },
    {
      id: "traffic-prime",
      title: "TrafficPrime",
      description: "Премиальный трафик для вашего бизнеса",
      features: [
        "Премиум-качество",
        "Гарантированные показатели",
        "Персональный менеджер"
      ]
    },
    {
      id: "traffic-smart",
      title: "TrafficSmart",
      description: "Умный трафик с AI-оптимизацией",
      features: [
        "AI-таргетинг",
        "Автоматическая оптимизация",
        "Умная аналитика"
      ]
    },
    {
      id: "traffic-global",
      title: "TrafficGlobal",
      description: "Международный трафик высокого качества",
      features: [
        "Мультигео",
        "Мультиязычность",
        "Глобальная поддержка"
      ]
    },
    {
      id: "traffic-elite",
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
            Эффективно продвигайте ваши продукты и услуги
          </p>
        </div>

        <div className="mt-10">
          <ContactForm 
            title="Подать заявку на размещение рекламы"
            description="Заполните форму, и мы свяжемся с вами для обсуждения деталей сотрудничества"
          />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Наши рекламодатели</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card 
                key={card.id}
                id={card.id}
                title={card.title}
                description={card.description}
                features={card.features}
              />
            ))}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Наши поставщики трафика</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trafficProviders.map((provider) => (
              <Card 
                key={provider.id}
                id={provider.id}
                title={provider.title}
                description={provider.description}
                features={provider.features}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 