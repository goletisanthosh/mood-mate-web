export interface WeatherAlert {
  id: string;
  user_id: string;
  alert_type: 'high_temp' | 'low_temp' | 'heavy_rain' | 'thunderstorm' | 'strong_wind' | 'snow';
  threshold_value?: number;
  is_enabled: boolean;
  notification_method: 'browser' | 'email' | 'sms';
  created_at: string;
  updated_at: string;
}

export interface AlertNotification {
  id: string;
  user_id: string;
  alert_type: string;
  weather_condition: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  message: string;
  location: string;
  temperature?: number;
  is_read: boolean;
  triggered_at: string;
}

export interface AlertSettings {
  high_temp_threshold: number;
  low_temp_threshold: number;
  wind_speed_threshold: number;
  notifications_enabled: boolean;
  notification_method: 'browser' | 'email' | 'sms';
}