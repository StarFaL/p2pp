import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfileScreen() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const [language, setLanguage] = useState('English');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const openHistory = () => {
    navigate('/transaction-history');
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-[#0b1120] text-white px-4 overflow-hidden flex justify-center items-center"
      style={{ height: 'calc(var(--vh, 1vh) * 100)', paddingTop: '2cm', paddingBottom: '2cm' }}
    >
      <motion.div
        className="w-full max-w-md flex flex-col items-center overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Основной контейнер */}
        <motion.div
          className="bg-[#1a2338] rounded-2xl shadow-lg w-full flex flex-col items-center overflow-y-auto scroll-hide"
          style={{ padding: '1.5rem', maxHeight: 'calc(100vh - 10rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        >
          <style>{`.scroll-hide::-webkit-scrollbar { display: none; }`}</style>

          {/* Заголовок */}
          <motion.h1
            className="text-lg sm:text-xl font-bold mb-5 text-center text-gray-200 w-full select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            Profile
          </motion.h1>

          {/* Аватар */}
          <motion.div
            className="relative flex flex-col items-center mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center border-2 border-[#00a968] shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke="none" className="w-8 h-8 sm:w-10 sm:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z" />
              </svg>
            </div>
            <div className="mt-2 text-center">
              <p className="font-semibold text-lg sm:text-xl text-[#00a968]">{state.user?.username || 'Tinyhole'}</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 tracking-wide">Trade volume: $16,810.45</p>
            </div>
          </motion.div>

          {/* Информационные блоки */}
          <motion.div
            className="w-full flex flex-col space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          >
            {/* Rating */}
            <div className="bg-[#151b2c] p-4 rounded-xl flex justify-between items-center">
              <span className="font-medium text-sm sm:text-base">Rating</span>
              <span className="font-semibold text-[#00a968] text-sm sm:text-base">4.6</span>
            </div>

            {/* History */}
            <div
              onClick={openHistory}
              className="bg-[#151b2c] p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#1a2338] transition"
            >
              <span className="font-medium text-sm sm:text-base">History</span>
              <span className="text-gray-400 text-base sm:text-lg">&gt;</span>
            </div>

            {/* Conditions */}
            <div className="bg-[#151b2c] p-4 rounded-xl flex justify-between items-center">
              <span className="font-medium text-sm sm:text-base">Conditions</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#00a968] transition-all duration-200"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-6"></div>
              </label>
            </div>

            {/* Logout */}
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
