import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  photoUrl?: string;
  distance?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  types: string[];
  openNow?: boolean;
}

export class PlacesService {
  // Get nearby hotels and accommodations using our Edge Function
  static async getNearbyHotels(location: LocationData, radius: number = 5000): Promise<PlaceResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('places-search', {
        body: {
          location,
          type: 'hotels',
          provider: 'google',
          radius
        }
      });

      if (error) throw error;
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching nearby hotels:', error);
      
      // Fallback to mock data for demonstration
      return this.getMockHotels(location);
    }
  }

  // Get nearby restaurants and food options using our Edge Function
  static async getNearbyRestaurants(location: LocationData, radius: number = 2000): Promise<PlaceResult[]> {
    try {
      const { data, error } = await supabase.functions.invoke('places-search', {
        body: {
          location,
          type: 'restaurants',
          provider: 'google',
          radius
        }
      });

      if (error) throw error;
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching nearby restaurants:', error);
      
      // Try Yelp as fallback
      try {
        const { data: yelpData, error: yelpError } = await supabase.functions.invoke('places-search', {
          body: {
            location,
            type: 'restaurants',
            provider: 'yelp',
            radius
          }
        });

        if (yelpError) throw yelpError;
        return yelpData?.results || [];
      } catch (yelpError) {
        console.error('Yelp fallback also failed:', yelpError);
        
        // Final fallback to mock data
        return this.getMockRestaurants(location);
      }
    }
  }

  // Mock data for demonstration when APIs are not available
  private static getMockHotels(location: LocationData): PlaceResult[] {
    return [
      {
        id: 'mock-hotel-1',
        name: 'Grand Palace Hotel',
        address: 'Near your location',
        rating: 4.5,
        priceLevel: 3,
        types: ['lodging', 'hotel'],
        openNow: true
      },
      {
        id: 'mock-hotel-2',
        name: 'Comfort Inn & Suites',
        address: '2.5 km from your location',
        rating: 4.2,
        priceLevel: 2,
        types: ['lodging', 'hotel'],
        openNow: true
      },
      {
        id: 'mock-hotel-3',
        name: 'Luxury Resort & Spa',
        address: '5 km from your location',
        rating: 4.8,
        priceLevel: 4,
        types: ['lodging', 'resort'],
        openNow: true
      }
    ];
  }

  private static getMockRestaurants(location: LocationData): PlaceResult[] {
    return [
      {
        id: 'mock-restaurant-1',
        name: 'Spice Garden Restaurant',
        address: '500m from your location',
        rating: 4.3,
        priceLevel: 2,
        types: ['restaurant', 'indian_cuisine'],
        openNow: true,
        phoneNumber: '+91-9876543210'
      },
      {
        id: 'mock-restaurant-2',
        name: 'Pizza Corner',
        address: '800m from your location',
        rating: 4.1,
        priceLevel: 2,
        types: ['restaurant', 'pizza'],
        openNow: true,
        phoneNumber: '+91-9876543211'
      },
      {
        id: 'mock-restaurant-3',
        name: 'Royal Biryani House',
        address: '1.2 km from your location',
        rating: 4.6,
        priceLevel: 3,
        types: ['restaurant', 'biryani'],
        openNow: true,
        phoneNumber: '+91-9876543212'
      }
    ];
  }
}