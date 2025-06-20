
import { WeatherData } from '../types';

// Using OpenWeatherMap API (free tier)
const API_KEY = 'demo_key'; // Users will need to get their own key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherService {
  static async getWeatherByLocation(): Promise<WeatherData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weather = await this.fetchWeather(`lat=${latitude}&lon=${longitude}`);
            resolve(weather);
          } catch (error) {
            // Fallback to demo data if API fails
            resolve(this.getDemoWeather());
          }
        },
        () => {
          // Fallback to demo data if geolocation fails
          resolve(this.getDemoWeather());
        }
      );
    });
  }

  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      return await this.fetchWeather(`q=${encodeURIComponent(city)}`);
    } catch (error) {
      // Fallback to demo data
      return this.getDemoWeather(city);
    }
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

  private static getDemoWeather(city: string = 'Your Location'): WeatherData {
    // Demo weather data for development
    const conditions = ['sunny', 'cloudy', 'rainy', 'clear'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location: city,
      temperature: Math.floor(Math.random() * 30) + 5,
      condition: randomCondition,
      description: `${randomCondition} weather`,
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      icon: '01d'
    };
  }
}
