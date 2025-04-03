import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Скрываем прелоадер после загрузки страницы
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Небольшая задержка для плавности

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp 