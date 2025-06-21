
import { WeatherData, MoodRecommendations, FoodRecommendation, MusicRecommendation, StayRecommendation } from '../types';

export class RecommendationService {
  private static foodRecommendations: FoodRecommendation[] = [
    // Sunny/Clear weather foods
    { name: "Ice Cream", description: "A sweet, frozen treat", type: "Dessert", image: "🍦", mood: ["happy", "energetic", "relaxed"] },
    { name: "Salad", description: "A refreshing mix of greens", type: "Healthy", image: "🥗", mood: ["happy", "relaxed", "healthy"] },
    { name: "Smoothie", description: "A blended beverage", type: "Healthy", image: "🥤", mood: ["energetic", "healthy", "refreshing"] },

    // Rainy weather foods
    { name: "Hot Soup", description: "A warm and comforting dish", type: "Comfort", image: "🍜", mood: ["cozy", "contemplative", "comforting"] },
    { name: "Hot Chocolate", description: "A sweet, chocolatey beverage", type: "Comfort", image: "☕", mood: ["cozy", "romantic", "comforting"] },
    { name: "Grilled Cheese", description: "A classic comfort food", type: "Comfort", image: "🧀", mood: ["cozy", "comforting", "relaxed"] },

    // Cloudy weather foods
    { name: "Pizza", description: "A savory dish with toppings", type: "Savory", image: "🍕", mood: ["calm", "creative", "inspiring", "social"] },
    { name: "Burger", description: "A classic American dish", type: "Savory", image: "🍔", mood: ["calm", "social", "casual", "comforting"] },
    { name: "Tacos", description: "A Mexican dish with fillings", type: "Savory", image: "🌮", mood: ["calm", "social", "spicy", "adventurous"] },

    // Snowy weather foods
    { name: "Chili", description: "A hearty and spicy stew", type: "Comfort", image: "🌶️", mood: ["adventurous", "cozy", "comforting"] },
    { name: "Stew", description: "A slow-cooked dish with meat and vegetables", type: "Comfort", image: "🍲", mood: ["cozy", "comforting", "warm"] },
    { name: "Apple Pie", description: "A sweet and warm dessert", type: "Dessert", image: "🍎", mood: ["cozy", "comforting", "sweet"] }
  ];

  private static musicRecommendations: MusicRecommendation[] = [
    // Sunny/Clear weather music
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Pop", mood: ["happy", "energetic"] },
    { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", mood: ["happy", "relaxed"] },
    { title: "Lovely Day", artist: "Bill Withers", genre: "Soul", mood: ["happy", "relaxed"] },

    // Rainy weather music
    { title: "Rainy Days and Mondays", artist: "The Carpenters", genre: "Pop", mood: ["sad", "contemplative"] },
    { title: "Riders on the Storm", artist: "The Doors", genre: "Rock", mood: ["sad", "contemplative"] },
    { title: "Have You Ever Seen The Rain?", artist: "Creedence Clearwater Revival", genre: "Rock", mood: ["sad", "contemplative"] },

    // Cloudy weather music
    { title: "Cloudy", artist: "Simon & Garfunkel", genre: "Folk", mood: ["calm", "contemplative"] },
    { title: "A Sky Full of Stars", artist: "Coldplay", genre: "Pop", mood: ["calm", "inspiring"] },
    { title: "Thunder", artist: "Imagine Dragons", genre: "Rock", mood: ["calm", "inspiring"] },

    // Snowy weather music
    { title: "Let It Snow! Let It Snow! Let It Snow!", artist: "Dean Martin", genre: "Jazz", mood: ["cozy", "festive"] },
    { title: "Winter Wonderland", artist: "Ella Fitzgerald", genre: "Jazz", mood: ["cozy", "festive"] },
    { title: "White Christmas", artist: "Bing Crosby", genre: "Pop", mood: ["cozy", "festive"] }
  ];

  private static stayRecommendations: StayRecommendation[] = [
    // Sunny/Clear weather stays
    { name: "Beach Resort", description: "Oceanfront luxury with water sports", type: "Resort", image: "🏖️", mood: ["happy", "energetic", "relaxed"] },
    { name: "Mountain Cabin", description: "Scenic views with hiking trails", type: "Cabin", image: "🏔️", mood: ["happy", "adventurous", "peaceful"] },
    { name: "Garden Villa", description: "Private villa with beautiful gardens", type: "Villa", image: "🌺", mood: ["happy", "romantic", "serene"] },
    
    // Rainy weather stays
    { name: "Cozy Inn", description: "Warm fireplace and hot beverages", type: "Inn", image: "🔥", mood: ["cozy", "contemplative", "romantic"] },
    { name: "Spa Retreat", description: "Indoor wellness and relaxation", type: "Spa", image: "🧘", mood: ["relaxed", "peaceful", "rejuvenating"] },
    { name: "Library Hotel", description: "Book-filled rooms for reading", type: "Hotel", image: "📚", mood: ["contemplative", "cozy", "intellectual"] },
    
    // Cloudy weather stays
    { name: "Art Gallery Hotel", description: "Creative spaces and exhibitions", type: "Boutique", image: "🎨", mood: ["calm", "creative", "inspiring", "cultured"] },
    { name: "City Loft", description: "Modern urban accommodation", type: "Loft", image: "🏙️", mood: ["calm", "sophisticated", "convenient", "trendy"] },
    { name: "Countryside B&B", description: "Peaceful rural experience", type: "B&B", image: "🌾", mood: ["calm", "peaceful", "authentic", "charming"] },
    
    // Snowy weather stays
    { name: "Ski Lodge", description: "Alpine comfort with winter sports", type: "Lodge", image: "⛷️", mood: ["adventurous", "cozy", "festive"] },
    { name: "Ice Hotel", description: "Unique frozen architecture", type: "Specialty", image: "❄️", mood: ["adventurous", "unique", "memorable"] },
    { name: "Thermal Springs Resort", description: "Hot springs in snowy landscape", type: "Resort", image: "♨️", mood: ["relaxed", "rejuvenating", "magical"] }
  ];

  static getRecommendations(weather: WeatherData): MoodRecommendations {
    let mood: string;

    if (weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear')) {
      mood = 'happy';
    } else if (weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('drizzle')) {
      mood = 'sad';
    } else if (weather.condition.toLowerCase().includes('cloud')) {
      mood = 'calm';
    } else if (weather.condition.toLowerCase().includes('snow')) {
      mood = 'cozy';
    } else {
      mood = 'calm'; // Default to calm instead of happy for better fallback
    }

    console.log('Weather condition:', weather.condition);
    console.log('Determined mood:', mood);
    
    // Filter recommendations based on mood
    const foods = this.foodRecommendations.filter(food => 
      food.mood.includes(mood)
    ).slice(0, 3);

    const music = this.musicRecommendations.filter(song => 
      song.mood.includes(mood)
    ).slice(0, 3);

    const stays = this.stayRecommendations.filter(stay => 
      stay.mood.includes(mood)
    ).slice(0, 3);

    console.log('Filtered foods:', foods);
    console.log('Filtered stays:', stays);

    return {
      mood: this.getMoodDisplayName(mood),
      foods,
      music,
      stays
    };
  }

  private static getMoodDisplayName(mood: string): string {
    switch (mood) {
      case 'happy':
        return 'Happy';
      case 'sad':
        return 'Sad';
      case 'calm':
        return 'Calm';
      case 'cozy':
        return 'Cozy';
      default:
        return 'Calm';
    }
  }
}
