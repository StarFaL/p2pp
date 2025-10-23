import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    // ✅ УСИЛЕННАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Готовим приложение
      tg.ready();
      setTgReady(true);
      
      // 🔒 ЗАПРЕТ СВОРАЧИВАНИЯ И ПОЛНОЭКРАННЫЙ РЕЖИМ
      tg.disableVerticalSwipes(); // Блокируем свайп вниз
      tg.expand(); // Разворачиваем на весь экран
      
      // 🔒 ДОПОЛНИТЕЛЬНЫЕ РАЗВОРАЧИВАНИЯ
      setTimeout(() => tg.expand(), 100);
      setTimeout(() => tg.expand(), 500);
      
      // 🔒 ПОДТВЕРЖДЕНИЕ ЗАКРЫТИЯ
      tg.enableClosingConfirmation();
      
      console.log('🟢 Telegram WebApp инициализирован на LoginScreen');
      
      // 🔒 ЗАЩИТА ОТ СВОРАЧИВАНИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА
      tg.onEvent('viewportChanged', (event) => {
        if (!event.isExpanded) {
          setTimeout(() => tg.expand(), 50);
        }
      });
    }
  }, []);

  const handleTelegramLogin = () => {
    if (!tgReady) {
      alert('Telegram WebApp еще не готов');
      return;
    }

    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    if (user) {
      // ✅ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ TELEGRAM
      const userData = {
        id: user.id,
        username: user.username || `user_${user.id}`,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: user.language_code
      };
      
      console.log('👤 Данные пользователя:', userData);
      
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          email: user.username || `user_${user.id}`,
          telegramData: userData
        } 
      });
      
      // 🔒 ОБНОВЛЯЕМ ЗАЩИТУ ПЕРЕД ПЕРЕХОДОМ
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.disableVerticalSwipes();
      }
      
      navigate('/my-assets');
    } else {
      console.error('❌ Данные пользователя не получены');
      alert('Не удалось получить данные Telegram. Попробуйте еще раз.');
    }
  };

  const handleRegister = () => {
    // 🔒 ОБНОВЛЯЕМ ЗАЩИТУ ПЕРЕД ПЕРЕХОДОМ
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.disableVerticalSwipes();
    }
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 bg-[#0b1120] w-full h-full flex justify-center items-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-[#24304a] rounded-2xl shadow-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
          Вход через Telegram
        </h1>

        <button
          onClick={handleTelegramLogin}
          disabled={!tgReady}
          className={`w-full ${
            tgReady 
              ? 'bg-[#00a968] hover:bg-[#00c67a] cursor-pointer' 
              : 'bg-gray-600 cursor-not-allowed'
          } transition py-4 rounded-2xl font-bold text-white text-base mb-4`}
        >
          {tgReady ? 'Войти через Telegram' : 'Загрузка...'}
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