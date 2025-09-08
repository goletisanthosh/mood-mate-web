import { supabase } from '@/integrations/supabase/client';
import { WeatherData } from '@/types';
import { WeatherAlert, AlertNotification, AlertSettings } from '@/types/alerts';

export class WeatherAlertService {
  // Default alert thresholds
  private static defaultSettings: AlertSettings = {
    high_temp_threshold: 35, // Celsius
    low_temp_threshold: 5,   // Celsius
    wind_speed_threshold: 15, // m/s
    notifications_enabled: true,
    notification_method: 'browser'
  };

  // Check weather conditions and trigger alerts
  static async checkAndTriggerAlerts(weather: WeatherData): Promise<AlertNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's alert settings
      const { data: alerts } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      if (!alerts || alerts.length === 0) {
        // Create default alerts for new users
        await this.createDefaultAlerts(user.id);
        return [];
      }

      const triggeredAlerts: AlertNotification[] = [];

      for (const alert of alerts) {
        const notification = this.evaluateWeatherCondition(weather, alert as WeatherAlert);
        if (notification) {
          // Save notification to database
          const { data: savedNotification } = await supabase
            .from('alert_notifications')
            .insert([{
              user_id: user.id,
              alert_type: alert.alert_type,
              weather_condition: weather.condition,
              severity: notification.severity,
              message: notification.message,
              location: weather.location,
              temperature: weather.temperature
            }])
            .select()
            .single();

          if (savedNotification) {
            triggeredAlerts.push(savedNotification as AlertNotification);
          }

          // Send browser notification if enabled
          if (alert.notification_method === 'browser') {
            this.showBrowserNotification(notification.message, notification.severity);
          }
        }
      }

      return triggeredAlerts;
    } catch (error) {
      console.error('Error checking weather alerts:', error);
      return [];
    }
  }

  // Evaluate if weather condition triggers an alert
  private static evaluateWeatherCondition(weather: WeatherData, alert: WeatherAlert): { message: string; severity: 'low' | 'medium' | 'high' | 'extreme' } | null {
    const { temperature, condition, windSpeed } = weather;
    const threshold = alert.threshold_value || 0;

    switch (alert.alert_type) {
      case 'high_temp':
        if (temperature >= threshold) {
          const severity = temperature >= 40 ? 'extreme' : temperature >= 37 ? 'high' : 'medium';
          return {
            message: `🌡️ High temperature alert! Current temperature is ${temperature}°C in ${weather.location}`,
            severity
          };
        }
        break;

      case 'low_temp':
        if (temperature <= threshold) {
          const severity = temperature <= 0 ? 'extreme' : temperature <= 3 ? 'high' : 'medium';
          return {
            message: `🥶 Low temperature alert! Current temperature is ${temperature}°C in ${weather.location}`,
            severity
          };
        }
        break;

      case 'heavy_rain':
        if (condition.includes('rain') || condition.includes('drizzle')) {
          const severity = condition.includes('heavy') ? 'high' : 'medium';
          return {
            message: `🌧️ Rain alert! ${weather.description} in ${weather.location}`,
            severity
          };
        }
        break;

      case 'thunderstorm':
        if (condition.includes('thunderstorm') || condition.includes('storm')) {
          return {
            message: `⛈️ Thunderstorm alert! ${weather.description} in ${weather.location}`,
            severity: 'high'
          };
        }
        break;

      case 'strong_wind':
        if (windSpeed >= threshold) {
          const severity = windSpeed >= 20 ? 'extreme' : windSpeed >= 15 ? 'high' : 'medium';
          return {
            message: `💨 Strong wind alert! Wind speed is ${windSpeed} m/s in ${weather.location}`,
            severity
          };
        }
        break;

      case 'snow':
        if (condition.includes('snow')) {
          return {
            message: `❄️ Snow alert! ${weather.description} in ${weather.location}`,
            severity: 'medium'
          };
        }
        break;
    }

    return null;
  }

  // Show browser notification
  private static showBrowserNotification(message: string, severity: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const icon = severity === 'extreme' || severity === 'high' ? '🚨' : '⚠️';
      new Notification(`Weather Alert ${icon}`, {
        body: message,
        icon: '/favicon.ico',
        tag: 'weather-alert'
      });
    }
  }

  // Request notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Create default alerts for new users
  static async createDefaultAlerts(userId: string): Promise<void> {
    const defaultAlerts = [
      {
        user_id: userId,
        alert_type: 'high_temp',
        threshold_value: this.defaultSettings.high_temp_threshold,
        is_enabled: true,
        notification_method: 'browser'
      },
      {
        user_id: userId,
        alert_type: 'low_temp',
        threshold_value: this.defaultSettings.low_temp_threshold,
        is_enabled: true,
        notification_method: 'browser'
      },
      {
        user_id: userId,
        alert_type: 'heavy_rain',
        threshold_value: null,
        is_enabled: true,
        notification_method: 'browser'
      },
      {
        user_id: userId,
        alert_type: 'thunderstorm',
        threshold_value: null,
        is_enabled: true,
        notification_method: 'browser'
      },
      {
        user_id: userId,
        alert_type: 'strong_wind',
        threshold_value: this.defaultSettings.wind_speed_threshold,
        is_enabled: true,
        notification_method: 'browser'
      }
    ];

    await supabase.from('weather_alerts').insert(defaultAlerts);
  }

  // Get user's alerts
  static async getUserAlerts(): Promise<WeatherAlert[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('weather_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;
      return (data || []) as WeatherAlert[];
    } catch (error) {
      console.error('Error fetching user alerts:', error);
      return [];
    }
  }

  // Update alert settings
  static async updateAlert(alertId: string, updates: Partial<WeatherAlert>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('weather_alerts')
        .update(updates)
        .eq('id', alertId);

      return !error;
    } catch (error) {
      console.error('Error updating alert:', error);
      return false;
    }
  }

  // Get user's notifications
  static async getUserNotifications(limit: number = 10): Promise<AlertNotification[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('alert_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('triggered_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as AlertNotification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('alert_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
}