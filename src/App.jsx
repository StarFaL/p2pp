import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppProvider, AppContext } from "./contexts/AppContext";
import BottomNav from "./components/BottomNav";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MarketScreen from "./screens/MarketScreen";
import CreateOfferScreen from "./screens/CreateOfferScreen";
import TradeDetailsScreen from "./screens/TradeDetailsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DashboardScreen from "./screens/DashboardScreen";
import MyAssetsScreen from "./screens/MyAssetsScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";

function ProtectedRoute({ children }) {
  const { state } = useContext(AppContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      const keyboardOpened = window.innerHeight < window.outerHeight - 150;
      const appContainer = document.querySelector(".app-container");

      if (keyboardOpened) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        appContainer?.classList.add("keyboard-open");
      } else {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        appContainer?.classList.remove("keyboard-open");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppProvider>
      <Router>
        <div
          className="app-container bg-primary text-white font-sans flex flex-col items-center justify-center"
          style={{
            height: "calc(var(--vh, 1vh) * 100)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/market" element={<ProtectedRoute><MarketScreen /></ProtectedRoute>} />
            <Route path="/create-offer" element={<ProtectedRoute><CreateOfferScreen /></ProtectedRoute>} />
            <Route path="/trade-details/:id" element={<ProtectedRoute><TradeDetailsScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
            <Route path="/my-assets" element={<ProtectedRoute><MyAssetsScreen /></ProtectedRoute>} />
            <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistoryScreen /></ProtectedRoute>} />
          </Routes>

          <AppContext.Consumer>
            {({ state }) => state.isAuthenticated && <BottomNav />}
          </AppContext.Consumer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
