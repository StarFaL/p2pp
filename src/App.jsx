import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useContext } from 'react';
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
import TelegramLauncher from './components/TelegramLauncher';
import { XMarkIcon } from '@heroicons/react/24/solid';

// === Компонент кнопки "Закрыть" ===
function CloseButton() {
  const tg = window.Telegram?.WebApp;

  const handleClose = () => {
    tg?.close();
  };

  // Если Telegram API недоступен (например, тест в браузере) — кнопку не показываем
  if (!tg) return null;

  return (
    <button
      onClick={handleClose}
      className="fixed top-4 left-4 bg-gray-800/80 text-white p-2 rounded-full shadow-md active:scale-95 transition-all z-50 hover:bg-gray-700"
      aria-label="Закрыть приложение"
    >
      <XMarkIcon className="w-5 h-5" />
    </button>
  );
}

// === Обработка старта приложения по параметрам ===
function StartAppHandler() {
  const navigate = useNavigate();
  const { state } = useContext(AppContext);

  useEffect(() => {
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

// === Защита роутов (требует авторизацию) ===
function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
}

// === Основной контент приложения ===
function AppContent() {
  const { state } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes();
      tg.enableClosingConfirmation();

      // Отключаем стандартную кнопку Telegram
      tg.BackButton.hide();

      // При изменении viewport снова разворачиваем
      tg.onEvent('viewportChanged', () => setTimeout(() => tg.expand(), 100));
    }

    const setAppHeight = () => {
      const docEl = document.documentElement;
      docEl.style.height = '100svh';
      docEl.style.minHeight = '100svh';
      docEl.style.overflow = 'hidden';
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);

  return (
    <Router>
      <StartAppHandler />
      <TelegramLauncher />

      <div
        className="app-wrapper bg-primary text-white font-sans w-full"
        style={{
          height: '100svh',
          minHeight: '100svh',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0b1120',
        }}
      >
        {/* Кнопка Закрыть — всегда на экране */}
        <CloseButton />

        <div
          className="content-area w-full overflow-auto"
          style={{ height: '100%', paddingBottom: '4rem' }}
        >
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/my-assets" element={<ProtectedRoute><MyAssetsScreen /></ProtectedRoute>} />
            <Route path="/market" element={<ProtectedRoute><MarketScreen /></ProtectedRoute>} />
            <Route path="/create-offer" element={<ProtectedRoute><CreateOfferScreen /></ProtectedRoute>} />
            <Route path="/trade-details/:id" element={<ProtectedRoute><TradeDetailsScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
            <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>} />
          </Routes>
        </div>

        {/* Нижнее меню, если пользователь вошёл */}
        {state.isAuthenticated && !['/login', '/register'].includes(location.pathname) && (
          <BottomNav />
        )}
      </div>
    </Router>
  );
}

// === Обёртка контекста ===
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
