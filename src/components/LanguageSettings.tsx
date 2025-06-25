
import React, { useState } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Settings, Globe } from 'lucide-react';

const LanguageSettings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; key: string }[] = [
    { code: 'en', name: 'English', key: 'language.english' },
    { code: 'hi', name: 'हिंदी', key: 'language.hindi' },
    { code: 'te', name: 'తెలుగు', key: 'language.telugu' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover-lift flex items-center space-x-2"
      >
        <Settings size={18} />
        <Globe size={18} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-lg p-4 min-w-48 z-[100] slide-up shadow-xl border border-white/20">
          <div className="text-gray-800 mb-3 pb-3 border-b border-gray-200">
            <h3 className="font-semibold flex items-center space-x-2">
              <Globe size={16} />
              <span>Language Settings</span>
            </h3>
          </div>
          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-between ${
                  language === lang.code 
                    ? 'bg-blue-500/20 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{t(lang.key)}</span>
                {language === lang.code && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSettings;
