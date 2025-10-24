import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './MarketScreen.css'; // CSS для анимации оферов

export default function MarketScreen() {
  const { state = {} } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [offers, setOffers] = useState([]);
  const containerRef = useRef(null);

  // Загружаем офферы с бэкенда
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('http://localhost:5000/api/offers');
        const data = await res.json();
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    }
    fetchOffers();
  }, []);

  const searchLower = search.toLowerCase();
  const filteredOffers = (offers || []).filter(
    (offer) => (offer?.username || '').toLowerCase().includes(searchLower)
  );

  // Адаптивная переменная vh
  useEffect(() => {
    const resizeHandler = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  if (state.loading) return <Loader />;

  return (
    <div className="fixed inset-0 bg-[#0b1120] text-white px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] flex flex-col">
      <div className="w-full max-w-lg mx-auto flex flex-col flex-grow pt-8">
        <h1 className="text-xl font-semibold text-center mb-6 tracking-wide">Market</h1>

        {/* Растущий контейнер с анимацией */}
        <div
          ref={containerRef}
          className="bg-[#1a2338] p-5 rounded-2xl shadow-md flex flex-col space-y-5 transition-all duration-300 ease-out"
          style={{
            maxHeight: 'calc(100vh - 160px)',
            overflow: 'hidden',
          }}
        >
          {/* Поиск с фиксированным курсором */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search offers by username"
            className="w-full max-w-full box-border overflow-hidden bg-[#24304a] text-gray-400 placeholder-gray-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00a968] transition-colors duration-200 text-sm"
            style={{
              minWidth: 0,
              whiteSpace: 'nowrap',
              wordBreak: 'normal',
              textOverflow: 'clip',
            }}
          />

          {/* Кнопки фильтров */}
          <div className="flex justify-between gap-x-2">
            {['BTC', 'PayPal', 'Filters'].map((label) => (
              <button
                key={label}
                className="flex-1 bg-[#24304a] py-3 rounded-xl text-sm text-gray-400 hover:bg-[#2f3c5a] hover:text-[#00a968] transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Список предложений — скрытый скролл */}
          <div
            className="flex-grow overflow-y-auto pr-1 scroll-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>
              {`
                .scroll-hide::-webkit-scrollbar { display: none; }
              `}
            </style>

            {filteredOffers.length === 0 && (
              <p className="text-gray-400 text-center text-sm mt-2">No offers found</p>
            )}

            <TransitionGroup className="space-y-3">
              {filteredOffers.map((offer) => (
                <CSSTransition key={offer.id} timeout={300} classNames="fade">
                  <div className="bg-[#24304a] p-4 rounded-xl flex justify-between items-center shadow-md hover:bg-[#2f3c5a] transition-colors duration-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <UserCircleIcon className="h-6 w-6 text-[#00a968]" aria-hidden="true" />
                        <span className="font-semibold text-[#00a968] text-lg">{offer.username}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        {offer.payment} · Low limit {offer.limit} BTC
                      </p>
                    </div>
                    <Link
                      to={`/trade-details/${offer.id}`}
                      className="font-bold text-[#00a968] hover:text-[#02ff9e] transition-colors duration-200 text-base"
                    >
                      ${offer.price}
                    </Link>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
