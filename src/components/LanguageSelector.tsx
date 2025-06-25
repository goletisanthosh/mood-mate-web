
import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; key: string }[] = [
    { code: 'en', name: 'English', key: 'language.english' },
    { code: 'hi', name: 'हिंदी', key: 'language.hindi' },
    { code: 'te', name: 'తెలుగు', key: 'language.telugu' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-black">
            {t(lang.key)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
