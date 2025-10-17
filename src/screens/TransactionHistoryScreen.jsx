import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function TransactionHistoryScreen() {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  const transactions = state.transactions || [
    { id: 1, type: 'Buy BTC', amount: '0.01 BTC', date: '05/10/2025', details: 'Bought BTC at $36782. Paid via PayPal.' },
    { id: 2, type: 'Sell USDT', amount: '100 USDT', date: '04/10/2025', details: 'Sold USDT at $1. Paid via Bank.' },
    { id: 3, type: 'Deposit USD', amount: '$200', date: '03/10/2025', details: 'Deposited funds to wallet.' },
  ];

  const [openId, setOpenId] = useState(null);
  const toggleDetails = (id) => setOpenId(openId === id ? null : id);

  // WebView-friendly высота
  useEffect(() => {
    const resizeHandler = () => { document.body.style.height = `${window.innerHeight}px`; };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white p-4 pb-24 flex flex-col items-center">
      {/* Заголовок */}
      <div className="flex items-center w-full max-w-md relative">
        <ChevronLeftIcon
          onClick={() => navigate(-1)}
          className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white transition absolute left-0"
        />
        <div className="mx-auto text-center">
          <h1 className="text-lg sm:text-xl font-bold">
            Transaction<br />History
          </h1>
        </div>
      </div>

      {/* Список транзакций */}
      <div className="space-y-3 w-full sm:max-w-md mt-8">
        {transactions.length === 0 && (
          <p className="text-gray-400 text-center">No transactions found</p>
        )}

        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-[#1a2338] rounded-2xl shadow-md overflow-hidden transition-all hover:bg-[#24304a]"
          >
            {/* Основная строка */}
            <div
              onClick={() => toggleDetails(tx.id)}
              className="flex justify-between items-center p-4 cursor-pointer select-none"
            >
              <span className="font-semibold text-[#00a968] text-base sm:text-lg">{tx.type}</span>
              <div
                className="flex items-center justify-center h-full transition-transform duration-300"
                style={{ transform: openId === tx.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <ChevronDownIcon className="h-6 w-6 sm:h-7 sm:w-7 text-[#9e9f9e]" />
              </div>
            </div>

            {/* Раскрытые детали */}
            <div
              className={`px-4 pb-4 text-gray-400 text-sm sm:text-base transition-all duration-500 ease-in-out overflow-hidden ${
                openId === tx.id ? 'max-h-72 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              {openId === tx.id && (
                <div className="mt-2">
                  <p className="mb-1"><strong>Сумма:</strong> <span className="text-[#00a968] font-bold">{tx.amount}</span></p>
                  <p className="mb-1"><strong>Дата:</strong> {tx.date}</p>
                  <p><strong>Детали:</strong> {tx.details}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
