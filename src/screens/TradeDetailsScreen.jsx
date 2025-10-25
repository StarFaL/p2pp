import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';

export default function TradeDetailsScreen() {
  const { id } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const [trade, setTrade] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [messagesHeight, setMessagesHeight] = useState(100); // уменьшенная стартовая высота

  useEffect(() => {
    const existingTrade = state.trades.find(t => t.id === parseInt(id) || t.id === id);
    if (existingTrade) setTrade(existingTrade);
    else {
      axios.get(`http://localhost:5000/api/trades/${id}`)
        .then(res => setTrade(res.data))
        .catch(() => setTrade(null));
    }
  }, [id, state.trades]);

  const handleSend = async () => {
    if (!message.trim() || !trade) return;
    const newMessage = { text: message, time: new Date().toLocaleTimeString() };
    try {
      await axios.post(`http://localhost:5000/api/trades/message`, { tradeId: trade.id, message: newMessage });

      setTrade(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), newMessage],
      }));

      dispatch({
        type: 'SET_TRADES',
        payload: state.trades.map(t => t.id === trade.id ? { ...t, messages: [...t.messages, newMessage] } : t)
      });

      setMessage('');
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    }
  };

  // Авто-подстройка высоты контейнера сообщений
  useEffect(() => {
    if (trade?.messages?.length) {
      const baseHeight = 100; // стартовая высота меньше
      const perMessage = 60;  // высота одной карточки сообщения
      const maxHeight = window.innerHeight * 0.35; // максимум ~35% экрана
      setMessagesHeight(Math.min(baseHeight + trade.messages.length * perMessage, maxHeight));
    }
  }, [trade?.messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trade?.messages]);

  // Подстройка под WebView
  useEffect(() => {
    const resizeHandler = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  if (!trade) return <p className="text-[#00a968] text-center text-lg font-bold mt-[10vh]">Trade Loading...</p>;

  return (
    <div className="fixed inset-0 bg-[#0b1120] flex flex-col items-center px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] overflow-hidden"
         style={{ paddingTop: '2cm' }}>

      <div className="w-full max-w-md bg-[#1a2338] p-5 rounded-2xl shadow-md space-y-5 flex flex-col flex-grow overflow-hidden">

        <h1 className="text-xl font-bold text-center">Trade Details</h1>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-600" />
            <span className="ml-2 font-bold text-[#00a968]">{trade.username}</span>
            <span className="ml-auto text-[#00a968] text-sm">{trade.status}</span>
          </div>

          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#00a968]">$ {trade.amount}</p>
            <p className="text-gray-400 text-sm">{trade.btc} BTC</p>
          </div>

          <div className="bg-[#24304a] p-4 rounded-2xl text-center">
            <p className="font-medium text-base">Waiting for the buyer to pay</p>
            <p className="text-gray-400 text-xs mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <button className="w-full bg-[#00613c] hover:bg-[#00a968] transition py-3 rounded-2xl font-bold text-base">
            Pay
          </button>
        </div>

        {/* Контейнер сообщений */}
        <div
          className="flex flex-col gap-3 mt-4 overflow-y-auto scroll-hide transition-all duration-500 ease-out"
          style={{ maxHeight: `${messagesHeight}px`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>
            {`
              .scroll-hide::-webkit-scrollbar { display: none; }
              .fade-in-msg { opacity: 0; transform: translateY(10px); animation: fadeIn 0.4s ease-out forwards; }
              @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
            `}
          </style>

          {trade.messages?.map((msg, idx) => (
            <div
              key={idx}
              className="flex items-start fade-in-msg"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600" />
              <div className="ml-2 bg-[#1a2338] p-3 sm:p-4 rounded-2xl flex-1">
                <p className="text-base">{msg.text}</p>
              </div>
              <span className="ml-2 text-gray-400 text-xs mt-1">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Ввод сообщения */}
        <div className="mt-4 relative w-full">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-[#24304a] p-3 rounded-2xl text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a968] transition pr-12"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00613c] hover:bg-[#00a968] p-2 rounded-full flex items-center justify-center transition"
            style={{ width: '36px', height: '36px' }}
          >
            <img src="/mesage.svg" alt="send" className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
