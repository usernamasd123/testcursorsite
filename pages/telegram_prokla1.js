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
        <div className="image-placeholder">
          <div className="image-text">Place for Your Image</div>
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
          </button>
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
        }
      `}</style>

      <style jsx>{`
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .image-placeholder {
          width: 100%;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255, 255, 255, 0.3);
        }
        .image-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.2rem;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .slot-machine {
          perspective: 1000px;
        }
        .spin-button {
          width: 200px;
          height: 60px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(45deg, #ffd700, #ff9900);
          color: #1a1a2e;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        .spin-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .spin-button:disabled {
          cursor: default;
        }
        .spinning .slot-numbers {
          animation: spin 0.2s linear infinite;
        }
        .win .slot-numbers {
          animation: none;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          font-size: 2rem;
        }
        @keyframes spin {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </>
  );
} 