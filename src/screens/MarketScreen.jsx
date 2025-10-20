import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function MarketScreen() {
  const { state } = useContext(AppContext);
  const [search, setSearch] = useState('');

  const filteredOffers = (state.offers || []).filter(
    (offer) => (offer?.username || '').toLowerCase().includes(search.toLowerCase())
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
      className="fixed inset-0 bg-[#0b1120] text-white px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] overflow-hidden flex justify-center"
      style={{ paddingTop: '2cm' }} // контент смещён вниз
    >
      <div className="w-full max-w-lg flex flex-col flex-grow overflow-y-auto">
        {/* Заголовок */}
        <h1 className="text-xl font-semibold text-center mb-6 tracking-wide">Market</h1>

        {/* Контейнер с данными */}
        <div className="flex-grow bg-[#1a2338] p-5 rounded-2xl shadow-md flex flex-col space-y-5 overflow-y-auto">
          
          {/* Поиск */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#24304a] text-gray-400 placeholder-gray-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00a968] transition text-sm"
          />

          {/* Кнопки фильтров */}
          <div className="flex justify-between">
            <button className="flex-1 bg-[#24304a] mx-1 py-3 rounded-xl text-sm hover:bg-[#2f3c5a] text-gray-400 hover:text-[#00a968] transition">
              BTC
            </button>
            <button className="flex-1 bg-[#24304a] mx-1 py-3 rounded-xl text-sm hover:bg-[#2f3c5a] text-gray-400 hover:text-[#00a968] transition">
              PayPal
            </button>
            <button className="flex-1 bg-[#24304a] mx-1 py-3 rounded-xl text-sm hover:bg-[#2f3c5a] text-gray-400 hover:text-[#00a968] transition">
              Filters
            </button>
          </div>

          {/* Список предложений */}
          <div className="space-y-3 flex-grow overflow-y-auto pr-1">
            {filteredOffers.length === 0 && (
              <p className="text-gray-400 text-center text-sm mt-2">No offers found</p>
            )}
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#24304a] p-4 rounded-xl flex justify-between items-center shadow-md hover:bg-[#2f3c5a] transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-6 w-6 text-[#00a968]" />
                    <span className="font-semibold text-[#00a968] text-lg">
                      {offer.username}
                    </span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
