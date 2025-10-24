import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

export default function DashboardScreen() {
  const { state } = useContext(AppContext);

  // Подстройка высоты под мобильные и Telegram WebView
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
      className="fixed inset-0 bg-[#0b1120] text-white px-3 overflow-hidden flex justify-center"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        paddingTop: '2cm',
        paddingBottom: '2cm',
      }}
    >
      <motion.div
        className="w-full max-w-md flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Заголовок */}
        <motion.h1
          className="text-lg sm:text-xl font-semibold text-center mb-6 tracking-wide select-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        >
          Dashboard
        </motion.h1>

        {/* Контейнер с карточками */}
        <motion.div
          className="bg-[#1a2338] rounded-2xl shadow-md overflow-y-auto scroll-hide"
          style={{
            maxHeight: 'calc(100vh - 18rem)', // уменьшили высоту
            padding: '1rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <style>{`.scroll-hide::-webkit-scrollbar { display: none; }`}</style>

          {/* Активные трейды */}
          <motion.div
            className="bg-[#151b2c] flex items-center justify-between rounded-2xl shadow-md hover:bg-[#24304a] transition-all mb-4 last:mb-0"
            style={{ padding: '1.5rem' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="flex flex-col justify-center">
              <p className="text-gray-400 text-sm sm:text-base">Активные трейды</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968]">{state.trades.length}</p>
            </div>
            <div className="flex items-center justify-center rounded-xl">
              <img src="/trade.svg" alt="trade" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            </div>
          </motion.div>

          {/* Офферы */}
          <motion.div
            className="bg-[#151b2c] flex items-center justify-between rounded-2xl shadow-md hover:bg-[#24304a] transition-all mb-4 last:mb-0"
            style={{ padding: '1.5rem' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="flex flex-col justify-center">
              <p className="text-gray-400 text-sm sm:text-base">Офферы</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#00a968]">{state.offers.length}</p>
            </div>
            <div className="flex items-center justify-center rounded-xl">
              <img src="/ofer.svg" alt="offer" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
