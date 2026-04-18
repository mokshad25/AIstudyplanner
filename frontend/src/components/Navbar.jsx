import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Clock, BarChart2, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> },
    { name: 'Timer', path: '/timer', icon: <Clock size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <nav className="h-full w-64 glass-card border-l-0 border-y-0 rounded-none flex flex-col pt-6 absolute md:relative z-20">
      <div className="px-6 mb-8 flex items-center space-x-3">
        <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400">
          <BookOpen size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-dark-muted bg-clip-text text-transparent">Study Planner</h1>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400 font-medium' 
                  : 'text-dark-muted hover:bg-dark-border/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-dark-border">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-dark-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
