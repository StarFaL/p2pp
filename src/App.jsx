import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
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
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const { state } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // ✅ РАЗНЫЕ НАСТРОЙКИ ДЛЯ iOS И ДРУГИХ ПЛАТФОРМ
    const initTelegramApp = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        setIsTelegramWebApp(true);
        
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        
        console.log('📱 Платформа:', tg.platform);
        console.log('🍎 iOS:', isIOS);
        console.log('📊 Версия:', tg.version);

        // Готовим приложение
        tg.ready();

        // ✅ ОБЩИЕ НАСТРОЙКИ ДЛЯ ВСЕХ ПЛАТФОРМ
        const forceExpand = () => {
          tg.expand();
          tg.disableVerticalSwipes();
        };

        // Мгновенное разворачивание
        forceExpand();

        // ✅ НАСТРОЙКИ ДЛЯ WINDOWS/ANDROID/WEB
        if (!isIOS) {
          console.log('🖥️ Настройка для Windows/Android');
          
          // Скрываем шапку (работает на Windows/Android)
          tg.setHeaderColor('bg_color');
          
          // Агрессивное разворачивание
          const expandDelays = [10, 50, 100, 200, 300, 500, 800, 1000];
          expandDelays.forEach(delay => {
            setTimeout(forceExpand, delay);
          });
        } 
        // ✅ НАСТРОЙКИ ДЛЯ iOS
        else {
          console.log('🍎 Настройка для iOS');
          
          // На iOS сворачивание нельзя полностью отключить
          // Но можно минимизировать эффект
          
          // На iOS чаще вызываем разворачивание
          const iosExpandDelays = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                                  150, 200, 250, 300, 350, 400, 450, 500,
                                  600, 700, 800, 900, 1000, 1500, 2000];
          
          iosExpandDelays.forEach(delay => {
            setTimeout(forceExpand, delay);
          });
          
          // На iOS интервал короче
          const expandInterval = setInterval(() => {
            forceExpand();
          }, 300);

          // Дополнительная защита для iOS
          const handleIOSInteraction = () => {
            setTimeout(forceExpand, 10);
          };
          
          document.addEventListener('touchstart', handleIOSInteraction);
          document.addEventListener('click', handleIOSInteraction);

          return () => {
            clearInterval(expandInterval);
            document.removeEventListener('touchstart', handleIOSInteraction);
            document.removeEventListener('click', handleIOSInteraction);
          };
        }

        // ✅ ОБЩИЕ НАСТРОЙКИ ДЛЯ ВСЕХ
        tg.enableClosingConfirmation();

        tg.BackButton.show();
        tg.BackButton.onClick(() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            if (confirm('Вы уверены, что хотите закрыть приложение?')) {
              tg.close();
            }
          }
        });

        tg.onEvent('viewportChanged', (event) => {
          if (!event.isExpanded) {
            setTimeout(forceExpand, 10);
          }
        });

      } else {
        console.log('🔴 Telegram WebApp не обнаружен');
      }
    };

    initTelegramApp();

    // ✅ ОСОБЫЕ СТИЛИ ДЛЯ iOS
    const setAppHeight = () => {
      const docEl = document.documentElement;
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // Для iOS специальные стили
        docEl.style.height = '100vh';
        docEl.style.minHeight = '-webkit-fill-available';
      } else {
        // Для других платформ
        docEl.style.height = '100vh';
        docEl.style.minHeight = '100vh';
      }
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setTimeout(() => {
        tg.expand();
        tg.disableVerticalSwipes();
      }, 50);
    }
  }, [window.location.pathname]);

  return (
    <Router>
      <StartAppHandler />
      
      {/* ✅ РАЗНЫЕ СТИЛИ ДЛЯ iOS И ДРУГИХ */}
      <div 
        className="app-wrapper bg-primary text-white font-sans w-full"
        style={{
          height: '100vh',
          minHeight: /iPhone|iPad|iPod/.test(navigator.userAgent) ? '-webkit-fill-available' : '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0b1120',
          // ✅ Дополнительные стили для iOS чтобы скрыть шапку
          ...(/iPhone|iPad|iPod/.test(navigator.userAgent) && {
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)'
          })
        }}
      >
        <div 
          className="content-area w-full overflow-auto"
          style={{
            height: '100%',
            paddingBottom: '4rem'
          }}
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
          !['/login', '/register'].includes(window.location.pathname) && (
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