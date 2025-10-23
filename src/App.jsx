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

function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    document.documentElement.classList.add('dark');

    if (tg) {
      tg.ready();
      tg.expand(); // Сразу
      
      // Повтор для inline-кнопки
      const expand = () => tg.expand();
      setTimeout(expand, 100);
      setTimeout(expand, 500);
      setTimeout(expand, 1000);
      
      tg.disableSwipeGesture();
      tg.disableVerticalSwipes?.();
      document.body.style.overflow = 'hidden';
    }

    const setAppHeight = () => {
      const realHeight =
        window.Telegram?.WebApp?.viewportHeight ||
        window.visualViewport?.height ||
        window.innerHeight;
      const vh = realHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.body.style.height = `${realHeight}px`;
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <div
          id="app-container"
          className="app-wrapper bg-[#0b1120] text-white font-sans flex flex-col"
          style={{
            height: 'calc(var(--vh, 1vh) * 100)',
            width: '100%',
            overflow: 'hidden',
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0b1120',
          }}
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