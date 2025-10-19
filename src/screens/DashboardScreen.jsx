import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';

export default function DashboardScreen() {
  const { state } = useContext(AppContext);

  // Подстройка под Telegram WebView и мобильные экраны
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
    <div className="min-h-screen bg-[#0b1120]  text-white flex justify-center items-start px-3 pt-4 pb-[calc(env(safe-area-inset-bottom)+70px)] sm:pt-6 sm:px-4">
      <div className="w-full max-w-md flex flex-col flex-grow">

        {/* Заголовок */}
        <h1 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6 tracking-wide">
          Dashboard
        </h1>

        {/* Подложка */}
        <div className="flex-grow bg-[#1a2338] p-4 sm:p-5 rounded-2xl shadow-md space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] sm:max-h-[calc(100vh-180px)] transition-all">

          {/* Активные трейды */}
          <div className="bg-[#151b2c] p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] active:scale-[0.98] transition-all">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Активные трейды</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968] mt-1">
                {state.trades.length}
              </p>
            </div>
            <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl">
              <img
                src="/trade.svg"
                alt="trade"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>
          </div>

          {/* Офферы */}
          <div className="bg-[#151b2c] p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md hover:bg-[#24304a] active:scale-[0.98] transition-all">
            <div>
              <p className="text-gray-400 text-sm sm:text-base">Офферы</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968] mt-1">
                {state.offers.length}
              </p>
            </div>
            <div className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl">
              <img
                src="/ofer.svg"
                alt="offer"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
