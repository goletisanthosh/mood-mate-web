
import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { User } from '../types';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = AuthService.login(formData.email, formData.password);
        if (result.success && result.user) {
          onAuthSuccess(result.user);
        } else {
          setError(result.message);
        }
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = AuthService.register({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          language: formData.language
        });

        if (result.success && result.user) {
          onAuthSuccess(result.user);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md slide-up">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌤️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Mood Mate</h1>
          <p className="text-white/80">Weather-based mood recommendations</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg transition-all duration-300 ${
              isLogin ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg transition-all duration-300 ${
              !isLogin ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              >
                <option value="en" className="bg-gray-800">English</option>
                <option value="hi" className="bg-gray-800">हिंदी (Hindi)</option>
                <option value="bn" className="bg-gray-800">বাংলা (Bengali)</option>
                <option value="te" className="bg-gray-800">తెలుగు (Telugu)</option>
                <option value="mr" className="bg-gray-800">मराठी (Marathi)</option>
                <option value="ta" className="bg-gray-800">தமிழ் (Tamil)</option>
                <option value="gu" className="bg-gray-800">ગુજરાતી (Gujarati)</option>
                <option value="kn" className="bg-gray-800">ಕನ್ನಡ (Kannada)</option>
                <option value="ml" className="bg-gray-800">മലയാളം (Malayalam)</option>
                <option value="pa" className="bg-gray-800">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="or" className="bg-gray-800">ଓଡ଼ିଆ (Odia)</option>
                <option value="as" className="bg-gray-800">অসমীয়া (Assamese)</option>
                <option value="es" className="bg-gray-800">Español</option>
                <option value="fr" className="bg-gray-800">Français</option>
                <option value="de" className="bg-gray-800">Deutsch</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            />
          )}

          {error && (
            <div className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              isLogin ? 'Login' : 'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
