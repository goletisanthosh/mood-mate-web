
import { WeatherData, MoodRecommendations, FoodRecommendation, MusicRecommendation } from '../types';

export class RecommendationService {
  private static foodRecommendations: Record<string, FoodRecommendation[]> = {
    sunny: [
      { name: 'Fresh Fruit Salad', description: 'Light and refreshing mixed fruits', type: 'Healthy', image: '🥗', mood: ['energetic', 'happy'] },
      { name: 'Iced Coffee', description: 'Cool and refreshing caffeine boost', type: 'Beverage', image: '☕', mood: ['energetic'] },
      { name: 'Grilled Vegetables', description: 'Light BBQ veggies perfect for sunny days', type: 'Light Meal', image: '🥕', mood: ['happy', 'healthy'] }
    ],
    cloudy: [
      { name: 'Warm Soup', description: 'Comforting bowl of seasonal soup', type: 'Comfort Food', image: '🍲', mood: ['cozy', 'contemplative'] },
      { name: 'Hot Tea', description: 'Soothing herbal or green tea', type: 'Beverage', image: '🍵', mood: ['calm', 'relaxed'] },
      { name: 'Pasta', description: 'Hearty pasta with your favorite sauce', type: 'Comfort Food', image: '🍝', mood: ['cozy', 'satisfied'] }
    ],
    rainy: [
      { name: 'Hot Chocolate', description: 'Rich and warming chocolate beverage', type: 'Beverage', image: '☕', mood: ['cozy', 'nostalgic'] },
      { name: 'Stew', description: 'Hearty meat and vegetable stew', type: 'Comfort Food', image: '🍲', mood: ['warm', 'satisfied'] },
      { name: 'Fresh Bread', description: 'Warm, crusty bread with butter', type: 'Comfort Food', image: '🍞', mood: ['cozy', 'comforted'] }
    ],
    snowy: [
      { name: 'Mulled Wine', description: 'Warm spiced wine perfect for cold days', type: 'Beverage', image: '🍷', mood: ['warm', 'festive'] },
      { name: 'Hot Pot', description: 'Communal cooking in a warm broth', type: 'Social Meal', image: '🍲', mood: ['social', 'warm'] },
      { name: 'Cookies', description: 'Fresh baked cookies with milk', type: 'Dessert', image: '🍪', mood: ['nostalgic', 'sweet'] }
    ]
  };

  private static musicRecommendations: Record<string, MusicRecommendation[]> = {
    sunny: [
      { title: 'Walking on Sunshine', artist: 'Katrina and the Waves', genre: 'Pop', mood: ['upbeat', 'happy'] },
      { title: 'Good Vibrations', artist: 'The Beach Boys', genre: 'Rock', mood: ['positive', 'energetic'] },
      { title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Rock', mood: ['optimistic', 'peaceful'] }
    ],
    cloudy: [
      { title: 'Cloudy', artist: 'Simon & Garfunkel', genre: 'Folk', mood: ['contemplative', 'mellow'] },
      { title: 'Mad World', artist: 'Gary Jules', genre: 'Alternative', mood: ['introspective', 'melancholic'] },
      { title: 'Breathe Me', artist: 'Sia', genre: 'Alternative', mood: ['reflective', 'emotional'] }
    ],
    rainy: [
      { title: 'Raindrops Keep Fallin\'', artist: 'B.J. Thomas', genre: 'Pop', mood: ['nostalgic', 'peaceful'] },
      { title: 'Purple Rain', artist: 'Prince', genre: 'Rock', mood: ['emotional', 'powerful'] },
      { title: 'November Rain', artist: 'Guns N\' Roses', genre: 'Rock', mood: ['dramatic', 'passionate'] }
    ],
    snowy: [
      { title: 'Winter Wonderland', artist: 'Various Artists', genre: 'Holiday', mood: ['festive', 'cozy'] },
      { title: 'Let It Snow', artist: 'Frank Sinatra', genre: 'Jazz', mood: ['romantic', 'warm'] },
      { title: 'Frozen', artist: 'Madonna', genre: 'Pop', mood: ['introspective', 'cool'] }
    ]
  };

  static getRecommendations(weather: WeatherData): MoodRecommendations {
    const condition = weather.condition.toLowerCase();
    let mood = this.getMoodFromWeather(weather);
    
    // Get recommendations based on weather condition
    const foods = this.foodRecommendations[condition] || this.foodRecommendations.sunny;
    const music = this.musicRecommendations[condition] || this.musicRecommendations.sunny;

    return {
      mood,
      foods,
      music
    };
  }

  private static getMoodFromWeather(weather: WeatherData): string {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();

    if (condition.includes('sun') || condition.includes('clear')) {
      return temp > 25 ? 'Energetic & Happy' : 'Bright & Optimistic';
    } else if (condition.includes('rain') || condition.includes('storm')) {
      return 'Cozy & Contemplative';
    } else if (condition.includes('snow')) {
      return 'Peaceful & Festive';
    } else if (condition.includes('cloud')) {
      return 'Calm & Reflective';
    }

    return 'Balanced & Content';
  }
}
