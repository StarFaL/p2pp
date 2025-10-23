import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
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
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // ✅ Упрощенная инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsTelegramWebApp(true);
      
      console.log('Telegram WebApp initialized');
      
      // Минимальные настройки для полноэкранного режима
      tg.expand();
      tg.ready();
      
      // Простая настройка кнопки "Назад"
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          tg.close();
        }
      });
    }

    // ✅ Простая функция установки высоты
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

  return (
    <AppProvider>
      <Router>
        {/* Упрощенный контейнер без сложных стилей */}
        <div className="app-wrapper bg-primary text-white font-sans min-h-screen w-full">
          <div className="content-area min-h-screen pb-16"> {/* Добавляем отступ для BottomNav */}
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
          <AppContext.Consumer>
            {({ state }) =>
              state.isAuthenticated &&
              !['/login', '/register'].includes(window.location.pathname) && (
                <BottomNav />
              )
            }
          </AppContext.Consumer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;