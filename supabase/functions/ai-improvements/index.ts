
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
    console.log('Analyzing user data for improvements...');
    
    // Get recommendation history and user feedback
    const { data: recommendations } = await supabase
      .from('recommendation_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: weatherHistory } = await supabase
      .from('location_weather_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    // Analyze patterns with AI
    const analysisPrompt = `
    Analyze the following user data and provide improvement suggestions for a weather-mood recommendation system:
    
    Recommendation History: ${JSON.stringify(recommendations?.slice(0, 20) || [])}
    Weather History: ${JSON.stringify(weatherHistory?.slice(0, 20) || [])}
    
    Please analyze patterns and suggest improvements in these categories:
    1. Food recommendations that could be added
    2. Music recommendations that could be enhanced
    3. Stay recommendations that could be improved
    4. General mood-weather correlations that could be refined
    
    Return ONLY valid JSON with this structure:
    {
      "foodSuggestions": [
        {
          "suggestion": "Specific food recommendation to add",
          "reasoning": "Why this would improve the system",
          "targetMood": "mood",
          "targetWeather": "weather condition"
        }
      ],
      "musicSuggestions": [
        {
          "suggestion": "Specific music recommendation to add",
          "reasoning": "Why this would enhance the system",
          "targetMood": "mood",
          "targetWeather": "weather condition"
        }
      ],
      "staySuggestions": [
        {
          "suggestion": "Specific stay recommendation to add",
          "reasoning": "Why this would improve the system",
          "targetMood": "mood",
          "targetWeather": "weather condition"
        }
      ],
      "generalImprovements": [
        {
          "suggestion": "General system improvement",
          "reasoning": "Why this would enhance user experience",
          "priority": "high/medium/low"
        }
      ]
    }
    
    Focus on Indian context and preferences.
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
            content: 'You are an AI system analyst. Return only valid JSON, no additional text.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    const aiData = await response.json();
    const improvements = JSON.parse(aiData.choices[0].message.content);
    
    console.log('AI Generated Improvements:', improvements);

    // Store improvement suggestions
    const improvementPromises = [
      ...improvements.foodSuggestions.map((suggestion: any) =>
        supabase.from('ai_improvements').insert({
          improvement_type: 'food',
          suggestion: suggestion.suggestion,
          data_analysis: {
            reasoning: suggestion.reasoning,
            targetMood: suggestion.targetMood,
            targetWeather: suggestion.targetWeather
          }
        })
      ),
      ...improvements.musicSuggestions.map((suggestion: any) =>
        supabase.from('ai_improvements').insert({
          improvement_type: 'music',
          suggestion: suggestion.suggestion,
          data_analysis: {
            reasoning: suggestion.reasoning,
            targetMood: suggestion.targetMood,
            targetWeather: suggestion.targetWeather
          }
        })
      ),
      ...improvements.staySuggestions.map((suggestion: any) =>
        supabase.from('ai_improvements').insert({
          improvement_type: 'stay',
          suggestion: suggestion.suggestion,
          data_analysis: {
            reasoning: suggestion.reasoning,
            targetMood: suggestion.targetMood,
            targetWeather: suggestion.targetWeather
          }
        })
      ),
      ...improvements.generalImprovements.map((suggestion: any) =>
        supabase.from('ai_improvements').insert({
          improvement_type: 'general',
          suggestion: suggestion.suggestion,
          data_analysis: {
            reasoning: suggestion.reasoning,
            priority: suggestion.priority
          }
        })
      )
    ];

    await Promise.all(improvementPromises);

    return new Response(JSON.stringify({
      success: true,
      message: 'AI improvements analyzed and stored',
      improvements: improvements
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI improvements:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
