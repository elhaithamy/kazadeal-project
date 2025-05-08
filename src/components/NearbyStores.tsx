
import React, { useState } from 'react';
import { MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const storeLocations = [
  { id: 1, name: "LuLu Hypermarket", address: "King Fahd Road", distance: "1.2 km" },
  { id: 2, name: "Carrefour", address: "Al Nakheel Mall", distance: "2.5 km" },
  { id: 3, name: "Panda", address: "Riyadh Gallery", distance: "3.7 km" },
  { id: 4, name: "Danube", address: "Panorama Mall", distance: "4.1 km" }
];

const NearbyStores = () => {
  const [showStores, setShowStores] = useState(false);
  
  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-full">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowStores(!showStores)}
        >
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-app-green" />
            <h3 className="font-medium">Nearby Stores</h3>
          </div>
          {showStores ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        
        {showStores && (
          <div className="mt-4 space-y-3 max-h-52 overflow-y-auto">
            {storeLocations.map(store => (
              <div key={store.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{store.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{store.distance}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-app-green">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyStores;
