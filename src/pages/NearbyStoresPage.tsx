
import React from 'react';
import { ArrowLeft, MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NearbyStoresPage = () => {
  const stores = [
    {
      id: 1,
      name: "LuLu Hypermarket",
      address: "King Fahd Road, Al Olaya",
      distance: "1.2 km",
      phone: "+966 11 123 4567",
      hours: "8:00 AM - 12:00 AM",
      retailer: "LuLu"
    },
    {
      id: 2,
      name: "Carrefour Hypermarket",
      address: "Al Nakheel Mall, Exit 7",
      distance: "2.5 km", 
      phone: "+966 11 234 5678",
      hours: "9:00 AM - 11:00 PM",
      retailer: "Carrefour"
    },
    {
      id: 3,
      name: "Panda Hypermarket",
      address: "Riyadh Gallery Mall",
      distance: "3.7 km",
      phone: "+966 11 345 6789", 
      hours: "10:00 AM - 12:00 AM",
      retailer: "Panda"
    },
    {
      id: 4,
      name: "Danube Supermarket",
      address: "Panorama Mall, Level 1",
      distance: "4.1 km",
      phone: "+966 11 456 7890",
      hours: "9:00 AM - 11:30 PM",
      retailer: "Danube"
    },
    {
      id: 5,
      name: "Othaim Markets",
      address: "Al Tahlia Street",
      distance: "5.2 km",
      phone: "+966 11 567 8901",
      hours: "8:30 AM - 11:00 PM", 
      retailer: "Othaim"
    },
    {
      id: 6,
      name: "Tamimi Markets",
      address: "King Abdul Aziz Road",
      distance: "6.8 km",
      phone: "+966 11 678 9012",
      hours: "9:00 AM - 12:00 AM",
      retailer: "Tamimi"
    }
  ];

  const retailerColors = {
    'LuLu': 'border-blue-200 bg-blue-50',
    'Carrefour': 'border-orange-200 bg-orange-50',
    'Panda': 'border-indigo-200 bg-indigo-50',
    'Danube': 'border-cyan-200 bg-cyan-50',
    'Othaim': 'border-purple-200 bg-purple-50',
    'Tamimi': 'border-violet-200 bg-violet-50'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Nearby Stores</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Find the closest retailers near you</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {stores.map((store) => (
            <Card 
              key={store.id} 
              className={`hover:shadow-md transition-shadow duration-200 ${retailerColors[store.retailer as keyof typeof retailerColors] || 'bg-white'}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {store.distance}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{store.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{store.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{store.hours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Navigation className="h-4 w-4" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom spacing for mobile nav */}
      <div className="pb-20 md:pb-4"></div>
    </div>
  );
};

export default NearbyStoresPage;
