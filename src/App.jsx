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

    // ✅ ПРОСТАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegramWebApp(true);
      
      console.log('Telegram WebApp initialized');
      
      // 🔒 ОСНОВНОЕ: Запрещаем сворачивание жестом вниз
      tg.disableVerticalSwipes();
      
      // Полноэкранный режим
      tg.expand();
      tg.ready();
      
      // 🔒 Дополнительная защита - подтверждение закрытия
      tg.enableClosingConfirmation();
      
      // Обработка кнопки "Назад"
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // Показываем подтверждение при попытке закрыть
          if (confirm('Вы уверены, что хотите закрыть приложение?')) {
            tg.close();
          }
        }
      });

      // 🔒 Дополнительная защита от изменения размера
      tg.onEvent('viewportChanged', (event) => {
        if (!event.isExpanded) {
          // Если попытались свернуть - сразу разворачиваем обратно
          setTimeout(() => tg.expand(), 100);
        }
      });
    }

    // ✅ Функция установки высоты
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
      
      // Обновляем защиту после авторизации
      tg.disableVerticalSwipes();
      tg.expand();
    }
  }, [state.isAuthenticated]);

  return (
    <Router>
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