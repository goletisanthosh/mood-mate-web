import { useState, useEffect, useCallback } from 'react';
import { PlacesService } from '../services/placesService';

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
}

export const useLocationPlaces = (location: LocationData | null) => {
  const [hotels, setHotels] = useState<PlaceResult[]>([]);
  const [restaurants, setRestaurants] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchPlaces = useCallback(async () => {
    if (!location) return;

    setLoading(true);
    setError('');

    try {
      console.log('Fetching places for location:', location);
      
      // Fetch hotels and restaurants simultaneously
      const [hotelsData, restaurantsData] = await Promise.all([
        PlacesService.getNearbyHotels(location, 5000), // 5km radius for hotels
        PlacesService.getNearbyRestaurants(location, 2000) // 2km radius for restaurants
      ]);

      setHotels(hotelsData);
      setRestaurants(restaurantsData);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to fetch nearby places. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Auto-fetch when location changes
  useEffect(() => {
    if (location) {
      fetchPlaces();
    }
  }, [location, fetchPlaces]);

  // Real-time updates: refetch every 5 minutes if location hasn't changed
  useEffect(() => {
    if (!location) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing places data...');
      fetchPlaces();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [location, fetchPlaces]);

  return {
    hotels,
    restaurants,
    loading,
    error,
    refetch: fetchPlaces
  };
};