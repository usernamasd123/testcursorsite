import Head from 'next/head';

export default function TelegramRedirect3() {
  return (
    <>
      <Head>
        <title>🌟 Premium Gaming Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="stars"></div>
      <div className="container">
        <div className="content-wrapper">
          <div className="image-placeholder">
            <div className="image-text">Place for Your Image</div>
            <div className="glow"></div>
          </div>
          <div className="content">
            <div className="jackpot">
              <div className="jackpot-value">$100,000</div>
              <div className="jackpot-label">CURRENT JACKPOT</div>
            </div>
            <h1>JOIN THE ELITE</h1>
            <div className="description">
              Get instant access to exclusive bonuses and VIP treatment
            </div>
            <div className="bonus-items">
              <div className="bonus-item">
                <div className="bonus-value">200%</div>
                <div className="bonus-label">FIRST DEPOSIT</div>
              </div>
              <div className="bonus-item">
                <div className="bonus-value">50</div>
                <div className="bonus-label">FREE SPINS</div>
              </div>
              <div className="bonus-item">
                <div className="bonus-value">24/7</div>
                <div className="bonus-label">VIP SUPPORT</div>
              </div>
            </div>
            <a href="https://t.me/prokla3" className="join-button">
              CLAIM YOUR BONUS
              <div className="button-shine"></div>
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          background: #000;
          min-height: 100vh;
          color: #fff;
          overflow-x: hidden;
        }
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }
        }
      `}</style>

      <style jsx>{`
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 2000' fill='%23fff'%3E%3Ccircle cx='1000' cy='1000' r='1'/%3E%3C/svg%3E") repeat;
          opacity: 0.3;
          animation: twinkle 10s infinite linear;
          pointer-events: none;
        }
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          z-index: 1;
        }
        .content-wrapper {
          background: linear-gradient(145deg, rgba(41, 0, 102, 0.9), rgba(0, 11, 41, 0.9));
          border-radius: 30px;
          padding: clamp(1rem, 5vw, 2rem);
          width: min(100%, 500px);
          margin: 1rem;
          box-shadow: 0 0 50px rgba(138, 43, 226, 0.3);
          border: 1px solid rgba(138, 43, 226, 0.2);
          backdrop-filter: blur(10px);
        }
        .image-placeholder {
          width: 100%;
          height: clamp(150px, 30vw, 200px);
          background: rgba(138, 43, 226, 0.1);
          border-radius: 20px;
          margin-bottom: clamp(1rem, 3vw, 2rem);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .glow {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.4) 0%, rgba(138, 43, 226, 0) 70%);
          animation: rotate 10s infinite linear;
          pointer-events: none;
        }
        .image-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          z-index: 1;
        }
        .jackpot {
          text-align: center;
          margin-bottom: clamp(1rem, 3vw, 2rem);
        }
        .jackpot-value {
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .jackpot-label {
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          color: rgba(255, 255, 255, 0.7);
        }
        h1 {
          text-align: center;
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          margin: 0 0 clamp(0.5rem, 2vw, 1rem);
          background: linear-gradient(45deg, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }
        .description {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: clamp(1rem, 3vw, 2rem);
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          padding: 0 clamp(0.5rem, 2vw, 1rem);
        }
        .bonus-items {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.5rem, 2vw, 1rem);
          margin-bottom: clamp(1rem, 3vw, 2rem);
        }
        .bonus-item {
          text-align: center;
          padding: clamp(0.5rem, 2vw, 1rem);
          background: rgba(138, 43, 226, 0.2);
          border-radius: 15px;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }
        .bonus-value {
          font-size: clamp(1.2rem, 3.5vw, 1.5rem);
          font-weight: bold;
          color: #ffd700;
        }
        .bonus-label {
          font-size: clamp(0.7rem, 2vw, 0.8rem);
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.3rem;
        }
        .join-button {
          display: block;
          width: 100%;
          padding: clamp(1rem, 3vw, 1.2rem);
          background: linear-gradient(45deg, #8a2be2, #4b0082);
          color: white;
          text-decoration: none;
          text-align: center;
          border-radius: 15px;
          font-weight: bold;
          font-size: clamp(1rem, 3vw, 1.2rem);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .join-button:hover {
          transform: translateY(-2px);
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
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.3; }
        }

        @media (max-width: 480px) {
          .bonus-items {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          .bonus-item {
            padding: 0.8rem;
          }
          .content-wrapper {
            margin: 0.5rem;
            border-radius: 20px;
          }
          .image-placeholder {
            height: 120px;
          }
        }

        @media (min-width: 1200px) {
          .content-wrapper {
            padding: 3rem;
          }
          .image-placeholder {
            height: 250px;
          }
          .bonus-items {
            gap: 2rem;
          }
          .join-button {
            margin-top: 2rem;
          }
        }
      `}</style>
    </>
  );
} 