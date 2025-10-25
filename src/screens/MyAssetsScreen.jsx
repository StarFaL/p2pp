import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

export default function MyAssetsScreen() {
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => setVisible(true), 50); // небольшая задержка для плавности
  }, []);

  const totalBalance = (
    (state.assets.find(a => a.symbol === 'UA')?.balance || 0) * (state.assets.find(a => a.symbol === 'UA')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USDT')?.balance || 0) * (state.assets.find(a => a.symbol === 'USDT')?.price || 0) +
    (state.assets.find(a => a.symbol === 'USD')?.balance || 0) * (state.assets.find(a => a.symbol === 'USD')?.price || 0)
  ).toFixed(2);

  useEffect(() => {
    const resizeHandler = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  if (loading) return <Loader />;

  const renderAssetRow = (symbol, imgSrc) => (
    <div className="bg-[#24304a] p-4 sm:p-5 rounded-2xl flex justify-between items-center shadow-md hover:bg-[#24304a] transition">
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
    <div
      className={`fixed inset-0 flex justify-center items-start bg-[#0b1120] text-white px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ paddingTop: '2cm' }}
    >
      <div className="w-full max-w-lg flex flex-col flex-grow">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 tracking-wide">My Assets</h1>

        <div className="flex-grow bg-[#1a2338] p-5 sm:p-6 rounded-2xl shadow-md flex flex-col space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-180px)]">
          <div className="bg-gradient-to-r from-blue-800 to-green-800 p-8 sm:p-10 rounded-2xl text-center shadow-md">
            <p className="text-3xl sm:text-4xl font-bold text-gray-300">${totalBalance}</p>
            <p className="text-gray-400 text-sm mt-1">Total Balance</p>
          </div>

          <div className="space-y-3 flex-grow overflow-y-auto pr-1">
            {renderAssetRow('UA', '/ua.svg')}
            {renderAssetRow('USDT', '/usdt.svg')}
            {renderAssetRow('USD', '/usd.svg')}
          </div>
        </div>
      </div>
    </div>
  );
}
