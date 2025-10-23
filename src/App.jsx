import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const { state } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const tg = window.Telegram?.WebApp;
    if (tg) {
      // Основные команды для WebApp
      tg.ready();                       // Сообщаем Telegram, что приложение загружено
      tg.expand();                      // Разворачиваем на весь экран
      tg.disableVerticalSwipes();       // Блокируем свайп вниз
      tg.enableClosingConfirmation();   // Подтверждение закрытия
      tg.BackButton.show();             // Показываем кнопку "Назад"
      tg.BackButton.onClick(() => tg.close());

      // При любом изменении viewport повторно расширяем
      tg.onEvent('viewportChanged', () => tg.expand());
    }

    // Настройка высоты на всю страницу
    const setAppHeight = () => {
      const docEl = document.documentElement;
      docEl.style.height = '100vh';
      docEl.style.minHeight = '100vh';
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

      {/* Кнопка открытия в Telegram */}
      <TelegramLauncher />

      <div
        className="app-wrapper bg-primary text-white font-sans w-full"
        style={{
          height: '100vh',
          minHeight: '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0b1120',
        }}
      >
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

        {state.isAuthenticated && !['/login', '/register'].includes(window.location.pathname) && (
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
