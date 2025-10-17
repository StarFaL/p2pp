import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


const initialState = {
  isAuthenticated: false,
  user: null,
  offers: [],
  trades: [],
  assets: [
     { symbol: 'UA', balance: 1000, price: 2 },   // 100 * 2 = 200
     { symbol: 'USDT', balance: 50, price: 1 },  // 50 * 1 = 50
     { symbol: 'USD', balance: 25, price: 10 }   // 25 * 10 = 250
  ],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload, error: null };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_OFFERS':
       return { ...state, offers: action.payload, loading: false };
    case 'SET_TRADES': 
  return { ...state, trades: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchOffers = async () => {
      dispatch({ type: 'SET_LOADING' });
      try {
        const res = await api.get('/offers');
        dispatch({ type: 'SET_OFFERS', payload: res.data });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    };
    fetchOffers();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
