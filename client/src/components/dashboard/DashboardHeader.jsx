import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import logo from '../../assets/logo.png';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClasses = ({ isActive }) => 
    `text-(length:--text-body-sm) font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-secondary hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-border-subtle">
      <div className="w-full max-w-[var(--content-max-width)] mx-auto px-[var(--page-padding)] h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center" style={{ height: '100%' }}>
            <img 
              src={logo} 
              alt="GlobeTrotter Logo" 
              className="object-contain"
              style={{ height: '40px', width: 'auto' }} 
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" end className={navClasses}>Dashboard</NavLink>
            <NavLink to="/trips" className={navClasses}>My Trips</NavLink>
            <NavLink to="/explore" className={navClasses}>Explore</NavLink>
            <NavLink to="/community" className={navClasses}>Community</NavLink>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/profile" className="hidden sm:flex items-center gap-2 text-secondary hover:text-primary transition-colors cursor-pointer group">
            <User size={16} className="group-hover:text-terracotta transition-colors" />
            <span className="text-(length:--text-body-sm) font-medium">
              {user?.name || user?.firstName || 'Traveler'}
            </span>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-secondary hover:text-danger transition-colors p-2 rounded-full hover:bg-danger-soft focus:outline-none"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
