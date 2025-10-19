import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
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

// Защищённые маршруты
function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { state } = useContext(AppContext);

  return (
    <>
      {/* Контент на весь экран, без скролла */}
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/"
            element={<Navigate to={state.isAuthenticated ? "/market" : "/login"} replace />}
          />
          <Route path="/market" element={<ProtectedRoute><MarketScreen /></ProtectedRoute>} />
          <Route path="/create-offer" element={<ProtectedRoute><CreateOfferScreen /></ProtectedRoute>} />
          <Route path="/trade-details/:id" element={<ProtectedRoute><TradeDetailsScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/my-assets" element={<ProtectedRoute><MyAssetsScreen /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Нижняя навигация */}
      {state.isAuthenticated && <BottomNav />}
    </>
  );
}

function App() {
  useEffect(() => {
    // Telegram WebApp адаптация
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Разворачиваем приложение на весь экран Telegram
      tg.expand();

      // Устанавливаем тёмную или светлую тему в зависимости от Telegram
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Настраиваем цвет фона, чтобы совпадал с Telegram
      document.body.style.backgroundColor = tg.themeParams.bg_color || '#0b1120';
    } else {
      // fallback для локального тестирования
      document.documentElement.classList.add('dark');
    }

    // Отключаем скролл на странице
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <AppProvider>
      <Router>
        {/* Корневой контейнер Mini App */}
        <div className="h-[100dvh] w-screen bg-[#0b1120] text-white font-sans flex flex-col overflow-hidden">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
