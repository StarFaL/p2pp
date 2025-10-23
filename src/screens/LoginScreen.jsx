import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      setTgReady(true);
    }
  }, []);

  const handleTelegramLogin = () => {
    if (!tgReady) return;

    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    if (user) {
      dispatch({ type: 'LOGIN', payload: { email: user.username || user.id } });
      navigate('/my-assets');
    } else {
      alert('Не удалось получить данные Telegram');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 bg-[#0b1120] w-full h-full flex justify-center items-center px-4 sm:px-6 md:px-8">
      {/* адаптивные отступы по бокам ↑ */}

      <div className="w-full max-w-sm p-6 sm:p-8 bg-[#24304a] rounded-2xl shadow-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
          Вход через Telegram
        </h1>

        <button
          onClick={handleTelegramLogin}
          className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-4 rounded-2xl font-bold text-white text-base mb-4"
        >
          Войти через Telegram
        </button>

        <button
          onClick={handleRegister}
          className="w-full bg-gray-700 hover:bg-gray-600 transition py-3 rounded-2xl font-semibold text-white text-base"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
