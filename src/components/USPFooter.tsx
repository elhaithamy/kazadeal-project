
import React from 'react';
import { MapPin, Bookmark, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const USPFooter = () => {
  const uspItems = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Nearby Stores",
      description: "Find closest retailers",
      link: "/nearby-stores",
      color: "text-blue-500"
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      title: "Saved Lists",
      description: "Your shopping lists",
      link: "/checklist",
      color: "text-green-500"
    },
    {
      icon: <TrendingDown className="h-6 w-6" />,
      title: "Best Prices",
      description: "Lowest price deals",
      link: "/best-deals",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="bg-gray-50 py-6 px-4 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
          Smart Shopping Features
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {uspItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <Card className="hover:shadow-md transition-shadow duration-200 border-0 bg-white">
                <CardContent className="p-4 text-center">
                  <div className={`${item.color} mb-2 flex justify-center`}>
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default USPFooter;
