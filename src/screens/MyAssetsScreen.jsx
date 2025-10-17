import { useContext, useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

export default function MyAssetsScreen() {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const totalBalance = (
    (state.assets.find(a => a.symbol === 'UA')?.balance || 0) * (state.assets.find(a => a.symbol === 'UA')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USDT')?.balance || 0) * (state.assets.find(a => a.symbol === 'USDT')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USD')?.balance || 0) * (state.assets.find(a => a.symbol === 'USD')?.price || 0)
  ).toFixed(2);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-sm">
       {/* Заголовок */}
<div className="flex items-center mb-6 relative">
  <h1 className="text-lg font-bold mx-auto">My Assets</h1>
</div>


        {/* Total Balance */}
        <div className="bg-gradient-to-r from-blue-800 to-green-800 p-10 rounded-2xl mb-5 text-center shadow-md">
          <p className="text-3xl font-bold text-gray-300">${totalBalance}</p>
          <p className="text-gray-400 text-sm mt-1">Total Balance</p>
        </div>

        {/* Asset rows */}
        <div className="space-y-3">
          {/* UA */}
<div className="bg-[#1a2338] p-4 rounded-2xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition">
  <p className="font-bold text-[#00a968] ">UA</p>
  <div className="flex items-center space-x-2">
    <img src="/ua.png" alt="ua" className="h-6 w-6" />
    <span className="font-bold text-[#00a968]">{state.assets.find(a => a.symbol === 'UA')?.balance || 0}</span>
  </div>
</div>

{/* USDT */}
<div className="bg-[#1a2338] p-4 rounded-2xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition">
  <p className="font-bold text-[#00a968] ">USDT</p>
  <div className="flex items-center space-x-2">
    <img src="/usdt.png" alt="usdt" className="h-6 w-6" />
    <span className="font-bold text-[#00a968]">{state.assets.find(a => a.symbol === 'USDT')?.balance || 0}</span>
  </div>
</div>

{/* USD */}
<div className="bg-[#1a2338] p-4 rounded-2xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition">
  <p className="font-bold text-[#00a968]">USD</p>
  <div className="flex items-center space-x-2">
    <img src="/usd.png" alt="usd" className="h-6 w-6" />
    <span className="font-bold text-[#00a968]">{state.assets.find(a => a.symbol === 'USD')?.balance || 0}</span>
  </div>
</div>
</div>
</div>
</div>
  );
}
