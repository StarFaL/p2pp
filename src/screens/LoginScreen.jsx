import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { viewport, isTMA, init, swipeBehavior } from '@telegram-apps/sdk';

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    const disableVerticalSwipe = async () => {
      try {
        if (swipeBehavior.mount && swipeBehavior.mount.isAvailable()) {
          await swipeBehavior.mount();
        }
        if (
          swipeBehavior.disableVerticalSwipe &&
          swipeBehavior.disableVerticalSwipe.isAvailable()
        ) {
          await swipeBehavior.disableVerticalSwipe();
        }
      } catch (error) {
        console.warn('Ошибка при отключении свайпа:', error);
      }
    };

    const setupCloseButton = async () => {
      try {
        const webApp = window.Telegram?.WebApp;
        if (!webApp) return;

        // Показываем стандартную кнопку закрытия
        if (webApp.closeButton && webApp.closeButton.isAvailable()) {
          await webApp.closeButton.show();

          // Перехватываем нажатие
          webApp.closeButton.onClick(() => {
            const confirmed = window.confirm('Вы действительно хотите закрыть приложение?');
            if (confirmed) {
              webApp.close();
            }
          });
        }
      } catch (error) {
        console.warn('Ошибка при настройке кнопки закрытия:', error);
      }
    };

    const initializeApp = async () => {
      if (await isTMA()) {
        init(); // Инициализация Telegram Mini App

        if (viewport.mount.isAvailable()) {
          await viewport.mount();
          viewport.expand();
        }

        if (viewport.requestFullscreen.isAvailable()) {
          await viewport.requestFullscreen();
        }

        await disableVerticalSwipe();   // 🔒 Блокируем свайп вниз
        await setupCloseButton();       // 🧩 Подтверждение при нажатии кнопки "Закрыть"

        setTgReady(true);               // Telegram WebApp готов
      }
    };

    initializeApp();
  }, []);

  const handleTelegramLogin = () => {
    if (!tgReady) return alert('Telegram WebApp ещё не готов');

    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    if (!user) return alert('Не удалось получить данные Telegram.');

    const userData = {
      id: user.id,
      username: user.username || `user_${user.id}`,
      firstName: user.first_name,
      lastName: user.last_name,
      languageCode: user.language_code,
    };

    dispatch({
      type: 'LOGIN',
      payload: {
        email: user.username || `user_${user.id}`,
        telegramData: userData,
      },
    });

    navigate('/my-assets');
  };

  const handleRegister = () => navigate('/register');

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
