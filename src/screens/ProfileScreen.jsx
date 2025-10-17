import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

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

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Подстройка высоты под WebView Telegram
  useEffect(() => {
    const resizeHandler = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b1120] text-white px-4 pt-10 pb-24">
      {/* Заголовок */}
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-200 w-full">Profile</h1>

      {/* Аватар */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center border-2 border-[#00a968] shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="none"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 1 1 15 0v.75H4.5v-.75Z"
            />
          </svg>
        </div>
        <div className="mt-3 text-center">
          <p className="font-semibold text-lg sm:text-xl text-[#00a968]">{state.user?.username || 'Tinyhole'}</p>
          <p className="text-gray-400 text-sm sm:text-base mt-1 tracking-wide">Trade volume: $16,810.45</p>
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="w-full sm:max-w-xs space-y-3 mt-4">
        {/* Rating */}
        <div className="bg-[#151b2c] p-4 sm:p-5 rounded-xl flex justify-between items-center">
          <span className="font-medium text-base">Rating</span>
          <span className="font-semibold text-[#00a968] text-base">4.6</span>
        </div>

        {/* History */}
        <div
          onClick={openHistory}
          className="bg-[#151b2c] p-4 sm:p-5 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#1a2338] transition"
        >
          <span className="font-medium text-base">History</span>
          <span className="text-gray-400 text-lg">&gt;</span>
        </div>

        {/* Conditions */}
        <div className="bg-[#151b2c] p-4 sm:p-5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-base">Conditions</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm sm:text-base">
              I sell only to trusted users
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#00a968] transition-all duration-200"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 peer-checked:translate-x-6"></div>
            </label>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="text-red-400 font-semibold hover:text-red-300 transition text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
