export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_improvements: {
        Row: {
          created_at: string | null
          data_analysis: Json | null
          id: string
          improvement_type: string
          status: string | null
          suggestion: string
        }
        Insert: {
          created_at?: string | null
          data_analysis?: Json | null
          id?: string
          improvement_type: string
          status?: string | null
          suggestion: string
        }
        Update: {
          created_at?: string | null
          data_analysis?: Json | null
          id?: string
          improvement_type?: string
          status?: string | null
          suggestion?: string
        }
        Relationships: []
      }
      location_weather_history: {
        Row: {
          id: string
          location: string
          mood_selected: string | null
          temperature: number
          timestamp: string | null
          user_id: string | null
          weather_condition: string
        }
        Insert: {
          id?: string
          location: string
          mood_selected?: string | null
          temperature: number
          timestamp?: string | null
          user_id?: string | null
          weather_condition: string
        }
        Update: {
          id?: string
          location?: string
          mood_selected?: string | null
          temperature?: number
          timestamp?: string | null
          user_id?: string | null
          weather_condition?: string
        }
        Relationships: []
      }
      recommendation_history: {
        Row: {
          created_at: string | null
          id: string
          location: string
          mood: string
          recommendation_data: Json
          recommendation_type: string
          user_feedback: number | null
          user_id: string | null
          was_helpful: boolean | null
          weather_condition: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          mood: string
          recommendation_data: Json
          recommendation_type: string
          user_feedback?: number | null
          user_id?: string | null
          was_helpful?: boolean | null
          weather_condition: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          mood?: string
          recommendation_data?: Json
          recommendation_type?: string
          user_feedback?: number | null
          user_id?: string | null
          was_helpful?: boolean | null
          weather_condition?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          food_preferences: Json | null
          id: string
          location_preferences: Json | null
          music_preferences: Json | null
          name: string | null
          preferred_language: string | null
          stay_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          food_preferences?: Json | null
          id?: string
          location_preferences?: Json | null
          music_preferences?: Json | null
          name?: string | null
          preferred_language?: string | null
          stay_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          food_preferences?: Json | null
          id?: string
          location_preferences?: Json | null
          music_preferences?: Json | null
          name?: string | null
          preferred_language?: string | null
          stay_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
