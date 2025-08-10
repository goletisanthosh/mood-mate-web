import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// You'll need to set these in your Supabase Edge Functions secrets
const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
const YELP_API_KEY = Deno.env.get('YELP_API_KEY');

interface LocationData {
  latitude: number;
  longitude: number;
}

interface PlacesRequest {
  location: LocationData;
  type: 'hotels' | 'restaurants';
  provider: 'google' | 'yelp';
  radius?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, type, provider, radius = 5000 }: PlacesRequest = await req.json();

    if (!location || !location.latitude || !location.longitude) {
      throw new Error('Location coordinates are required');
    }

    let results = [];

    if (provider === 'google' && GOOGLE_PLACES_API_KEY) {
      results = await fetchGooglePlaces(location, type, radius);
    } else if (provider === 'yelp' && YELP_API_KEY && type === 'restaurants') {
      results = await fetchYelpPlaces(location, radius);
    } else {
      throw new Error('Invalid provider or missing API key');
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in places-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchGooglePlaces(location: LocationData, type: string, radius: number) {
  const placeType = type === 'hotels' ? 'lodging' : 'restaurant';
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${location.latitude},${location.longitude}&` +
    `radius=${radius}&` +
    `type=${placeType}&` +
    `key=${GOOGLE_PLACES_API_KEY}`
  );

  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  return data.results.map((place: any) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity,
    rating: place.rating,
    priceLevel: place.price_level,
    photoUrl: place.photos?.[0] ? 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}` : 
      undefined,
    types: place.types,
    openNow: place.opening_hours?.open_now
  }));
}

async function fetchYelpPlaces(location: LocationData, radius: number) {
  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?` +
    `latitude=${location.latitude}&` +
    `longitude=${location.longitude}&` +
    `radius=${Math.min(radius, 40000)}&` + // Yelp max radius is 40km
    `categories=restaurants,food&` +
    `limit=20`,
    {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Yelp API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.businesses?.map((business: any) => ({
    id: business.id,
    name: business.name,
    address: business.location.display_address.join(', '),
    rating: business.rating,
    priceLevel: business.price?.length || undefined,
    photoUrl: business.image_url,
    distance: business.distance,
    phoneNumber: business.phone,
    website: business.url,
    types: business.categories?.map((cat: any) => cat.alias) || []
  })) || [];
}