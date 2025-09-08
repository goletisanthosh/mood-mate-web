import React, { useState, useEffect } from 'react';
import { Bell, Settings, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeatherAlertService } from '@/services/weatherAlertService';
import { WeatherAlert, AlertNotification } from '@/types/alerts';
import { useToast } from '@/components/ui/use-toast';

interface WeatherAlertsProps {
  onAlertsUpdate?: (alertCount: number) => void;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ onAlertsUpdate }) => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  useEffect(() => {
    loadAlerts();
    loadNotifications();
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission === 'granted');
    }
  };

  const loadAlerts = async () => {
    try {
      const userAlerts = await WeatherAlertService.getUserAlerts();
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const userNotifications = await WeatherAlertService.getUserNotifications(20);
      setNotifications(userNotifications);
      onAlertsUpdate?.(userNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const requestNotificationPermission = async () => {
    const granted = await WeatherAlertService.requestNotificationPermission();
    setNotificationPermission(granted);
    
    if (granted) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive weather alerts",
      });
    } else {
      toast({
        title: "Notifications Denied",
        description: "Enable notifications in browser settings to receive alerts",
        variant: "destructive",
      });
    }
  };

  const updateAlert = async (alertId: string, updates: Partial<WeatherAlert>) => {
    const success = await WeatherAlertService.updateAlert(alertId, updates);
    if (success) {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, ...updates } : alert
      ));
      toast({
        title: "Alert Updated",
        description: "Your alert settings have been saved",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Could not update alert settings",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    const success = await WeatherAlertService.markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      onAlertsUpdate?.(notifications.filter(n => !n.is_read && n.id !== notificationId).length);
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      high_temp: 'High Temperature',
      low_temp: 'Low Temperature',
      heavy_rain: 'Heavy Rain',
      thunderstorm: 'Thunderstorm',
      strong_wind: 'Strong Wind',
      snow: 'Snow'
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Weather Alerts</h2>
        </div>
        
        {!notificationPermission && (
          <Button onClick={requestNotificationPermission} variant="outline" size="sm">
            Enable Notifications
          </Button>
        )}
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Alert Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {notifications.filter(n => !n.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {notifications.filter(n => !n.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          {alerts.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No alert settings found. Weather alerts will be created automatically when weather data is available.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {getAlertTypeLabel(alert.alert_type)}
                    </CardTitle>
                    <Switch
                      checked={alert.is_enabled}
                      onCheckedChange={(enabled) => 
                        updateAlert(alert.id, { is_enabled: enabled })
                      }
                    />
                  </div>
                  <CardDescription>
                    Receive alerts for {getAlertTypeLabel(alert.alert_type).toLowerCase()}
                  </CardDescription>
                </CardHeader>
                
                {alert.threshold_value !== null && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Label htmlFor={`threshold-${alert.id}`}>
                        Threshold: {alert.alert_type.includes('temp') ? '°C' : 'm/s'}
                      </Label>
                      <Input
                        id={`threshold-${alert.id}`}
                        type="number"
                        value={alert.threshold_value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            updateAlert(alert.id, { threshold_value: value });
                          }
                        }}
                        className="w-24"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No weather alerts yet. You'll see notifications here when weather conditions meet your alert criteria.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className={!notification.is_read ? 'border-primary' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getSeverityIcon(notification.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getSeverityColor(notification.severity)}>
                              {notification.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(notification.triggered_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                        </div>
                      </div>
                      
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherAlerts;