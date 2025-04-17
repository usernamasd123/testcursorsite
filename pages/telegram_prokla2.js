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
        }
      `}</style>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 500px;
          width: 100%;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
        }
        .image-placeholder {
          width: 100%;
          height: 250px;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .image-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.2rem;
        }
        .content {
          padding: 2rem;
          position: relative;
        }
        .vip-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: linear-gradient(45deg, #ffd700, #ff9900);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          color: #1a1a2e;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        h1 {
          font-size: 1.8rem;
          margin: 1rem 0 2rem;
          background: linear-gradient(45deg, #fff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .feature {
          text-align: center;
          font-size: 0.9rem;
        }
        .icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .cta-button {
          display: block;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #ff3366, #ff6b3d);
          color: white;
          text-decoration: none;
          text-align: center;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1.2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s;
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
        }
        @keyframes glow {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }
      `}</style>
    </>
  );
} 