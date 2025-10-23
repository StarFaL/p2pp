import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

function StartAppHandler() {
  const navigate = useNavigate();
  const { state } = useContext(AppContext);

  useEffect(() => {
    // Обработка startapp параметра
    const urlParams = new URLSearchParams(window.location.search);
    const startAppParam = urlParams.get('startapp');
    
    if (startAppParam && startAppParam.includes('wallet')) {
      if (state.isAuthenticated) {
        navigate('/my-assets');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, state.isAuthenticated]);

  return null;
}

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

    // ✅ УСИЛЕННАЯ ЗАЩИТА ОТ СВОРАЧИВАНИЯ
    const initTelegramApp = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        setIsTelegramWebApp(true);
        
        console.log('🟢 Telegram WebApp инициализирован');
        console.log('📊 Статус:', {
          isExpanded: tg.isExpanded,
          platform: tg.platform,
          viewportHeight: tg.viewportHeight
        });
        
        // 🔒 ОСНОВНОЕ: Запрещаем сворачивание жестом вниз
        tg.disableVerticalSwipes();
        
        // 🔒 АГРЕССИВНОЕ РАЗВОРАЧИВАНИЕ
        tg.ready();
        tg.expand(); // Основное разворачивание
        
        // Многократное разворачивание с разными задержками
        const expandAttempts = [100, 200, 300, 500, 800, 1000, 1500, 2000];
        expandAttempts.forEach(delay => {
          setTimeout(() => {
            tg.expand();
            console.log(`🔄 Разворачивание попытка через ${delay}ms`);
          }, delay);
        });
        
        // 🔒 Подтверждение закрытия
        tg.enableClosingConfirmation();
        
        // 🔒 ПОСТОЯННЫЙ КОНТРОЛЬ РАЗВОРАЧИВАНИЯ
        const expandInterval = setInterval(() => {
          if (!tg.isExpanded) {
            console.log('⚠️ Обнаружено сворачивание - разворачиваю обратно');
            tg.expand();
            tg.disableVerticalSwipes();
          }
        }, 1000);

        // Кнопка "Назад"
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            if (confirm('Вы уверены, что хотите закрыть приложение?')) {
              tg.close();
            }
          }
        });

        // 🔒 СИЛЬНАЯ ЗАЩИТА ОТ ИЗМЕНЕНИЯ РАЗМЕРА
        tg.onEvent('viewportChanged', (event) => {
          console.log('🔄 Viewport изменен:', event);
          if (!event.isExpanded) {
            console.log('⚠️ Попытка сворачивания - блокирую');
            setTimeout(() => {
              tg.expand();
              tg.disableVerticalSwipes();
            }, 10);
          }
        });

        // 🔒 ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА ПРИ КЛИКАХ
        const handleUserInteraction = () => {
          if (!tg.isExpanded) {
            tg.expand();
          }
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);

        return () => {
          clearInterval(expandInterval);
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        };
      } else {
        console.log('🔴 Telegram WebApp не обнаружен - работаем в браузере');
      }
    };

    // Запускаем инициализацию
    initTelegramApp();

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

  // 🔒 Усиленная защита при авторизации
  useEffect(() => {
    if (window.Telegram?.WebApp && state.isAuthenticated) {
      const tg = window.Telegram.WebApp;
      console.log('🔒 Обновление защиты после авторизации');
      tg.disableVerticalSwipes();
      tg.expand();
      
      // Дополнительные разворачивания
      setTimeout(() => tg.expand(), 100);
      setTimeout(() => tg.expand(), 500);
    }
  }, [state.isAuthenticated]);

  // 🔒 Защита при смене маршрутов
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setTimeout(() => {
        tg.expand();
        tg.disableVerticalSwipes();
      }, 50);
    }
  }, [window.location.pathname]);

  return (
    <Router>
      <StartAppHandler />
      
      <div className="app-wrapper bg-primary text-white font-sans min-h-screen w-full">
        <div className="content-area min-h-screen pb-16">
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

        {/* BottomNav только для авторизованных пользователей */}
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