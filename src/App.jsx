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
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { state } = useContext(AppContext);

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-white">
      {/* Контент страниц */}
      <div className="flex-1 overflow-auto pt-4 pb-24">
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

      {/* Bottom navigation */}
      {state.isAuthenticated && <BottomNav />}
    </div>
  );
}

function App() {
  useEffect(() => {
    // Включаем dark mode для Tailwind
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
