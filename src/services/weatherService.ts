
import { WeatherData } from '../types';

// Using OpenWeatherMap API with your provided key
const API_KEY = '716e02c95b29ff76212e39800512e9fa';
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
        console.log('Geolocation not supported, using Hyderabad as default');
        this.getWeatherByCity('Hyderabad').then(resolve).catch(reject);
        return;
      }

      // Clear any existing cache when requesting fresh location
      this.lastKnownLocation = null;
      this.cachedWeather = null;

      const options = {
        enableHighAccuracy: true,
        timeout: 8000, // Reduced timeout to 8 seconds
        maximumAge: 300000 // Allow 5 minute old position
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            this.lastKnownLocation = { lat: latitude, lon: longitude };
            console.log('Got current location:', { latitude, longitude });
            
            const weather = await this.fetchWeather(`lat=${latitude}&lon=${longitude}`);
            this.cacheWeather(weather);
            console.log('Weather data for current location:', weather);
            resolve(weather);
          } catch (error) {
            console.error('Failed to fetch weather with coordinates:', error);
            // Fallback to Hyderabad
            this.getWeatherByCity('Hyderabad').then(resolve).catch(reject);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Location access denied';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          
          console.log(`${errorMessage}. Using Hyderabad as fallback.`);
          this.getWeatherByCity('Hyderabad').then(resolve).catch(reject);
        },
        options
      );
    });
  }

  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const weather = await this.fetchWeather(`q=${encodeURIComponent(city)}`);
      this.cacheWeather(weather);
      return weather;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      
      // Try fallback strategies for rural locations
      const fallbackStrategies = [
        // Try with state/country suffix for Indian locations
        `${city}, India`,
        `${city}, IN`,
        // Try nearby major cities based on common patterns
        ...this.getNearbyMajorCities(city)
      ];

      for (const fallbackLocation of fallbackStrategies) {
        try {
          console.log(`Trying fallback location: ${fallbackLocation}`);
          const fallbackWeather = await this.fetchWeather(`q=${encodeURIComponent(fallbackLocation)}`);
          // Update location to show it's approximate
          fallbackWeather.location = `${city} (nearby: ${fallbackWeather.location})`;
          this.cacheWeather(fallbackWeather);
          return fallbackWeather;
        } catch (fallbackError) {
          console.log(`Fallback ${fallbackLocation} also failed`);
          continue;
        }
      }
      
      throw error;
    }
  }

  private static getNearbyMajorCities(city: string): string[] {
    const cityLower = city.toLowerCase();
    
    // Common rural area mappings to major cities
    const ruralMappings: { [key: string]: string[] } = {
      // Telangana rural areas
      'chennoor': ['Adilabad', 'Mancherial', 'Nirmal'],
      'moinabad': ['Hyderabad', 'Rangareddy', 'Shankarpally'],
      'patancheru': ['Hyderabad', 'Medak'],
      'lingampalli': ['Hyderabad', 'Rangareddy'],
      
      // Andhra Pradesh rural areas  
      'vizag': ['Visakhapatnam', 'Vishakhapatnam'],
      'darsi': ['Prakasam', 'Ongole'],
      
      // Add more mappings as needed
    };

    return ruralMappings[cityLower] || [];
  }

  private static cacheWeather(weather: WeatherData) {
    this.cachedWeather = weather;
    this.cacheTimestamp = Date.now();
  }

  private static async fetchWeather(params: string): Promise<WeatherData> {
    const response = await fetch(`${BASE_URL}?${params}&appid=${API_KEY}&units=metric`);
    
    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
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
}
