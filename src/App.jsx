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
import { viewport, isTMA, init, swipeBehavior } from '@telegram-apps/sdk';

// ProtectedRoute
function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  useEffect(() => {
    // --- Рабочий fullscreen как в примере ---
    const fullscreen = async () =>{ 
      if (viewport.mount.isAvailable()) {
        await viewport.mount();
        viewport.expand();
      } 
      if (viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }
    }

    fullscreen(); // вызываем сразу при старте
  }, []);

  // фикс высоты для мобильных
  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <div
          className="app-wrapper bg-primary text-white font-sans"
          style={{
            height: 'calc(var(--vh, 1vh) * 100)',
            overflow: 'hidden',
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
              !['/login', '/register'].includes(window.location.pathname) && <BottomNav />
            }
          </AppContext.Consumer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
