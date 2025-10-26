import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';

export default function TradeDetailsScreen() {
  const { state, dispatch } = useContext(AppContext);

  const [trade, setTrade] = useState({
    id: 1,
    username: 'Alice',
    status: 'Pending',
    amount: '1200',
    btc: '0.018',
    messages: [
      { text: 'Hi! Ready to trade?', time: '10:20' },
      { text: 'Yes, sending payment now.', time: '10:22' },
    ],
  });

  const [message, setMessage] = useState('');
  const [paymentSent, setPaymentSent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const messagesEndRef = useRef(null);
  const [messagesHeight, setMessagesHeight] = useState(150);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = { text: message, time: new Date().toLocaleTimeString().slice(0, 5) };
    setTrade((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    setMessage('');
  };

  const handlePay = () => {
    setPaymentSent(true);
    setShowConfirmation(true);

    setTimeout(() => {
      const newTransaction = {
        id: (state.transactions?.length || 0) + 1,
        type: 'Buy BTC',
        amount: `${trade.amount} USD / ${trade.btc} BTC`,
        date: new Date().toLocaleDateString(),
        details: `Paid by user ${trade.username}`,
      };
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      setShowConfirmation(false);
    }, 2000);
  };

  useEffect(() => {
    if (trade?.messages?.length) {
      const baseHeight = 150;
      const perMessage = 60;
      const maxHeight = window.innerHeight * 0.35; // немного меньше, чем было (уменьшено на ~1см)
      setMessagesHeight(Math.min(baseHeight + trade.messages.length * perMessage, maxHeight));
    }
  }, [trade?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [trade?.messages]);

  return (
    <div
      className="fixed inset-0 bg-[#0b1120] flex flex-col items-center px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] overflow-hidden"
      style={{ paddingTop: '2cm' }}
    >
      {/* Заголовок вынесен отдельно */}
      <div className="w-full max-w-md mb-3">
        <h1 className="text-xl font-bold text-center text-white">Trade Details</h1>
      </div>

      {/* Основной контейнер */}
      <div className="w-full max-w-md bg-[#1a2338] p-5 rounded-2xl shadow-md flex flex-col flex-grow overflow-hidden"
           style={{ minHeight: 'calc(100% - 3.5rem)' /* уменьшаем высоту примерно на 1см */ }}>
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

          {!paymentSent ? (
            <button
              onClick={handlePay}
              className="w-full bg-[#00613c] hover:bg-[#00a968] transition py-3 rounded-2xl font-bold text-base"
            >
              Pay
            </button>
          ) : (
            <div
              className={`w-full p-4 rounded-2xl text-center bg-[#24304a] transition-all duration-500 ${
                showConfirmation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <p className="font-medium text-base">Waiting for partner's confirmation...</p>
            </div>
          )}
        </div>

        {/* Контейнер сообщений с скруглением сверху и снизу */}
        <div
          className="flex flex-col gap-3 overflow-y-auto scroll-hide mt-4 bg-[#1a2338] rounded-t-xl rounded-b-xl p-4"
          style={{ maxHeight: `${messagesHeight}px` }}
        >
          <style>
            {`
              .scroll-hide::-webkit-scrollbar { display: none; }
              .fade-in-msg { opacity: 0; transform: translateY(10px); animation: fadeIn 0.4s ease-out forwards; }
              @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
            `}
          </style>

          {trade.messages.map((msg, idx) => (
            <div key={idx} className="flex items-start fade-in-msg" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-600" />
              <div className="ml-2 bg-[#00613c] p-3 sm:p-4 rounded-2xl flex-1">
                <p className="text-base">{msg.text}</p>
              </div>
              <span className="ml-2 text-gray-400 text-xs mt-1">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Ввод сообщения */}
        <div className="relative w-full mt-3">
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
