
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';
import { Menu, X, User as UserIcon, Mail, Globe } from 'lucide-react';

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
    <header className="glass rounded-xl p-4 mb-6 fade-in relative z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌤️</div>
          <h1 className="text-xl font-bold text-white">Mood Mate</h1>
        </div>
        
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover-lift z-50 relative border border-white/20"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-lg p-4 min-w-64 z-[100] slide-up shadow-xl border border-white/20">
                <div className="text-gray-800 mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserIcon size={16} className="text-gray-600" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-600">{user.language}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
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
