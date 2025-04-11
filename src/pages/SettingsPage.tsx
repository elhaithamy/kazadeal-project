
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4">
        <div className="bg-white rounded-lg shadow-sm divide-y">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="font-medium">Notifications</span>
            <Switch />
          </div>
          
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="font-medium">Price Alerts</span>
            <Switch defaultChecked />
          </div>
          
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="font-medium">Location Services</span>
            <Switch defaultChecked />
          </div>
          
          <div className="px-4 py-3">
            <span className="font-medium">Preferred Store</span>
            <select className="mt-2 w-full p-2 border rounded-md">
              <option value="lulu">LuLu</option>
              <option value="othaim">Othaim</option>
              <option value="carrefour">Carrefour</option>
              <option value="danube">Danube</option>
              <option value="panda">Panda</option>
              <option value="tamimi">Tamimi</option>
            </select>
          </div>
          
          <div className="px-4 py-3">
            <span className="font-medium">Language</span>
            <select className="mt-2 w-full p-2 border rounded-md">
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full py-2 bg-app-green text-white rounded-md">
            Save Changes
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
