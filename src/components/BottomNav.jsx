import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function BottomNav() {
  const location = useLocation();
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Обновляем высоту при resize (клавиатура, ориентация)
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { to: '/my-assets', label: 'Home', icon: '/assets.svg' },
    { to: '/market', label: 'Market', icon: '/market.svg' },
    { to: '/create-offer', label: 'Create', icon: '/plus.svg' },
    { to: '/dashboard', label: 'Dashboard', icon: '/dashboard.svg' },
    { to: '/profile', label: 'Profile', icon: '/profile.svg' },
  ];

  return (
    <div
      style={{ top: viewportHeight - 64 }} // 64px — пример высоты навигации
      className="absolute left-0 w-full bg-[#1a2338] border-t border-gray-700 flex justify-around py-3 px-4 z-20 text-gray-400 safe-area-bottom"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center focus-visible:ring-2 focus-visible:ring-green-500 transition-all ${
              isActive ? 'text-green-400' : 'hover:text-green-400'
            }`}
          >
            <img
              src={item.icon}
              alt={item.label}
              className={`h-7 w-7 sm:h-8 sm:w-8 mb-1 transition-transform duration-200 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}
            />
            <span className="text-xs sm:text-sm">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
