
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';
import { Menu, X, User as UserIcon, Mail, Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    setIsMenuOpen(false);
  };

  const languages: { code: Language; name: string; key: string }[] = [
    { code: 'en', name: 'English', key: 'language.english' },
    { code: 'hi', name: 'हिंदी', key: 'language.hindi' },
    { code: 'te', name: 'తెలుగు', key: 'language.telugu' }
  ];

  return (
    <header className="glass rounded-xl p-6 mb-6 fade-in relative z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">🌤️</div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Mood Mate</h1>
        </div>
        
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 hover-lift z-50 relative border border-white/30"
            >
              <div className="flex items-center space-x-2">
                <UserIcon size={20} />
                <span className="font-medium hidden sm:block">{user.name}</span>
              </div>
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            {isMenuOpen && (
              <div 
                className="absolute right-0 top-16 rounded-xl p-4 w-72 sm:w-80 z-[100] slide-up shadow-2xl border border-gray-300"
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#000000'
                }}
              >
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <UserIcon size={18} color="#000000" />
                    <span className="font-semibold text-lg" style={{ color: '#000000 !important' }}>{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail size={16} color="#000000" />
                    <span className="text-sm" style={{ color: '#000000 !important' }}>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe size={16} color="#000000" />
                    <span className="text-sm" style={{ color: '#000000 !important' }}>{user.language}</span>
                  </div>
                </div>
                
                {/* Language Settings */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#000000 !important' }}>
                    <Globe size={16} className="mr-2" color="#000000" />
                    Language Settings
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                          language === lang.code
                            ? 'bg-blue-100 border-blue-200'
                            : 'hover:bg-gray-100 border-transparent'
                        }`}
                        style={{ 
                          color: language === lang.code ? '#1e40af' : '#000000 !important',
                          backgroundColor: language === lang.code ? '#dbeafe' : undefined
                        }}
                      >
                        <div className="font-medium" style={{ color: language === lang.code ? '#1e40af' : '#000000 !important' }}>
                          {lang.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium"
                  style={{ color: '#dc2626' }}
                >
                  {t('logout')}
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
