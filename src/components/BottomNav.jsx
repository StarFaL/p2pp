import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: '/my-assets', label: 'Home', icon: '/assets.png' },
    { to: '/market', label: 'Market', icon: '/market.png' },
    { to: '/create-offer', label: 'Create', icon: '/plus.png' },
    { to: '/dashboard', label: 'Dashboard', icon: '/dashboard.png' },
    { to: '/profile', label: 'Profile', icon: '/profile.png' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2338] border-t border-gray-700 flex justify-around py-3 px-4 z-20 text-gray-400 safe-area-bottom">
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
    </nav>
  );
}
