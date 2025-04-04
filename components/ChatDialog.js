import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import LoadingScreen from './LoadingScreen';

export default function ChatDialog({ isOpen, onClose, cardData }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);
  const [rating, setRating] = useState(null);
  const [isLead, setIsLead] = useState(false);
  const [leadType, setLeadType] = useState(null);
  const [reactions, setReactions] = useState({
    '👍': '👍',
    '👎': '👎'
  });
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);
  const [dialogueId, setDialogueId] = useState(null);
  const inputRef = useRef(null);

  // Предустановленные быстрые ответы
  const quickReplies = [
    "Расскажите подробнее о ваших услугах",
    "Какие условия сотрудничества?",
    "Как начать работу?",
    "Какие гарантии вы предоставляете?"
  ];

  // Создаем новый диалог и отправляем приветственное сообщение при открытии чата
  useEffect(() => {
    if (isOpen) {
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `Здравствуйте! Я виртуальный помощник компании "${cardData?.title}". Как я могу помочь вам?`,
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, cardData]);

  // Автопрокрутка
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Автофокус на поле ввода при загрузке
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage(''); // Очищаем поле ввода сразу
    
    const tempUserMessageId = Date.now();
    const newUserMessage = {
      id: tempUserMessageId,
      role: 'user',
      content: userMessage,
      isTemp: true
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          cardData: cardData
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки сообщения');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Обновляем сообщения, заменяя временные ID на реальные
      setMessages(prev => prev.map(msg => 
        msg.id === tempUserMessageId
          ? { ...msg, id: data.userMessageId, isTemp: false }
          : msg
      ));

      setMessages(prev => [...prev, {
        id: data.assistantMessageId,
        role: 'assistant',
        content: data.message
      }]);

      // Проверяем, является ли сообщение заявкой
      if (data.message.toLowerCase().includes('заявка') || data.message.toLowerCase().includes('оставить заявку')) {
        setIsLead(true);
        setLeadType(cardData.type === 'advertiser' ? 'advertiser' : 'supplier');
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте позже.'
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const formatMessage = (content) => {
    // Простое форматирование текста
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  };

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Скопировано!');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRating = async (value) => {
    if (rating === value) return;
    
    setRating(value);
    
    try {
      await fetch('/api/stats/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: messages[messages.length - 1].id,
          rating: value,
        }),
      });
    } catch (error) {
      console.error('Error sending rating:', error);
    }
  };

  const handleReaction = async (messageId, reaction) => {
    // Не позволяем добавлять реакции к временным сообщениям
    const message = messages.find(m => m.id === messageId);
    if (message?.isTemp) {
      console.log('Cannot add reaction to temporary message');
      return;
    }

    try {
      console.log('Sending reaction:', { messageId, reaction });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reaction: reaction } 
          : msg
      ));

      const response = await fetch('/api/chat/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: messageId.toString(),
          type: reaction === '👍' ? 'like' : 'dislike',
          sessionId: 'default-user'
        })
      });

      if (!response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, reaction: undefined } 
            : msg
        ));
        throw new Error('Failed to save reaction');
      }

      const data = await response.json();
      console.log('Reaction saved:', data);
    } catch (error) {
      console.error('Error saving reaction:', error);
      setError('Не удалось сохранить реакцию. Пожалуйста, попробуйте позже.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg w-full max-w-2xl ${isMinimized ? 'h-16' : 'h-[600px]'} flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold">Чат с {cardData.title}</h2>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMinimized ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
              </svg>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Быстрые ответы */}
            <div className="p-2 border-b flex gap-2 overflow-x-auto">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(reply)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                >
                  <div className="relative group">
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }}
                    />
                    {message.role === 'assistant' && !message.isWelcome && (
                      <div className="mt-2 flex items-center space-x-2">
                        {Object.values(reactions).map((reaction) => (
                          <button
                            key={reaction}
                            onClick={() => handleReaction(message.id, reaction)}
                            className={`text-xl ${
                              message.reaction === reaction
                                ? 'text-blue-500'
                                : 'text-gray-400'
                            }`}
                          >
                            {reaction}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    {copySuccess && message.role === 'user' && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                        {copySuccess}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      <span className="text-sm text-gray-500 ml-2">Печатает...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  😊
                </button>
                <div className="relative flex-1">
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 z-10">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Введите ваше сообщение..."
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Отправить
                </button>
              </div>
            </form>
          </>
        )}
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 