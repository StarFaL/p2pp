import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MarketScreen from './screens/MarketScreen';
import MyAssetsScreen from './screens/MyAssetsScreen';
import CreateOfferScreen from './screens/CreateOfferScreen';
import TradeDetailsScreen from './screens/TradeDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import ProtectedRoute from './components/ProtectedRoute';
import CloseButton from './components/CloseButton';
import StartAppHandler from './components/StartAppHandler';
import './index.css';

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
      tg.BackButton.hide();
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

    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  return (
    <Router>
      <StartAppHandler />
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
        <CloseButton />

        <div
          className="content-area w-full overflow-auto"
          style={{ height: '100%', paddingBottom: '4rem' }}
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

        {state.isAuthenticated &&
          !['/login', '/register'].includes(location.pathname) && <BottomNav />}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
