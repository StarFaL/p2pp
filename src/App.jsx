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
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes({ keyboardVisible }) {
  const { state } = useContext(AppContext);

  return (
    <>
      {/* Контейнер с адаптивной высотой и плавным смещением при клавиатуре */}
      <div
        className={`relative transition-transform duration-300 ease-out overflow-hidden ${
          keyboardVisible ? '-translate-y-[120px]' : 'translate-y-0'
        }`}
        style={{
          height: '100%',
          minHeight: '100vh',
          background: '#0b1120',
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route
            path="/"
            element={<Navigate to={state.isAuthenticated ? '/market' : '/login'} replace />}
          />
          <Route path="/market" element={<ProtectedRoute><MarketScreen /></ProtectedRoute>} />
          <Route path="/create-offer" element={<ProtectedRoute><CreateOfferScreen /></ProtectedRoute>} />
          <Route path="/trade-details/:id" element={<ProtectedRoute><TradeDetailsScreen /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/my-assets" element={<ProtectedRoute><MyAssetsScreen /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>} />
        </Routes>

        {/* Нижняя навигация (скрывается при клавиатуре) */}
        {state.isAuthenticated && !keyboardVisible && (
          <div className="absolute bottom-0 left-0 right-0">
            <BottomNav />
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    let initialHeight = window.innerHeight;
    const handleResize = () => {
      const diff = initialHeight - window.innerHeight;
      setKeyboardVisible(diff > 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppProvider>
      <Router>
        {/* Корневая обёртка без скролла */}
        <div
          className="min-h-screen h-full w-screen bg-[#0b1120] text-white font-sans overflow-hidden relative"
          style={{ height: '100%' }}
        >
          <AppRoutes keyboardVisible={keyboardVisible} />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
