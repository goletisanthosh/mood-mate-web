
import { supabase } from '../integrations/supabase/client';
import { WeatherData, MoodRecommendations } from '../types';

export class AIRecommendationService {
  static async getAIRecommendations(weather: WeatherData, mood: string): Promise<MoodRecommendations> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Calling AI recommendations service...');
      
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          weather,
          mood,
          userId: user.id
        }
      });

      if (error) {
        console.error('AI Recommendations error:', error);
        throw error;
      }

      console.log('AI Recommendations received:', data);
      return data;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }

  static async triggerImprovementAnalysis(): Promise<any> {
    try {
      console.log('Triggering AI improvement analysis...');
      
      const { data, error } = await supabase.functions.invoke('ai-improvements');

      if (error) {
        console.error('AI Improvements error:', error);
        throw error;
      }

      console.log('AI Improvements completed:', data);
      return data;
    } catch (error) {
      console.error('Error triggering improvements:', error);
      throw error;
    }
  }

  static async submitFeedback(recommendationId: string, rating: number, wasHelpful: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('recommendation_history')
        .update({
          user_feedback: rating,
          was_helpful: wasHelpful
        })
        .eq('id', recommendationId);

      if (error) throw error;
      
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  static async getAIImprovements(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_improvements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting AI improvements:', error);
      return [];
    }
  }
}
