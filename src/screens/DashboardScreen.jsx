import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';
import { ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

export default function DashboardScreen() {
  const { state } = useContext(AppContext);

  if (state.loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-sm">
        {/* Заголовок */}
        <h1 className="text-lg font-bold text-center mb-6">Dashboard</h1>

        {/* Карточки */}
        <div className="space-y-4">
          {/* Активные трейды */}
          <div className="bg-[#1a2338] p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] transition-all">
            <div>
              <p className="text-gray-400 text-lg">Активные трейды</p>
              <p className="text-2xl font-bold text-[#00a968] mt-1">{state.trades.length}</p>
            </div>
            <div className="flex items-center p-2 rounded-xl  justify-center">
               <img src="/trade.png" alt="ua" className="h-15 w-15" />
            </div>
          </div>

          {/* Офферы */}
          <div className="bg-[#1a2338] p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] transition-all">
            <div>
              <p className="text-gray-400 text-lg">Офферы</p>
              <p className="text-2xl font-bold text-[#00a968] mt-1">{state.offers.length}</p>
            </div>
               <div className="flex items-center p-2 rounded-xl  justify-center">
               <img src="/ofer.png" alt="ua" className="h-15 w-15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
