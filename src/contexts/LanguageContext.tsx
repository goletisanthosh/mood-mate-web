
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && ['en', 'hi', 'te'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const saveLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: saveLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    // Header
    'welcome': 'Welcome',
    'logout': 'Logout',
    
    // Weather
    'weather.title': 'Current Weather',
    'weather.location': 'Location',
    'weather.temperature': 'Temperature',
    'weather.condition': 'Condition',
    'weather.humidity': 'Humidity',
    'weather.windSpeed': 'Wind Speed',
    
    // Recommendations
    'recommendations.getWeather': 'Get weather data to see personalized recommendations!',
    'recommendations.music.title': 'Telugu Music Recommendations',
    'recommendations.food.title': 'Indian Food Recommendations',
    'recommendations.stays.title': 'Indian Stay Recommendations',
    'recommendations.noMusic': 'No music recommendations available for {mood} mood',
    'recommendations.noFood': 'No food recommendations available for {mood} mood',
    'recommendations.noStays': 'No stay recommendations available for {mood} mood',
    
    // Music Player
    'music.nowPlaying': 'Now Playing',
    'music.loading': 'Loading...',
    'music.localFile': 'Local File',
    'music.externalLink': 'External Link',
    
    // Food Types
    'food.dessert': 'Dessert',
    'food.healthy': 'Healthy',
    'food.comfort': 'Comfort',
    'food.savory': 'Savory',
    'food.indianCuisine': 'Indian Cuisine',
    
    // Stay Types
    'stay.resort': 'Resort',
    'stay.homestay': 'Homestay',
    'stay.spa': 'Spa',
    'stay.heritage': 'Heritage',
    'stay.hotel': 'Hotel',
    'stay.farmHouse': 'Farm House',
    'stay.houseboat': 'Houseboat',
    'stay.indianExperience': 'Indian Experience',
    
    // Moods
    'mood.happy': 'Happy',
    'mood.sad': 'Sad',
    'mood.calm': 'Calm',
    'mood.cozy': 'Cozy',
    
    // Footer
    'footer.madeWith': 'Made with 🤍 by Santhosh Goleti • Weather-powered recommendations',
    
    // Language Selector
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.telugu': 'తెలుగు'
  },
  hi: {
    // Header
    'welcome': 'स्वागत है',
    'logout': 'लॉगआउट',
    
    // Weather
    'weather.title': 'वर्तमान मौसम',
    'weather.location': 'स्थान',
    'weather.temperature': 'तापमान',
    'weather.condition': 'स्थिति',
    'weather.humidity': 'आर्द्रता',
    'weather.windSpeed': 'हवा की गति',
    
    // Recommendations
    'recommendations.getWeather': 'व्यक्तिगत सुझाव देखने के लिए मौसम डेटा प्राप्त करें!',
    'recommendations.music.title': 'तेलुगु संगीत सुझाव',
    'recommendations.food.title': 'भारतीय खाना सुझाव',
    'recommendations.stays.title': 'भारतीय आवास सुझाव',
    'recommendations.noMusic': '{mood} मूड के लिए कोई संगीत सुझाव उपलब्ध नहीं',
    'recommendations.noFood': '{mood} मूड के लिए कोई खाना सुझाव उपलब्ध नहीं',
    'recommendations.noStays': '{mood} मूड के लिए कोई आवास सुझाव उपलब्ध नहीं',
    
    // Music Player
    'music.nowPlaying': 'अब चल रहा है',
    'music.loading': 'लोड हो रहा है...',
    'music.localFile': 'स्थानीय फ़ाइल',
    'music.externalLink': 'बाहरी लिंक',
    
    // Food Types
    'food.dessert': 'मिठाई',
    'food.healthy': 'स्वस्थ',
    'food.comfort': 'आराम',
    'food.savory': 'नमकीन',
    'food.indianCuisine': 'भारतीय व्यंजन',
    
    // Stay Types
    'stay.resort': 'रिसॉर्ट',
    'stay.homestay': 'होमस्टे',
    'stay.spa': 'स्पा',
    'stay.heritage': 'विरासत',
    'stay.hotel': 'होटल',
    'stay.farmHouse': 'फार्म हाउस',
    'stay.houseboat': 'हाउसबोट',
    'stay.indianExperience': 'भारतीय अनुभव',
    
    // Moods
    'mood.happy': 'खुश',
    'mood.sad': 'उदास',
    'mood.calm': 'शांत',
    'mood.cozy': 'आरामदायक',
    
    // Footer
    'footer.madeWith': 'संतोष गोलेटी द्वारा 🤍 के साथ बनाया गया • मौसम-संचालित सुझाव',
    
    // Language Selector
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.telugu': 'తెలుగు'
  },
  te: {
    // Header
    'welcome': 'స్వాగతం',
    'logout': 'లాగౌట్',
    
    // Weather
    'weather.title': 'ప్రస్తుత వాతావరణం',
    'weather.location': 'స్థానం',
    'weather.temperature': 'ఉష్ణోగ్రత',
    'weather.condition': 'స్థితి',
    'weather.humidity': 'తేమ',
    'weather.windSpeed': 'గాలి వేగం',
    
    // Recommendations
    'recommendations.getWeather': 'వ్యక్తిగత సిఫారసులను చూడటానికి వాతావరణ డేటాను పొందండి!',
    'recommendations.music.title': 'తెలుగు సంగీత సిఫారసులు',
    'recommendations.food.title': 'భారతీయ ఆహార సిఫారసులు',
    'recommendations.stays.title': 'భారతీయ బస సిఫారసులు',
    'recommendations.noMusic': '{mood} మూడ్ కోసం సంగీత సిఫారసులు లేవు',
    'recommendations.noFood': '{mood} మూడ్ కోసం ఆహార సిఫారసులు లేవు',
    'recommendations.noStays': '{mood} మూడ్ కోసం బస సిఫారసులు లేవు',
    
    // Music Player
    'music.nowPlaying': 'ఇప్పుడు ప్లే అవుతోంది',
    'music.loading': 'లోడ్ అవుతోంది...',
    'music.localFile': 'స్థానిక ফైల్',
    'music.externalLink': 'బాహ్య లింక్',
    
    // Food Types
    'food.dessert': 'తీపి',
    'food.healthy': 'ఆరోగ్యకరమైన',
    'food.comfort': 'సౌకర్యం',
    'food.savory': 'కారమైన',
    'food.indianCuisine': 'భారతీయ వంటకాలు',
    
    // Stay Types
    'stay.resort': 'రిసార్ట్',
    'stay.homestay': 'హోమ్‌స్టే',
    'stay.spa': 'స్పా',
    'stay.heritage': 'వారసత్వం',
    'stay.hotel': 'హోటల్',
    'stay.farmHouse': 'ఫార్మ్ హౌస్',
    'stay.houseboat': 'హౌస్‌బోట్',
    'stay.indianExperience': 'భారతీయ అనుభవం',
    
    // Moods
    'mood.happy': 'సంతోషం',
    'mood.sad': 'దుఃఖం',
    'mood.calm': 'ప్రశాంతం',
    'mood.cozy': 'హాయిగా',
    
    // Footer
    'footer.madeWith': 'సంతోష్ గొలేటి చేత 🤍 తో తయారు చేయబడింది • వాతావరణ-శక్తితో సిఫారసులు',
    
    // Language Selector
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.telugu': 'తెలుగు'
  }
};
