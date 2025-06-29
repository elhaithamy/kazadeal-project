
import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Bell, Store, Save, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface PriceAlert {
  id: number;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  store: string;
  isActive: boolean;
}

interface SavedList {
  id: number;
  name: string;
  itemCount: number;
  createdDate: string;
  totalEstimate: number;
}

const AccountPage = () => {
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState({
    email: 'user@example.com',
    phone: '+966 12 345 6789',
    firstName: 'Ahmed',
    lastName: 'Al-Rashid'
  });
  
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 1,
      productName: 'Organic Bananas',
      targetPrice: 5.99,
      currentPrice: 7.50,
      store: 'LuLu',
      isActive: true
    },
    {
      id: 2,
      productName: 'Almarai Milk',
      targetPrice: 8.00,
      currentPrice: 8.50,
      store: 'Panda',
      isActive: true
    }
  ]);

  const [savedLists, setSavedLists] = useState<SavedList[]>([
    {
      id: 1,
      name: 'Weekly Groceries',
      itemCount: 15,
      createdDate: '2024-01-15',
      totalEstimate: 245.50
    },
    {
      id: 2,
      name: 'Party Supplies',
      itemCount: 8,
      createdDate: '2024-01-10',
      totalEstimate: 89.99
    }
  ]);

  const [preferredStores, setPreferredStores] = useState({
    lulu: true,
    othaim: false,
    carrefour: true,
    danube: false,
    panda: true,
    tamimi: false
  });

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    weeklyDeals: true,
    newArrivals: false,
    email: true,
    sms: false
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated!',
      description: 'Your account information has been saved.',
    });
  };

  const handleTogglePriceAlert = (alertId: number) => {
    setPriceAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const handleToggleStore = (store: keyof typeof preferredStores) => {
    setPreferredStores(prev => ({
      ...prev,
      [store]: !prev[store]
    }));
  };

  const stores = [
    { key: 'lulu', name: 'LuLu Hypermarket', color: '#0EA5E9' },
    { key: 'othaim', name: 'Othaim Markets', color: '#9b87f5' },
    { key: 'carrefour', name: 'Carrefour', color: '#F97316' },
    { key: 'danube', name: 'Danube', color: '#1EAEDB' },
    { key: 'panda', name: 'Panda', color: '#7E69AB' },
    { key: 'tamimi', name: 'Tamimi Markets', color: '#6E59A5' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profile Information</span>
                <Edit className="h-4 w-4 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userInfo.firstName}
                    onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userInfo.lastName}
                    onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="bg-app-green hover:bg-app-green/90">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Price Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priceAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{alert.productName}</div>
                      <div className="text-sm text-gray-500">
                        Target: {alert.targetPrice.toFixed(2)} SAR | Current: {alert.currentPrice.toFixed(2)} SAR
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {alert.store}
                      </Badge>
                    </div>
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => handleTogglePriceAlert(alert.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Lists */}
          <Card>
            <CardHeader>
              <CardTitle>My Saved Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedLists.map(list => (
                  <div key={list.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{list.name}</div>
                      <div className="text-sm text-gray-500">
                        {list.itemCount} items • Created {list.createdDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{list.totalEstimate.toFixed(2)} SAR</div>
                      <div className="text-xs text-gray-500">estimated</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preferred Stores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Preferred Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stores.map(store => (
                  <div key={store.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: store.color }}
                      />
                      <span className="font-medium">{store.name}</span>
                    </div>
                    <Switch
                      checked={preferredStores[store.key as keyof typeof preferredStores]}
                      onCheckedChange={() => handleToggleStore(store.key as keyof typeof preferredStores)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price Alerts</div>
                    <div className="text-sm text-gray-500">Get notified when prices drop</div>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, priceAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Deals</div>
                    <div className="text-sm text-gray-500">Best deals of the week</div>
                  </div>
                  <Switch
                    checked={notifications.weeklyDeals}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyDeals: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">New Arrivals</div>
                    <div className="text-sm text-gray-500">Latest products and offers</div>
                  </div>
                  <Switch
                    checked={notifications.newArrivals}
                    onCheckedChange={(checked) => setNotifications({...notifications, newArrivals: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AccountPage;
