
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { weather, mood, userId } = await req.json();
    
    console.log('AI Recommendations request:', { weather, mood, userId });
    
    // Get user's recommendation history and preferences
    const { data: userHistory } = await supabase
      .from('recommendation_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Analyze patterns and generate AI recommendations
    const aiPrompt = `
    You are an expert recommendation system for food, music, and stays based on weather and mood.
    
    Current Context:
    - Location: ${weather.location}
    - Weather: ${weather.condition}, ${weather.temperature}°C
    - User Mood: ${mood}
    - Description: ${weather.description}
    
    User Profile: ${JSON.stringify(userProfile || {})}
    Recent History: ${JSON.stringify(userHistory || [])}
    
    Based on the weather, mood, location (Indian context), and user's history, generate personalized recommendations.
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "foods": [
        {
          "name": "Food Name",
          "description": "Brief description",
          "type": "Comfort/Healthy/Savory/Dessert",
          "image": "emoji",
          "aiReasoning": "Why this fits the user's context"
        }
      ],
      "music": [
        {
          "title": "Song Title",
          "artist": "Artist Name",
          "genre": "Genre",
          "spotify_url": "https://open.spotify.com/track/example",
          "aiReasoning": "Why this matches the mood and weather"
        }
      ],
      "stays": [
        {
          "name": "Stay Name",
          "description": "Brief description",
          "type": "Resort/Hotel/Homestay/Heritage",
          "image": "emoji",
          "aiReasoning": "Why this suits the current conditions"
        }
      ],
      "insights": "Brief explanation of the recommendation strategy"
    }
    
    Focus on Indian cuisine, Telugu/Indian music, and Indian hospitality options. Make it personalized based on their history.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recommendation system. Always return valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const aiData = await response.json();
    const recommendations = JSON.parse(aiData.choices[0].message.content);
    
    console.log('AI Generated Recommendations:', recommendations);

    // Store recommendations in history
    const recommendationPromises = [
      ...recommendations.foods.map((food: any) => 
        supabase.from('recommendation_history').insert({
          user_id: userId,
          location: weather.location,
          weather_condition: weather.condition,
          mood: mood,
          recommendation_type: 'food',
          recommendation_data: food
        })
      ),
      ...recommendations.music.map((music: any) => 
        supabase.from('recommendation_history').insert({
          user_id: userId,
          location: weather.location,
          weather_condition: weather.condition,
          mood: mood,
          recommendation_type: 'music',
          recommendation_data: music
        })
      ),
      ...recommendations.stays.map((stay: any) => 
        supabase.from('recommendation_history').insert({
          user_id: userId,
          location: weather.location,
          weather_condition: weather.condition,
          mood: mood,
          recommendation_type: 'stay',
          recommendation_data: stay
        })
      )
    ];

    await Promise.all(recommendationPromises);

    // Store weather/location history
    await supabase.from('location_weather_history').insert({
      user_id: userId,
      location: weather.location,
      weather_condition: weather.condition,
      temperature: weather.temperature,
      mood_selected: mood
    });

    return new Response(JSON.stringify({
      mood: mood,
      foods: recommendations.foods,
      music: recommendations.music,
      stays: recommendations.stays,
      insights: recommendations.insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
