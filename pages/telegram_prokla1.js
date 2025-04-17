import { useEffect } from 'react';
import Head from 'next/head';

export default function TelegramRedirect() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://t.me/prokla1';
    }, 1500);
  }, []);

  return (
    <>
      <Head>
        <title>Переход в Telegram</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <svg className="logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-8 8z"/>
        </svg>
        <h1>Переходим в Telegram...</h1>
        <p>Если переход не произошел автоматически,</p>
        <a href="https://t.me/prokla1" className="button">нажмите здесь</a>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: linear-gradient(135deg, #0088cc, #00a2ff);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>

      <style jsx>{`
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 600px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 2rem;
          animation: bounce 1s infinite;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .button {
          display: inline-block;
          background: white;
          color: #0088cc;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  );
} 