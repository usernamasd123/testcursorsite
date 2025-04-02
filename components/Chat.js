import { useState, useEffect, useRef } from 'react';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/solid';

export default function Chat({ messages, onSendMessage, onClose }) {
  const [newMessage, setNewMessage] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleReaction = async (messageId, type) => {
    try {
      const response = await fetch('/api/message/reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reaction');
      }

      const data = await response.json();
      setUserReactions(prev => ({
        ...prev,
        [messageId]: type
      }));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Чат с поддержкой</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => handleReaction(message.id, 'like')}
                      className={`p-1 rounded hover:bg-gray-200 ${
                        userReactions[message.id] === 'like' ? 'text-green-500' : 'text-gray-500'
                      }`}
                    >
                      <ThumbUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReaction(message.id, 'dislike')}
                      className={`p-1 rounded hover:bg-gray-200 ${
                        userReactions[message.id] === 'dislike' ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <ThumbDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 