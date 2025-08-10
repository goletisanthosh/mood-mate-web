import { WeatherData, MoodRecommendations, FoodRecommendation, MusicRecommendation, StayRecommendation } from '../types';
import { AIRecommendationService } from './aiRecommendationService';

export class RecommendationService {
  private static foodRecommendations: FoodRecommendation[] = [
    // Sunny/Clear weather foods - Indian options
    { name: "Kulfi", description: "Traditional Indian frozen dessert", type: "Dessert", image: "🍦", mood: ["happy", "energetic", "relaxed"] },
    { name: "Fruit Chaat", description: "Spicy mixed fruit salad", type: "Healthy", image: "🥗", mood: ["happy", "relaxed", "healthy"] },
    { name: "Lassi", description: "Refreshing yogurt-based drink", type: "Healthy", image: "🥤", mood: ["happy", "healthy", "refreshing"] },
    { name: "Mango Ice Cream", description: "Creamy mango flavored ice cream", type: "Dessert", image: "🥭", mood: ["happy", "energetic", "relaxed"] },
    { name: "Coconut Water", description: "Fresh coconut water", type: "Healthy", image: "🥥", mood: ["happy", "refreshing", "healthy"] },

    // Rainy weather foods - Indian comfort foods
    { name: "Masala Chai", description: "Spiced Indian tea", type: "Comfort", image: "☕", mood: ["cozy", "contemplative", "comforting", "sad"] },
    { name: "Pakoras", description: "Crispy fried fritters", type: "Comfort", image: "🥟", mood: ["cozy", "romantic", "comforting", "sad"] },
    { name: "Khichdi", description: "Comforting rice and lentil dish", type: "Comfort", image: "🍚", mood: ["cozy", "comforting", "relaxed", "sad"] },
    { name: "Hot Soup", description: "Warm vegetable soup", type: "Comfort", image: "🍲", mood: ["cozy", "comforting", "sad"] },
    { name: "Maggi Noodles", description: "Instant comfort noodles", type: "Comfort", image: "🍜", mood: ["cozy", "comforting", "sad"] },

    // Cloudy weather foods - Indian savory items
    { name: "Samosa", description: "Crispy triangular pastry with filling", type: "Savory", image: "🥟", mood: ["calm", "creative", "inspiring", "social"] },
    { name: "Chai & Biscuits", description: "Tea with Indian cookies", type: "Savory", image: "🍪", mood: ["calm", "social", "casual", "comforting"] },
    { name: "Dosa", description: "South Indian crepe with chutney", type: "Savory", image: "🥞", mood: ["calm", "social", "spicy", "adventurous"] },
    { name: "Biryani", description: "Aromatic rice dish with spices", type: "Comfort", image: "🍚", mood: ["calm", "comforting", "satisfying"] },
    { name: "Pani Puri", description: "Crispy water-filled snacks", type: "Savory", image: "🥙", mood: ["calm", "social", "fun"] },

    // Snowy weather foods - Indian winter foods
    { name: "Carrot Halwa", description: "Sweet carrot dessert", type: "Comfort", image: "🥕", mood: ["adventurous", "cozy", "comforting"] },
    { name: "Rajma Chawal", description: "Kidney beans with rice", type: "Comfort", image: "🍛", mood: ["cozy", "comforting", "warm"] },
    { name: "Gulab Jamun", description: "Sweet milk dumplings in syrup", type: "Dessert", image: "🍯", mood: ["cozy", "comforting", "sweet"] },
    { name: "Jalebi", description: "Crispy sweet spirals", type: "Dessert", image: "🍥", mood: ["cozy", "festive", "sweet"] }
  ];

  private static musicRecommendations: MusicRecommendation[] = [
    // Sunny/Clear weather music - Telugu & Indian
    { title: "Butta Bomma", artist: "Armaan Malik", genre: "Telugu Pop", mood: ["happy", "energetic"], spotify_url: "https://open.spotify.com/track/example1" },
    { title: "Inkem Inkem", artist: "Sid Sriram", genre: "Telugu Melody", mood: ["happy", "relaxed"], spotify_url: "https://open.spotify.com/track/example2" },
    { title: "Samajavaragamana", artist: "Sid Sriram", genre: "Telugu Classical", mood: ["happy", "relaxed"], spotify_url: "https://open.spotify.com/track/example3" },
    { title: "Ramuloo Ramulaa", artist: "Anurag Kulkarni", genre: "Telugu Folk", mood: ["happy", "energetic"], spotify_url: "/music/song1.mp3" },
    { title: "Uppena", artist: "Javed Ali", genre: "Telugu Melody", mood: ["happy", "romantic"], spotify_url: "https://open.spotify.com/track/example13" },

    // Rainy weather music - Telugu emotional
    { title: "Vachinde", artist: "Madhu Priya", genre: "Telugu Folk", mood: ["sad", "contemplative"], spotify_url: "https://open.spotify.com/track/example4" },
    { title: "Maate Vinadhuga", artist: "Sid Sriram", genre: "Telugu Melody", mood: ["sad", "contemplative"], spotify_url: "https://open.spotify.com/track/example5" },
    { title: "Kannu Kottina", artist: "Various Artists", genre: "Telugu Classical", mood: ["sad", "contemplative"], spotify_url: "https://open.spotify.com/track/example6" },
    { title: "Nuvvostanante", artist: "Udit Narayan", genre: "Telugu Melody", mood: ["sad", "romantic"], spotify_url: "https://open.spotify.com/track/example14" },

    // Cloudy weather music - Telugu calm
    { title: "Neevey Neevey", artist: "GV Prakash", genre: "Telugu Feel Good", mood: ["calm", "contemplative"], spotify_url: "/music/song1.mp3" },
    { title: "Kadalalle", artist: "Haricharan", genre: "Telugu Melody", mood: ["calm", "inspiring"], spotify_url: "/music/kadalalle.mp3" },
    { title: "Evare", artist: "K.J. Yesudas", genre: "Telugu Melody", mood: ["calm", "inspiring"], spotify_url: "/music/evare.mp3" },
    { title: "Manasu Maree", artist: "Shreya Ghoshal", genre: "Telugu Classical", mood: ["calm", "peaceful"], spotify_url: "https://open.spotify.com/track/example15" },

    // Snowy weather music - Telugu festive
    { title: "Dandaalayyaa", artist: "Dhanunjay", genre: "Telugu Folk", mood: ["cozy", "festive"], spotify_url: "https://open.spotify.com/track/example10" },
    { title: "Magajaathi", artist: "Yazin Nizar", genre: "Telugu Pop", mood: ["cozy", "festive"], spotify_url: "https://open.spotify.com/track/example11" },
    { title: "Pacha Bottesina", artist: "Javed Ali", genre: "Telugu Melody", mood: ["cozy", "festive"], spotify_url: "https://open.spotify.com/track/example12" },
    { title: "Sankranti", artist: "Various Artists", genre: "Telugu Folk", mood: ["cozy", "festive"], spotify_url: "https://open.spotify.com/track/example16" }
  ];

  private static stayRecommendations: StayRecommendation[] = [
    // Sunny/Clear weather stays - Indian locations
    { name: "Beach Resort", description: "Beachfront stay with water sports", type: "Resort", image: "🏖️", mood: ["happy", "energetic", "relaxed"] },
    { name: "Himalayan Retreat", description: "Mountain stay with trekking", type: "Resort", image: "🏔️", mood: ["happy", "adventurous", "peaceful"] },
    { name: "Kerala Backwaters", description: "Houseboat stay in serene waters", type: "Houseboat", image: "🛥️", mood: ["happy", "romantic", "serene"] },
    { name: "Goa Villa", description: "Beachside villa with pool", type: "Resort", image: "🏖️", mood: ["happy", "energetic", "relaxed"] },
    { name: "Rajasthan Palace", description: "Royal heritage hotel", type: "Heritage", image: "🏰", mood: ["happy", "luxurious", "cultural"] },
    
    // Rainy weather stays - Indian cozy options
    { name: "Coffee Estate", description: "Stay amidst coffee plantations", type: "Homestay", image: "☕", mood: ["cozy", "contemplative", "romantic", "sad"] },
    { name: "Ayurvedic Spa Resort", description: "Traditional wellness retreat", type: "Spa", image: "🧘", mood: ["relaxed", "peaceful", "rejuvenating", "sad"] },
    { name: "Heritage Haveli", description: "Traditional Indian palace hotel", type: "Heritage", image: "🏰", mood: ["contemplative", "cozy", "cultural", "sad"] },
    { name: "Hill Station Cottage", description: "Cozy mountain cottage", type: "Homestay", image: "🏔️", mood: ["cozy", "romantic", "peaceful", "sad"] },
    
    // Cloudy weather stays - Indian cultural
    { name: "Hotel O GS Lodge", description: "Royal experience in low price", type: "Hotel", image: "🏛️", mood: ["calm", "creative", "inspiring", "cultured"] },
    { name: "ABK Family Farm House", description: "Modern stay in bustling city", type: "Farm House", image: "🏙️", mood: ["calm", "sophisticated", "convenient", "trendy"] },
    { name: "High Rise Hotel", description: "Stay near ancient temples", type: "Hotel", image: "🕉️", mood: ["calm", "peaceful", "spiritual", "authentic"] },
    { name: "Cultural Center", description: "Art and culture focused stay", type: "Heritage", image: "🎨", mood: ["calm", "creative", "inspiring"] },
    
    // Snowy weather stays - Indian hill stations
    { name: "Snow Resort", description: "Alpine comfort with snow activities", type: "Resort", image: "⛷️", mood: ["adventurous", "cozy", "festive"] },
    { name: "Heritage Hotel", description: "Colonial charm in hill station", type: "Heritage", image: "🏔️", mood: ["adventurous", "nostalgic", "cozy"] },
    { name: "Houseboat", description: "Floating stay on Dal Lake", type: "Houseboat", image: "🛥️", mood: ["relaxed", "unique", "magical"] },
    { name: "Mountain Lodge", description: "Rustic mountain accommodation", type: "Resort", image: "🏔️", mood: ["adventurous", "cozy", "natural"] }
  ];

  static async getRecommendations(weather: WeatherData): Promise<MoodRecommendations> {
    const mood = this.getMoodFromWeather(weather);
    
    try {
      // Try to get AI-powered recommendations first
      console.log('Attempting to get AI recommendations...');
      const aiRecommendations = await AIRecommendationService.getAIRecommendations(weather, mood);
      console.log('AI recommendations successful:', aiRecommendations);
      return aiRecommendations;
    } catch (error) {
      console.error('AI recommendations failed, falling back to static recommendations:', error);
      // Fallback to static recommendations if AI fails
      return this.getRecommendationsByMood(mood);
    }
  }

  static async getRecommendationsByWeatherAndMood(weather: WeatherData, mood: string): Promise<MoodRecommendations> {
    try {
      // Try to get AI-powered recommendations with specific mood
      console.log('Attempting to get AI recommendations for mood:', mood);
      const aiRecommendations = await AIRecommendationService.getAIRecommendations(weather, mood);
      console.log('AI recommendations successful for mood:', aiRecommendations);
      return aiRecommendations;
    } catch (error) {
      console.error('AI recommendations failed, falling back to static mood-based recommendations:', error);
      // Fallback to static recommendations based on mood
      return this.getRecommendationsByMood(mood);
    }
  }

  static getMoodFromWeather(weather: WeatherData): string {
    if (weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear')) {
      return 'happy';
    } else if (weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('drizzle')) {
      return 'sad';
    } else if (weather.condition.toLowerCase().includes('cloud')) {
      return 'calm';
    } else if (weather.condition.toLowerCase().includes('snow')) {
      return 'cozy';
    } else {
      return 'calm';
    }
  }

  static getRecommendationsByMood(mood: string): MoodRecommendations {
    console.log('Getting recommendations for mood:', mood);
    
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
    console.log('Filtered music:', music);
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
