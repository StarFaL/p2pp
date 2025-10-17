import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

export default function MyAssetsScreen() {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Общий баланс
  const totalBalance = (
    (state.assets.find(a => a.symbol === 'UA')?.balance || 0) * (state.assets.find(a => a.symbol === 'UA')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USDT')?.balance || 0) * (state.assets.find(a => a.symbol === 'USDT')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USD')?.balance || 0) * (state.assets.find(a => a.symbol === 'USD')?.price || 0)
  ).toFixed(2);

  // Подстройка высоты под WebView Telegram
  useEffect(() => {
    const resizeHandler = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  if (loading) return <Loader />;

  const renderAssetRow = (symbol, imgSrc) => (
    <div className="bg-[#1a2338] p-4 sm:p-5 rounded-2xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition">
      <p className="font-bold text-[#00a968] text-base sm:text-lg">{symbol}</p>
      <div className="flex items-center space-x-2">
        <img src={imgSrc} alt={symbol} className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="font-bold text-[#00a968] text-base sm:text-lg">
          {state.assets.find(a => a.symbol === symbol)?.balance || 0}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-4 pb-24">
      <div className="w-full sm:max-w-sm">
        {/* Заголовок */}
        <div className="flex items-center mb-6 relative">
          <h1 className="text-xl sm:text-2xl font-bold mx-auto">My Assets</h1>
        </div>

        {/* Total Balance */}
        <div className="bg-gradient-to-r from-blue-800 to-green-800 p-8 sm:p-10 rounded-2xl mb-5 text-center shadow-md">
          <p className="text-3xl sm:text-4xl font-bold text-gray-300">${totalBalance}</p>
          <p className="text-gray-400 text-sm mt-1">Total Balance</p>
        </div>

        {/* Asset rows */}
        <div className="space-y-3">
          {renderAssetRow('UA', '/ua.png')}
          {renderAssetRow('USDT', '/usdt.png')}
          {renderAssetRow('USD', '/usd.png')}
        </div>
      </div>
    </div>
  );
}
