import Head from 'next/head';

export default function TelegramRedirect2() {
  return (
    <>
      <Head>
        <title>🎲 VIP Gaming Community</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="card">
          <div className="image-placeholder">
            <div className="image-text">Place for Your Image</div>
          </div>
          <div className="content">
            <div className="vip-badge">VIP ACCESS</div>
            <h1>EXCLUSIVE GAMING COMMUNITY</h1>
            <div className="features">
              <div className="feature">
                <span className="icon">🎯</span>
                <span>Daily Bonuses</span>
              </div>
              <div className="feature">
                <span className="icon">💎</span>
                <span>VIP Support</span>
              </div>
              <div className="feature">
                <span className="icon">🎁</span>
                <span>Special Events</span>
              </div>
            </div>
            <a href="https://t.me/prokla2" className="cta-button">
              JOIN NOW
              <span className="button-glow"></span>
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #0f1923, #1f2b3e);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
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
          padding: clamp(1rem, 3vw, 2rem);
          width: min(100%, 500px);
          margin: 0 auto;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: clamp(15px, 4vw, 20px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .image-placeholder {
          width: 100%;
          height: clamp(180px, 35vw, 250px);
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .image-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          z-index: 1;
        }
        .content {
          padding: clamp(1.5rem, 4vw, 2rem);
          position: relative;
        }
        .vip-badge {
          position: absolute;
          top: -12px;
          right: clamp(15px, 4vw, 20px);
          background: linear-gradient(45deg, #ffd700, #ff9900);
          padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem);
          border-radius: 20px;
          font-weight: bold;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          color: #1a1a2e;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        h1 {
          font-size: clamp(1.5rem, 4vw, 1.8rem);
          margin: clamp(0.8rem, 2vw, 1rem) 0 clamp(1.5rem, 3vw, 2rem);
          background: linear-gradient(45deg, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
          line-height: 1.2;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.8rem, 2vw, 1rem);
          margin-bottom: clamp(1.5rem, 4vw, 2rem);
        }
        .feature {
          text-align: center;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          padding: clamp(0.5rem, 1.5vw, 0.8rem);
          background: rgba(255, 255, 255, 0.05);
          border-radius: clamp(8px, 2vw, 12px);
          transition: transform 0.3s ease;
        }
        .feature:hover {
          transform: translateY(-2px);
        }
        .icon {
          font-size: clamp(1.5rem, 4vw, 2rem);
          display: block;
          margin-bottom: clamp(0.3rem, 1vw, 0.5rem);
        }
        .cta-button {
          display: block;
          width: 100%;
          padding: clamp(0.8rem, 2.5vw, 1rem);
          background: linear-gradient(45deg, #ff3366, #ff6b3d);
          color: white;
          text-decoration: none;
          text-align: center;
          border-radius: clamp(8px, 2vw, 10px);
          font-weight: bold;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .button-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          transform: rotate(45deg);
          animation: glow 3s infinite;
          pointer-events: none;
        }
        @keyframes glow {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }

        @media (max-width: 480px) {
          .features {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }
          .feature {
            padding: 0.8rem;
          }
          .content {
            padding: 1.2rem;
          }
          .vip-badge {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
          }
        }

        @media (min-width: 1200px) {
          .container {
            padding: 3rem;
          }
          .card {
            transform: scale(1);
            transition: transform 0.3s ease;
          }
          .card:hover {
            transform: scale(1.02);
          }
          .features {
            gap: 1.5rem;
          }
          .feature {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
} 