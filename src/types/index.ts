
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  language: string;
  createdAt: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface FoodRecommendation {
  name: string;
  description: string;
  type: string;
  image: string;
  mood: string[];
}

export interface MusicRecommendation {
  title: string;
  artist: string;
  genre: string;
  mood: string[];
  spotify_url?: string;
}

export interface StayRecommendation {
  name: string;
  description: string;
  type: string;
  image: string;
  mood: string[];
}

export interface MoodRecommendations {
  mood: string;
  foods: FoodRecommendation[];
  music: MusicRecommendation[];
  stays: StayRecommendation[];
}
