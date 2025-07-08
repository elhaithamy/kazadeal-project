
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Bell, MapPin, Globe, Heart, List as ListIcon, Settings, LogOut, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: ''
  });
  const [settings, setSettings] = useState({
    notifications: true,
    priceAlerts: true,
    locationServices: true,
    language: 'en'
  });
  const [savedLists, setSavedLists] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadSavedLists();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user?.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSavedLists = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_lists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading saved lists:', error);
        return;
      }

      setSavedLists(data || []);
    } catch (error) {
      console.error('Error loading saved lists:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          avatar_url: userProfile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to save profile changes',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Profile saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile changes',
        variant: 'destructive'
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      setUserProfile({ ...userProfile, avatar_url: data.publicUrl });
      
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
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
                <Link to="/auth">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback className="text-lg">
                  {userProfile.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <label htmlFor="avatar-upload">
                  <Button variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Change Avatar'}
                    </span>
                  </Button>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input 
                  value={userProfile.first_name}
                  onChange={(e) => setUserProfile({...userProfile, first_name: e.target.value})}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input 
                  value={userProfile.last_name}
                  onChange={(e) => setUserProfile({...userProfile, last_name: e.target.value})}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input 
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Saved Lists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListIcon className="h-5 w-5" />
                Your Saved Lists
              </div>
              <Link to="/checklist">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedLists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ListIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No saved lists yet</p>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {savedLists.slice(0, 3).map((list: any) => (
                  <div key={list.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{list.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(list.items) ? list.items.length : 0} items • {new Date(list.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{Array.isArray(list.items) ? list.items.length : 0}</Badge>
                  </div>
                ))}
                {savedLists.length > 3 && (
                  <p className="text-center text-sm text-muted-foreground pt-2">
                    +{savedLists.length - 3} more lists
                  </p>
                )}
              </div>
            )}
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
            
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Button onClick={handleSaveProfile} className="w-full bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AccountPage;
