
import React from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    AuthService.logout();
    onLogout();
  };

  return (
    <header className="glass rounded-lg p-4 mb-6 fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌤️</div>
          <h1 className="text-2xl font-bold text-white">Mood Mate</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white/90">Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
