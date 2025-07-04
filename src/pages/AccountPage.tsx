
import React, { useState } from 'react';
import { ArrowLeft, User, Bell, MapPin, Globe, Heart, List as ListIcon, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AccountPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    preferredStore: 'lulu'
  });
  const [settings, setSettings] = useState({
    notifications: true,
    priceAlerts: true,
    locationServices: true,
    language: 'en'
  });
  const [savedLists, setSavedLists] = useState([
    { id: 1, name: "Weekly Groceries", items: 12, date: "2024-01-15" },
    { id: 2, name: "Monthly Stock-up", items: 24, date: "2024-01-10" }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginForm(false);
  };

  if (!isLoggedIn && !showLoginForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="bg-white shadow-sm mb-4">
          <div className="container mx-auto px-4 py-2 flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Account</h1>
          </div>
        </div>
        
        <main className="flex-1 mb-16 px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Sign in to your account</h2>
              <p className="text-gray-500 mb-6">Access your saved lists, price alerts, and preferences</p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowLoginForm(true)}
                  className="w-full bg-app-green hover:bg-app-green/90"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsLoggedIn(true);
                    setShowLoginForm(false);
                  }}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <BottomNav />
      </div>
    );
  }

  if (showLoginForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="bg-white shadow-sm mb-4">
          <div className="container mx-auto px-4 py-2 flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Sign In</h1>
          </div>
        </div>
        
        <main className="flex-1 mb-16 px-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-app-green hover:bg-app-green/90"
                  >
                    Sign In
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Account & Settings</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input 
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input 
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input 
                value={userProfile.phone}
                onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Saved Lists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListIcon className="h-5 w-5" />
              Your Saved Lists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedLists.map(list => (
                <div key={list.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{list.name}</h3>
                    <p className="text-sm text-gray-500">{list.items} items • {list.date}</p>
                  </div>
                  <Badge variant="outline">{list.items}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Price Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Milk - Almarai</h3>
                  <p className="text-sm text-gray-500">Alert when below 4.50 SAR</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Bread - L'usine</h3>
                  <p className="text-sm text-gray-500">Alert when below 3.00 SAR</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-medium">Notifications</span>
              </div>
              <Switch 
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="font-medium">Price Alerts</span>
              </div>
              <Switch 
                checked={settings.priceAlerts}
                onCheckedChange={(checked) => setSettings({...settings, priceAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location Services</span>
              </div>
              <Switch 
                checked={settings.locationServices}
                onCheckedChange={(checked) => setSettings({...settings, locationServices: checked})}
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 font-medium mb-2">
                <Globe className="h-4 w-4" />
                Language
              </label>
              <select 
                className="w-full p-2 border rounded-md"
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            
            <div>
              <label className="block font-medium mb-2">Preferred Store</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={userProfile.preferredStore}
                onChange={(e) => setUserProfile({...userProfile, preferredStore: e.target.value})}
              >
                <option value="lulu">LuLu</option>
                <option value="othaim">Othaim</option>
                <option value="carrefour">Carrefour</option>
                <option value="danube">Danube</option>
                <option value="panda">Panda</option>
                <option value="tamimi">Tamimi</option>
              </select>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Button className="w-full bg-app-green hover:bg-app-green/90">
            Save Changes
          </Button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AccountPage;
