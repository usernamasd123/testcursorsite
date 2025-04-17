import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TelegramRedirect() {
  const router = useRouter()
  const { username } = router.query

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `https://t.me/${username || 'your_default_username'}`
    }, 1500)

    return () => clearTimeout(timer)
  }, [username])

  return (
    <>
      <Head>
        <title>Переход в Telegram</title>
        <meta name="description" content="Переход в Telegram чат" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-600 text-white">
        <div className="text-center p-8">
          <div className="animate-bounce mb-8">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 13.17l7.59-7.59L19 7l-8 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Переходим в Telegram...</h1>
          <p className="text-lg opacity-80">Если переход не произошел автоматически,</p>
          <a 
            href={`https://t.me/${username || 'your_default_username'}`}
            className="inline-block mt-4 px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
          >
            нажмите здесь
          </a>
        </div>
      </main>
    </>
  )
} 