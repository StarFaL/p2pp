import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function MarketScreen() {
  const { state = {} } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [offers, setOffers] = useState([]);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('http://localhost:5000/api/offers');
        if (!res.ok) throw new Error('Server not available');
        const data = await res.json();
        setOffers(data);
      } catch (error) {
        console.warn('⚠️ Failed to fetch offers, using mock data:', error);

        // 👉 Тестовые данные
        const mockOffers = [
          { id: 1, username: 'CryptoKing', payment: 'PayPal', limit: 0.01, price: 68000 },
          { id: 2, username: 'BTC_Baron', payment: 'Revolut', limit: 0.05, price: 68250 },
          { id: 3, username: 'Satoshi', payment: 'Binance Pay', limit: 0.02, price: 68100 },
        ];

        setOffers(mockOffers);
      }
    }

    fetchOffers();
  }, []);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const searchLower = search.toLowerCase();
  const filteredOffers = (offers || []).filter((offer) =>
    (offer?.username || '').toLowerCase().includes(searchLower)
  );

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
    <div
      className={`fixed inset-0 bg-[#0b1120] text-white px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] flex flex-col transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div
        className="w-full max-w-lg mx-auto flex flex-col flex-grow"
        style={{ paddingTop: '2cm' }}
      >
        <h1 className="text-xl font-semibold text-center mb-6 tracking-wide">Market</h1>

        <div
          ref={containerRef}
          className="bg-[#1a2338] p-5 rounded-2xl shadow-md flex flex-col space-y-5 transition-all duration-300 ease-out"
          style={{
            maxHeight: 'calc(82vh - 160px)',
            overflow: 'hidden',
          }}
        >
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search offers by username"
            className="w-full bg-[#24304a] text-gray-400 placeholder-gray-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00a968] transition-colors duration-200 text-sm"
          />

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

          <div
            className="flex-grow overflow-y-auto pr-1 scroll-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>
              {`
                .scroll-hide::-webkit-scrollbar { display: none; }
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .fade-in { animation: fadeIn 0.3s ease-out forwards; }
              `}
            </style>

            {filteredOffers.length === 0 && (
              <p className="text-gray-400 text-center text-sm mt-2">No offers found</p>
            )}

            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="fade-in bg-[#24304a] p-4 rounded-xl flex justify-between items-center shadow-md hover:bg-[#2f3c5a] transition-colors duration-200"
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
