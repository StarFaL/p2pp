import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

export default function DashboardScreen() {
  const { state } = useContext(AppContext);

  if (state.loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+80px)]">
      <div className="w-full max-w-md sm:max-w-sm">

        {/* Заголовок */}
        <h1 className="text-xl font-semibold text-center mb-6 tracking-wide">
          Dashboard
        </h1>

        {/* Карточки */}
        <div className="space-y-4">

          {/* Активные трейды */}
          <div className="bg-[#1a2338] p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] active:scale-[0.98] transition-all">
            <div>
              <p className="text-gray-400 text-base sm:text-lg">Активные трейды</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968] mt-1">{state.trades.length}</p>
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl">
              <img
                src="/trade.png"
                alt="trade"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
              />
            </div>
          </div>

          {/* Офферы */}
          <div className="bg-[#1a2338] p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] active:scale-[0.98] transition-all">
            <div>
              <p className="text-gray-400 text-base sm:text-lg">Офферы</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968] mt-1">{state.offers.length}</p>
            </div>
            <div className="flex items-center justify-center p-2 rounded-xl">
              <img
                src="/ofer.png"
                alt="offer"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
