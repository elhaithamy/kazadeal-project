
import React, { useState } from 'react';
import { Bell, BellOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const NotificationCenter = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, product: "Rice Basmati 5kg", store: "LuLu", oldPrice: 36.99, newPrice: 29.99, date: "2 days ago" },
    { id: 2, product: "Milk Full Fat 1L", store: "Carrefour", oldPrice: 5.99, newPrice: 4.50, date: "5 days ago" }
  ]);
  
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-app-green" />
            <h3 className="font-medium">Price Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={alertsEnabled} 
              onCheckedChange={setAlertsEnabled} 
              onClick={(e) => e.stopPropagation()}
            />
            {showNotifications ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
        
        {showNotifications && (
          <div className="mt-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.product}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price dropped at {notification.store}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 dark:text-gray-400 line-through text-sm">${notification.oldPrice}</p>
                      <p className="text-app-green font-bold">${notification.newPrice}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.date}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                <BellOff className="h-6 w-6 mx-auto mb-2" />
                <p>No price alerts yet</p>
              </div>
            )}
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                Manage Alerts
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
