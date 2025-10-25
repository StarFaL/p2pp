import { useContext, useState, useEffect, useRef } from 'react';
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
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(160); // начальная высота меньше

  const toggleDetails = (id) => setOpenId(openId === id ? null : id);

  // Плавное появление страницы
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  // Плавное изменение высоты контейнера в зависимости от количества транзакций
  useEffect(() => {
    const baseHeight = 150; // базовая высота (меньше)
    const perItem = 110; // высота одной карточки
    const maxHeight = window.innerHeight * 0.4; // максимум ~40% высоты экрана
    const newHeight = Math.min(baseHeight + transactions.length * perItem, maxHeight);
    setContainerHeight(newHeight);
  }, [transactions.length]);

  return (
    <div
      className={`fixed inset-0 bg-[#0b1120] text-white flex justify-center overflow-hidden transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{
        paddingTop: '2cm',
        paddingBottom: 'calc(env(safe-area-inset-bottom)+70px)',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div className="w-full max-w-md flex flex-col flex-grow">
        {/* Заголовок */}
        <div className="flex items-center mb-5 sm:mb-6 relative">
          <h1 className="text-lg sm:text-xl font-semibold mx-auto text-center leading-tight">
            Transaction<br />History
          </h1>
        </div>

        {/* Контейнер с транзакциями */}
        <div
          ref={containerRef}
          className="bg-[#1a2338] p-4 sm:p-5 rounded-2xl shadow-md flex flex-col space-y-3 sm:space-y-4 overflow-y-auto scroll-hide transition-all duration-500 ease-out"
          style={{
            height: `${containerHeight}px`,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>
            {`
              .scroll-hide::-webkit-scrollbar { display: none; }
              .fade-in {
                opacity: 0;
                transform: translateY(10px);
                animation: fadeIn 0.4s ease-out forwards;
              }
              @keyframes fadeIn {
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          {transactions.length === 0 && (
            <p className="text-gray-400 text-center text-sm sm:text-base mt-6">
              No transactions found
            </p>
          )}

          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className="fade-in bg-[#151b2c] rounded-2xl shadow-md overflow-hidden hover:bg-[#24304a] transition-all duration-500 ease-out"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Основная строка */}
              <div
                onClick={() => toggleDetails(tx.id)}
                className="flex justify-between items-center p-4 cursor-pointer select-none"
              >
                <span className="font-semibold text-[#00a968] text-sm sm:text-base">{tx.type}</span>
                <div className={`transition-transform duration-300 ${openId === tx.id ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
              </div>

              {/* Детали */}
              <div
                className={`px-4 pb-4 text-gray-400 text-xs sm:text-sm transition-all duration-500 ease-in-out overflow-hidden ${
                  openId === tx.id ? 'max-h-72 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                {openId === tx.id && (
                  <div className="mt-2">
                    <p className="mb-1">
                      <strong>Amount:</strong>{' '}
                      <span className="text-[#00a968] font-bold">{tx.amount}</span>
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong> {tx.date}
                    </p>
                    <p>
                      <strong>Details:</strong> {tx.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
