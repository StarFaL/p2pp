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

  // Закрытие выпадающего списка при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setOpen(false);
    // Здесь можно добавить логику смены языка через i18n или state
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b1120] text-white px-6 pt-10">
      {/* Заголовок */}
      <h1 className="text-lg font-bold mb-6 text-center text-gray-200 w-full">Profile</h1>

      {/* Аватар */}
      <div className="relative flex flex-col items-center mb-4">
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
          <p className="font-semibold text-lg text-[#00a968]">{state.user?.username || 'Tinyhole'}</p>
          <p className="text-gray-400 text-sm tracking-wide">Trade volume: $16,810.45</p>
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="w-full max-w-xs space-y-3 mt-4">
        {/* Rating */}
        <div className="bg-[#151b2c] p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium">Rating</span>
          <span className="font-semibold text-[#00a968]">4.6</span>
        </div>

        {/* History */}
        <div
          onClick={openHistory}
          className="bg-[#151b2c] p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#1a2338] transition"
        >
          <span className="font-medium">History</span>
          <span className="text-gray-400 text-lg">&gt;</span>
        </div>

        {/* Conditions */}
        <div className="bg-[#151b2c] p-3 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Conditions</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">
              I sell only to trusted users
            </span>

            {/* Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-[#00a968] transition-all duration-200"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-200 peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Language selector */}
        <div className="bg-[#151b2c] p-3 rounded-xl relative" ref={dropdownRef}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Language</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full bg-[#24304a] p-3 rounded-xl text-left flex justify-between items-center text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
          >
            <span>{language}</span>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>

          {open && (
            <div className="absolute z-10 w-full bg-[#1a2338] mt-2 rounded-xl shadow-lg">
              {['English', 'Українська', 'Русский'].map((lang) => (
                <div
                  key={lang}
                  onClick={() => selectLanguage(lang)}
                  className="p-3 text-sm hover:bg-[#24304a] cursor-pointer transition"
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="text-red-400 font-semibold hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
