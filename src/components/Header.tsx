
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    setIsMenuOpen(false);
  };

  return (
    <header className="glass rounded-lg p-4 mb-6 fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌤️</div>
          <h1 className="text-2xl font-bold text-white">Mood Mate</h1>
        </div>
        
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 hover-lift"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-12 glass rounded-lg p-4 min-w-48 z-10 slide-up">
                <div className="text-white/90 mb-3 pb-2 border-b border-white/20">
                  Welcome, {user.name}!
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
