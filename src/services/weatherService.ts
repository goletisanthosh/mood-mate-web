
import { WeatherData } from '../types';

// Using OpenWeatherMap API (free tier)
const API_KEY = 'demo_key'; // Users will need to get their own key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherService {
  private static lastKnownLocation: { lat: number; lon: number } | null = null;
  private static cachedWeather: WeatherData | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getWeatherByLocation(): Promise<WeatherData> {
    // Check if we have cached weather data that's still valid
    const now = Date.now();
    if (this.cachedWeather && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log('Using cached weather data');
      return this.cachedWeather;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported, using demo data');
        const weather = this.getDemoWeather();
        this.cacheWeather(weather);
        resolve(weather);
        return;
      }

      // If we have a last known location, use it instead of requesting again
      if (this.lastKnownLocation) {
        console.log('Using last known location');
        this.fetchWeather(`lat=${this.lastKnownLocation.lat}&lon=${this.lastKnownLocation.lon}`)
          .then(weather => {
            this.cacheWeather(weather);
            resolve(weather);
          })
          .catch(() => {
            const weather = this.getDemoWeather();
            this.cacheWeather(weather);
            resolve(weather);
          });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            this.lastKnownLocation = { lat: latitude, lon: longitude };
            console.log('Got new location:', this.lastKnownLocation);
            
            const weather = await this.fetchWeather(`lat=${latitude}&lon=${longitude}`);
            this.cacheWeather(weather);
            resolve(weather);
          } catch (error) {
            console.log('API failed, using demo data');
            const weather = this.getDemoWeather();
            this.cacheWeather(weather);
            resolve(weather);
          }
        },
        (error) => {
          console.log('Geolocation failed:', error.message, 'using demo data');
          const weather = this.getDemoWeather();
          this.cacheWeather(weather);
          resolve(weather);
        }
      );
    });
  }

  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const weather = await this.fetchWeather(`q=${encodeURIComponent(city)}`);
      this.cacheWeather(weather);
      return weather;
    } catch (error) {
      // Fallback to demo data
      const weather = this.getDemoWeather(city);
      this.cacheWeather(weather);
      return weather;
    }
  }

  private static cacheWeather(weather: WeatherData) {
    this.cachedWeather = weather;
    this.cacheTimestamp = Date.now();
  }

  private static async fetchWeather(params: string): Promise<WeatherData> {
    const response = await fetch(`${BASE_URL}?${params}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon
    };
  }

  private static getDemoWeather(city: string = 'Demo Location'): WeatherData {
    // Use consistent demo weather data instead of random
    console.log('Using consistent demo weather data');
    
    return {
      location: city,
      temperature: 22,
      condition: 'cloudy', // This will give us "calm" mood with proper recommendations
      description: 'partly cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: '02d'
    };
  }
}
