import Head from 'next/head';
import { useState } from 'react';

export default function TelegramRedirect1() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWin, setShowWin] = useState(false);

  const handleSpin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setTimeout(() => {
        setShowWin(true);
        setTimeout(() => {
          window.location.href = 'https://t.me/prokla1';
        }, 1000);
      }, 3000);
    }
  };

  return (
    <>
      <Head>
        <title>🎰 Exclusive Bonus Offer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="content-wrapper">
          <div className="image-placeholder">
            <div className="image-text">Place for Your Image</div>
            <div className="glow"></div>
          </div>
          <h1>🎰 EXCLUSIVE VIP ACCESS 🎰</h1>
          <div className="slot-machine">
            <button 
              className={`spin-button ${isSpinning ? 'spinning' : ''} ${showWin ? 'win' : ''}`}
              onClick={handleSpin}
              disabled={isSpinning}
            >
              <div className="slot-numbers">
                {showWin ? '777' : isSpinning ? '---' : 'SPIN TO WIN'}
              </div>
              <div className="button-shine"></div>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          min-height: 100vh;
          color: #fff;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }
        }
      `}</style>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1rem, 3vw, 2rem);
        }
        .content-wrapper {
          text-align: center;
          width: min(100%, 600px);
          padding: clamp(1.5rem, 4vw, 2rem);
          background: rgba(255, 255, 255, 0.05);
          border-radius: clamp(15px, 4vw, 20px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
          margin: 0 auto;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .image-placeholder {
          width: 100%;
          height: clamp(150px, 30vw, 200px);
          background: rgba(255, 255, 255, 0.1);
          border-radius: clamp(10px, 3vw, 15px);
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0) 70%);
          animation: rotate 10s infinite linear;
          pointer-events: none;
        }
        .image-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          z-index: 1;
        }
        h1 {
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          line-height: 1.2;
        }
        .slot-machine {
          perspective: 1000px;
          padding: clamp(0.5rem, 2vw, 1rem);
        }
        .spin-button {
          width: clamp(200px, 60vw, 300px);
          height: clamp(60px, 15vw, 80px);
          border: none;
          border-radius: clamp(10px, 3vw, 15px);
          background: linear-gradient(45deg, #ffd700, #ff9900);
          color: #1a1a2e;
          font-size: clamp(1.2rem, 3.5vw, 1.5rem);
          font-weight: bold;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          -webkit-tap-highlight-color: transparent;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .spin-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .spin-button:disabled {
          cursor: default;
          opacity: 0.8;
        }
        .spinning .slot-numbers {
          animation: spin 0.2s linear infinite;
        }
        .win .slot-numbers {
          animation: none;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          font-size: clamp(1.5rem, 4vw, 2rem);
        }
        .button-shine {
          position: absolute;
          top: -180%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
          pointer-events: none;
        }
        @keyframes spin {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .content-wrapper {
            padding: 1.2rem;
          }
          .image-placeholder {
            height: 120px;
          }
          .spin-button {
            width: 100%;
          }
        }

        @media (min-width: 1200px) {
          .content-wrapper {
            padding: 3rem;
            transform: scale(1);
            transition: transform 0.3s ease;
          }
          .content-wrapper:hover {
            transform: scale(1.02);
          }
          .image-placeholder {
            height: 250px;
          }
          .spin-button {
            width: 300px;
            height: 80px;
          }
        }
      `}</style>
    </>
  );
} 