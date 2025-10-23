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
    // ✅ ОБРАБОТКА STARTAPP ПАРАМЕТРА ДЛЯ КНОПКИ "WALLET"
    const urlParams = new URLSearchParams(window.location.search);
    const startAppParam = urlParams.get('startapp');
    
    if (startAppParam) {
      console.log('StartApp parameter:', startAppParam);
      
      // Если параметр содержит "wallet" - перенаправляем на соответствующий экран
      if (startAppParam.includes('wallet')) {
        if (state.isAuthenticated) {
          // Если пользователь авторизован - открываем кошелек
          navigate('/my-assets');
        } else {
          // Если не авторизован - на логин
          navigate('/login');
        }
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

    // ✅ УСИЛЕННАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegramWebApp(true);
      
      console.log('Telegram WebApp initialized');
      console.log('Start parameters:', tg.initData);
      
      // 🔒 ОСНОВНОЕ: Запрещаем сворачивание жестом вниз
      tg.disableVerticalSwipes();
      
      // 🔒 МНОГОКРАТНОЕ РАЗВОРАЧИВАНИЕ НА ВЕСЬ ЭКРАН
      tg.expand();
      tg.ready();
      
      setTimeout(() => tg.expand(), 100);
      setTimeout(() => tg.expand(), 500);
      setTimeout(() => tg.expand(), 1000);
      
      // 🔒 Подтверждение закрытия
      tg.enableClosingConfirmation();
      
      // 🔒 ПОСТОЯННАЯ ПРОВЕРКА И РАЗВОРАЧИВАНИЕ
      const expandInterval = setInterval(() => {
        if (!tg.isExpanded) {
          tg.expand();
        }
      }, 2000);

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

      // Защита от изменения размера
      tg.onEvent('viewportChanged', (event) => {
        console.log('Viewport changed:', event);
        if (!event.isExpanded) {
          setTimeout(() => {
            tg.expand();
            tg.disableVerticalSwipes();
          }, 50);
        }
      });

      return () => {
        clearInterval(expandInterval);
      };
    }

    // Функция установки высоты
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);

  // 🔒 Отслеживаем изменения авторизации для обновления защиты
  useEffect(() => {
    if (window.Telegram?.WebApp && state.isAuthenticated) {
      const tg = window.Telegram.WebApp;
      tg.disableVerticalSwipes();
      tg.expand();
      setTimeout(() => tg.expand(), 300);
    }
  }, [state.isAuthenticated]);

  return (
    <Router>
      {/* ✅ Обработчик startapp параметров */}
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