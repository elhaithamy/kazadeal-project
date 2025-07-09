import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Globe, Palette, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    language: 'en',
    currency: 'EGP',
    darkMode: false,
    priceAlerts: true,
    locationServices: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: 'Setting updated',
      description: `${key} has been updated successfully`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-alerts">Price Drop Alerts</Label>
                    <Switch
                      id="price-alerts"
                      checked={settings.priceAlerts}
                      onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Language & Currency */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Language & Currency</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center justify-between">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">EGP (£)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Privacy & Security</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location-services">Location Services</Label>
                    <Switch
                      id="location-services"
                      checked={settings.locationServices}
                      onCheckedChange={(checked) => handleSettingChange('locationServices', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* App Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">App Preferences</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                  </div>
                </div>
              </div>

              {user && (
                <div className="pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    Export My Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;