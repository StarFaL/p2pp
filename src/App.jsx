import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MarketScreen from './screens/MarketScreen';
import ProfileScreen from './screens/ProfileScreen';

function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  // фиксируем реальную высоту экрана
  useEffect(() => {
    document.documentElement.classList.add('dark');
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
        <div className="app-wrapper bg-primary text-white font-sans">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Защищённые экраны */}
            <Route path="/market" element={<ProtectedRoute><MarketScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          </Routes>

          {/* BottomNav только для авторизованных и не на логине/регистрации */}
          <AppContext.Consumer>
            {({ state }) =>
              state.isAuthenticated &&
              !['/login', '/register'].includes(window.location.pathname) &&
              <BottomNav />
            }
          </AppContext.Consumer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
