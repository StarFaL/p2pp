import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    // ✅ ПОЛНАЯ ИНИЦИАЛИЗАЦИЯ ДЛЯ СКРЫТИЯ ШАПКИ И ПОЛНОГО ЭКРАНА
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      console.log('🔧 Инициализация Telegram WebApp...');
      
      // 1. Сначала готовим приложение
      tg.ready();
      setTgReady(true);
      
      // 2. ✅ СКРЫВАЕМ ВСЮ ШАПКУ TELEGRAM (ВКЛЮЧАЯ "MysteryDrop")
      tg.disableVerticalSwipes();
      
      // 3. ✅ ОСНОВНОЕ: ПРИНУДИТЕЛЬНОЕ РАЗВОРАЧИВАНИЕ
      tg.expand();
      
      // 4. ✅ СКРЫВАЕМ HEADER КОМПАКТНОГО РЕЖИМА
      // Эти методы скрывают шапку "MysteryDrop"
      tg.setHeaderColor('bg_color'); // Используем цвет фона
      tg.setBackgroundColor('#0b1120'); // Тот же цвет что и у твоего фона
      
      console.log('📊 Статус после инициализации:', {
        isExpanded: tg.isExpanded,
        platform: tg.platform,
        headerColor: tg.headerColor,
        backgroundColor: tg.backgroundColor
      });
      
      // 5. ✅ АГРЕССИВНОЕ РАЗВОРАЧИВАНИЕ - МНОГОКРАТНО ВЫЗЫВАЕМ
      const expandTimes = [50, 100, 150, 200, 300, 500, 800, 1000, 1500, 2000];
      expandTimes.forEach(delay => {
        setTimeout(() => {
          tg.expand();
          console.log(`🔄 Вызов expand() через ${delay}ms`);
        }, delay);
      });
      
      // 6. ✅ ПОСТОЯННЫЙ КОНТРОЛЬ - ЕСЛИ СВЕРНУЛИ, СРАЗУ РАЗВОРАЧИВАЕМ
      const expandInterval = setInterval(() => {
        if (!tg.isExpanded) {
          console.log('⚠️ Обнаружено сворачивание - немедленно разворачиваю');
          tg.expand();
          tg.disableVerticalSwipes();
        }
      }, 300);

      // 7. ✅ ОБРАБОТКА ИЗМЕНЕНИЙ РАЗМЕРА ОКНА
      const handleViewportChange = (event) => {
        console.log('🔄 Viewport изменен:', event);
        if (!event.isExpanded) {
          setTimeout(() => {
            tg.expand();
            tg.disableVerticalSwipes();
          }, 10);
        }
      };
      
      tg.onEvent('viewportChanged', handleViewportChange);

      return () => {
        clearInterval(expandInterval);
        tg.offEvent('viewportChanged', handleViewportChange);
      };
    } else {
      console.log('🌐 Работаем в обычном браузере');
    }
  }, []);

  const handleTelegramLogin = () => {
    if (!tgReady) {
      alert('Telegram WebApp еще не готов');
      return;
    }

    const user = window.Telegram.WebApp.initDataUnsafe?.user;

    if (user) {
      const userData = {
        id: user.id,
        username: user.username || `user_${user.id}`,
        firstName: user.first_name,
        lastName: user.last_name
      };
      
      console.log('👤 Данные пользователя:', userData);
      
      dispatch({ 
        type: 'LOGIN', 
        payload: { 
          email: user.username || `user_${user.id}`,
          telegramData: userData
        } 
      });
      
      // ✅ ОБНОВЛЯЕМ ЗАЩИТУ ПЕРЕД ПЕРЕХОДОМ
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.disableVerticalSwipes();
      }
      
      navigate('/my-assets');
    } else {
      alert('Не удалось получить данные Telegram. Попробуйте еще раз.');
    }
  };

  const handleRegister = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      tg.disableVerticalSwipes();
    }
    navigate('/register');
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0b1120] w-full h-full flex justify-center items-center px-4 sm:px-6 md:px-8"
      style={{ 
        // ✅ ПРИНУДИТЕЛЬНО ЗАДАЕМ ВЫСОТУ
        height: '100vh',
        minHeight: '100vh'
      }}
    >
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

        {/* 🔧 ИНФОРМАЦИЯ ДЛЯ ОТЛАДКИ */}
        {process.env.NODE_ENV === 'development' && window.Telegram?.WebApp && (
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-left text-white">
            <div><strong>Отладочная информация:</strong></div>
            <div>Telegram Ready: {tgReady ? '✅' : '❌'}</div>
            <div>Expanded: {window.Telegram.WebApp.isExpanded ? '✅' : '❌'}</div>
            <div>Platform: {window.Telegram.WebApp.platform}</div>
            <div>Version: {window.Telegram.WebApp.version}</div>
          </div>
        )}
      </div>
    </div>
  );
}