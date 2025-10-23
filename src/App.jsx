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

// ✅ КОМПОНЕНТ КНОПКИ ДЛЯ ОТКРЫТИЯ В TELEGRAM
function TelegramLauncher() {
  const openInTelegram = () => {
    // Пытаемся открыть через Telegram
    window.location.href = "tg://resolve?startapp=wallet";
    
    // Фолбэк на обычную ссылку
    setTimeout(() => {
      window.location.href = "https://p2pp-2.vercel.app";
    }, 1500);
  };

  // Показываем кнопку только если НЕ в Telegram WebApp
  if (window.Telegram?.WebApp) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={openInTelegram}
        className="bg-[#0088cc] hover:bg-[#0077bb] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg flex items-center gap-2 transition-all"
      >
        <span>📱</span>
        Open in Telegram
      </button>
    </div>
  );
}

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

    // ✅ УЛУЧШЕННАЯ ПРОВЕРКА TELEGRAM CONTEXT
    const initTelegramApp = () => {
      // Проверяем несколько способов определения Telegram WebApp
      const isInTelegram = (
        window.Telegram?.WebApp || 
        window.TelegramWebviewProxy || 
        navigator.userAgent.includes('Telegram')
      );

      if (isInTelegram && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        setIsTelegramWebApp(true);
    
        // ✅ ВАЖНО: Проверяем что это действительно WebApp а не просто чат
        const isRealWebApp = tg.initData || tg.initDataUnsafe;
        
        if (isRealWebApp) {
          console.log('🚀 Это настоящий WebApp - включаем защиту');
          
          // 1. Готовим приложение
          tg.ready();

          // 2. ✅ СИЛЬНАЯ ЗАЩИТА ОТ СВАЙПА
          const enableProtection = () => {
            tg.expand();
            tg.disableVerticalSwipes(); // Блокируем свайп вниз
            tg.enableClosingConfirmation(); // Подтверждение закрытия
            
            // Скрываем шапку если не iOS
            if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) {
              tg.setHeaderColor('bg_color');
            }
          };

          // 3. ✅ МГНОВЕННО ВКЛЮЧАЕМ ЗАЩИТУ
          enableProtection();


          // 6. ✅ ЗАЩИТА ПРИ ЛЮБОМ ВЗАИМОДЕЙСТВИИ
          const handleInteraction = () => {
            setTimeout(enableProtection, 10);
          };
          
          document.addEventListener('click', handleInteraction);
          document.addEventListener('touchstart', handleInteraction);
          document.addEventListener('scroll', handleInteraction);
          document.addEventListener('mousedown', handleInteraction);

          // 7. ✅ КНОПКА НАЗАД
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

          // 8. ✅ ЗАЩИТА ОТ ИЗМЕНЕНИЯ РАЗМЕРА
          tg.onEvent('viewportChanged', (event) => {
            console.log('🔄 Viewport изменен:', event);
            if (!event.isExpanded) {
              setTimeout(enableProtection, 10);
            }
          });

          return () => {
            clearInterval(protectionInterval);
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('scroll', handleInteraction);
            document.removeEventListener('mousedown', handleInteraction);
          };
        } else {
          console.log('⚠️ Это чат с ботом, а не WebApp - защита не активирована');
        }
      } else {
        console.log('🔴 Telegram не обнаружен - работаем в браузере');
      }
    };

    initTelegramApp();

    // ✅ НАСТРОЙКА ВЫСОТЫ
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

  // ✅ ЗАЩИТА ПРИ СМЕНЕ СТРАНИЦ
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Проверяем что это WebApp а не чат
      if (tg.initData || tg.initDataUnsafe) {
        setTimeout(() => {
          tg.expand();
          tg.disableVerticalSwipes();
        }, 50);
      }
    }
  }, [window.location.pathname]);

  return (
    <Router>
      <StartAppHandler />
      
      {/* ✅ КНОПКА ДЛЯ ОТКРЫТИЯ В TELEGRAM */}
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
          backgroundColor: '#0b1120'
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