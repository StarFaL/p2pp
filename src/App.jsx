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
      {/* Контент с адаптивной высотой и плавным смещением при открытии клавиатуры */}
      <div
        className={`relative h-[100dvh] transition-transform duration-300 ease-out overflow-hidden ${
          keyboardVisible ? '-translate-y-[120px]' : 'translate-y-0'
        }`}
      >
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
        </Routes>
      </div>

      {/* Нижняя навигация не смещается и скрывается при открытой клавиатуре */}
      {state.isAuthenticated && !keyboardVisible && <BottomNav />}
    </>
  );
}

function App() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Активируем тёмную тему Tailwind
    document.documentElement.classList.add('dark');

    // Фиксируем стартовую высоту
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;

      // Если высота уменьшилась > 150px — клавиатура открыта
      setKeyboardVisible(heightDiff > 150);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppProvider>
      <Router>
        {/* Корневая обёртка на всю высоту без скролла */}
        <div className="h-[100dvh] w-screen bg-[#0b1120] text-white font-sans overflow-hidden relative">
          {/* Анимация затемнения и размытия при открытой клавиатуре */}
          <div
            className={`absolute inset-0 bg-[#0b1120]/60 backdrop-blur-md transition-opacity duration-300 pointer-events-none ${
              keyboardVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <AppRoutes keyboardVisible={keyboardVisible} />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
