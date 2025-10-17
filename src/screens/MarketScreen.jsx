import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ChevronLeftIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function MarketScreen() {
  const { state } = useContext(AppContext);
  const [search, setSearch] = useState('');

  const filteredOffers = (state.offers || []).filter(
    (offer) => (offer?.username || '').toLowerCase().includes(search.toLowerCase())
  );

  // Подстройка высоты под WebView Telegram (клавиатура)
  useEffect(() => {
    const resizeHandler = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  if (state.loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-4 pb-24">
      <div className="w-full sm:max-w-sm">
        {/* Заголовок */}
        <div className="flex items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mx-auto">Market</h1>
        </div>

        {/* Поиск */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a2338] text-gray-400 placeholder-gray-400 p-4 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-[#00a968] transition-all duration-200 text-base"
        />

        {/* Кнопки фильтров */}
        <div className="flex justify-between mb-4">
          <button className="flex-1 bg-[#1a2338] mx-1 py-3 rounded-xl text-base hover:bg-[#24304a] text-gray-400 hover:text-[#00a968] transition">
            BTC
          </button>
          <button className="flex-1 bg-[#1a2338] mx-1 py-3 rounded-xl text-base hover:bg-[#24304a] text-gray-400 hover:text-[#00a968] transition">
            PayPal
          </button>
          <button className="flex-1 bg-[#1a2338] mx-1 py-3 rounded-xl text-base hover:bg-[#24304a] text-gray-400 hover:text-[#00a968] transition">
            Filters
          </button>
        </div>

        {/* Список предложений */}
        <ul className="space-y-3">
          {filteredOffers.length === 0 && (
            <p className="text-gray-400 text-center text-sm mt-4">No offers found</p>
          )}
          {filteredOffers.map((offer) => (
            <li
              key={offer.id}
              className="bg-[#1a2338] p-4 rounded-xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-[#00a968]" />
                  <span className="font-semibold text-[#00a968] text-lg">{offer.username}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {offer.payment} · Low limit {offer.limit} BTC
                </p>
              </div>
              <Link
                to={`/trade-details/${offer.id}`}
                className="font-bold text-[#00a968] hover:text-[#02ff9e] transition text-base"
              >
                ${offer.price}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
