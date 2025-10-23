import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MarketScreen from './screens/MarketScreen';
import CreateOfferScreen from './screens/CreateOfferScreen';
import TradeDetailsScreen from './screens/TradeDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import MyAssetsScreen from './screens/MyAssetsScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';

function ProtectedRoute({ children }) {
  return (
    <AppContext.Consumer>
      {({ state }) => 
        state.isAuthenticated ? children : <Navigate to="/login" />
      }
    </AppContext.Consumer>
  );
}

function AppContent() {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const { state } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // ✅ ПРАВИЛЬНАЯ инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegramWebApp(true);
      
      console.log('Telegram WebApp initialized:', {
        platform: tg.platform,
        viewportHeight: tg.viewportHeight,
        viewportStableHeight: tg.viewportStableHeight,
        isExpanded: tg.isExpanded
      });

      // 🔴 ВАЖНО: Сначала ready(), потом expand()
      tg.ready(); // Сообщаем Telegram что приложение готово
      
      // 🔴 ОСНОВНОЕ: Принудительно разворачиваем на весь экран
      tg.expand(); // Разворачиваем на весь экран
      
      // 🔴 ЗАПРЕТ СВОРАЧИВАНИЯ
      tg.disableVerticalSwipes(); // Блокируем свайп вниз
      
      // 🔴 Подтверждение закрытия
      tg.enableClosingConfirmation(); // Запрос подтверждения при закрытии

      // 🔴 Скрываем кнопку назад если не нужно
      // tg.BackButton.hide(); // Раскомментируйте если не нужна кнопка назад

      // 🔴 Обработка изменений размера окна
      tg.onEvent('viewportChanged', (event) => {
        console.log('Viewport changed:', event);
        if (!event.isExpanded) {
          // Если окно свернули - немедленно разворачиваем обратно
          setTimeout(() => {
            tg.expand();
          }, 50);
        }
      });

      // 🔴 Дополнительная защита - периодическая проверка
      const checkViewport = setInterval(() => {
        if (!tg.isExpanded) {
          tg.expand();
        }
      }, 1000);

      // 🔴 Настройка основной кнопки для закрытия
      tg.MainButton.setText('ЗАКРЫТЬ');
      tg.MainButton.onClick(() => {
        if (confirm('Точно закрыть приложение?')) {
          tg.close();
        }
      });

      return () => {
        clearInterval(checkViewport);
      };
    }

    // ✅ Настройка высоты для мобильных устройств
    const setAppHeight = () => {
      const docEl = document.documentElement;
      const vh = window.innerHeight * 0.01;
      docEl.style.setProperty('--vh', `${vh}px`);
      
      // Принудительно устанавливаем высоту
      docEl.style.height = `${window.innerHeight}px`;
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  // 🔴 Повторная активация защиты при смене маршрутов
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Всегда разворачиваем и блокируем свайпы
      setTimeout(() => {
        tg.expand();
        tg.disableVerticalSwipes();
      }, 100);
    }
  }, [window.location.pathname]); // Срабатывает при смене страниц

  return (
    <Router>
      {/* ✅ Принудительно устанавливаем высоту */}
      <div 
        className="app-wrapper bg-primary text-white font-sans w-full"
        style={{ 
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <div 
          className="content-area w-full overflow-auto"
          style={{ 
            height: 'calc(100vh - 4rem)',
            paddingBottom: '4rem'
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/" element={<Navigate to="/login" />} />

            <Route
              path="/my-assets"
              element={<ProtectedRoute><MyAssetsScreen /></ProtectedRoute>}
            />
            <Route
              path="/market"
              element={<ProtectedRoute><MarketScreen /></ProtectedRoute>}
            />
            <Route
              path="/create-offer"
              element={<ProtectedRoute><CreateOfferScreen /></ProtectedRoute>}
            />
            <Route
              path="/trade-details/:id"
              element={<ProtectedRoute><TradeDetailsScreen /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>}
            />
            <Route
              path="/transaction-history"
              element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>}
            />
          </Routes>
        </div>

        {/* BottomNav */}
        {state.isAuthenticated &&
          !['/login', '/register'].includes(window.location.pathname) && (
            <BottomNav />
          )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;