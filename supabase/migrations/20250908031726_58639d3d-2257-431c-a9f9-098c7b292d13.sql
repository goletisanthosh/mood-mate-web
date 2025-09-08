-- Create weather alerts table
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL, -- 'high_temp', 'low_temp', 'heavy_rain', 'thunderstorm', 'strong_wind', 'snow'
  threshold_value NUMERIC, -- temperature threshold, wind speed threshold, etc.
  is_enabled BOOLEAN DEFAULT true,
  notification_method TEXT DEFAULT 'browser', -- 'browser', 'email', 'sms'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for weather alerts
CREATE POLICY "Users can view their own alerts" 
ON public.weather_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" 
ON public.weather_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
ON public.weather_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
ON public.weather_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create alert notifications table
CREATE TABLE public.alert_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL,
  weather_condition TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'extreme'
  message TEXT NOT NULL,
  location TEXT NOT NULL,
  temperature NUMERIC,
  is_read BOOLEAN DEFAULT false,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alert_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for alert notifications
CREATE POLICY "Users can view their own notifications" 
ON public.alert_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.alert_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weather_alerts_updated_at
BEFORE UPDATE ON public.weather_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_weather_alerts_user_id ON public.weather_alerts(user_id);
CREATE INDEX idx_alert_notifications_user_id ON public.alert_notifications(user_id);
CREATE INDEX idx_alert_notifications_triggered_at ON public.alert_notifications(triggered_at);