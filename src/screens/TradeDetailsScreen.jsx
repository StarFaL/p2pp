import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';

export default function TradeDetailsScreen() {
  const { id } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const [trade, setTrade] = useState(null);
  const [message, setMessage] = useState('');

  // 🔹 Пытаемся найти трейд в state, иначе грузим из API
  useEffect(() => {
    console.log("TradeDetailsScreen → id из URL:", id);
console.log("TradeDetailsScreen → state.trades:", state.trades);

    const existingTrade = state.trades.find(t => t.id === parseInt(id) || t.id === id);
    if (existingTrade) {
      setTrade(existingTrade);
    } else {
      // подгружаем с сервера
      axios.get(`http://localhost:5000/api/trades/${id}`)
        .then(res => setTrade(res.data))
        .catch(() => setTrade(null));
    }
  }, [id, state.trades]);

  const handleSend = async () => {
    if (!message.trim() || !trade) return;
    try {
      const newMessage = { text: message, time: new Date().toLocaleTimeString() };
      await axios.post(`http://localhost:5000/api/trades/message`, { tradeId: trade.id, message: newMessage });

      // Обновляем локальный стейт
      setTrade(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), newMessage],
      }));

      // И обновляем контекст
      dispatch({
        type: 'SET_TRADES',
        payload: state.trades.map(t => t.id === trade.id ? { ...t, messages: [...t.messages, newMessage] } : t)
      });

      setMessage('');
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    }
  };

  // 🔸 Показываем экран загрузки, если трейд не найден
  if (!trade) {
    return <p className="text-[#00a968] text-center text-lg font-bold mt-10">Trade Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-sm">
        {/* Заголовок */}
        <div className="flex items-center justify-center mb-6 relative">
          <h1 className="text-lg font-bold text-center">Trade Details</h1>
        </div>

        {/* Информация о трейде */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600" />
            <span className="ml-2 font-bold text-[#00a968]">{trade.username}</span>
            <span className="ml-auto text-[#00a968] text-sm">{trade.status}</span>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-[#00a968]">$ {trade.amount}</p>
            <p className="text-gray-400 text-sm">{trade.btc} BTC</p>
          </div>

          <div className="bg-[#24304a] p-4 rounded-2xl text-center">
            <p className="font-medium">Waiting for the buyer to pay</p>
            <p className="text-gray-400 text-xs mt-2">Lorem ipsum...</p>
          </div>

          <button className="w-full bg-[#00613c] hover:bg-[#00a968] transition py-3 rounded-2xl font-bold text-sm">
            Pay
          </button>
        </div>

        {/* Сообщения */}
        <div className="mt-6 space-y-3">
          {trade.messages?.map((msg, idx) => (
            <div key={idx} className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-600" />
              <div className="ml-2 bg-[#1a2338] p-3 rounded-2xl flex-1">
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="ml-2 text-gray-400 text-xs mt-1">{msg.time}</span>
            </div>
          ))}

          {/* Ввод нового сообщения */}
          <div className="flex mt-4">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#24304a] p-3 rounded-l-2xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
            />
            <button
              onClick={handleSend}
              className="bg-[#00613c] hover:bg-[#00a968] p-3 rounded-r-2xl transition"
            >
              <div className="flex items-center p-2 rounded-xl  justify-center">
               <img src="/mesage.png" alt="ua" className="h-4 w-4" />
            </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
