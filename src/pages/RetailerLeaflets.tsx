
import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Leaflet {
  id: number;
  retailer: string;
  title: string;
  validUntil: string;
  thumbnailUrl: string;
  pdfUrl: string;
}

const leaflets: Leaflet[] = [
  {
    id: 1,
    retailer: 'LuLu',
    title: 'Weekend Offers Brochure',
    validUntil: '25 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  },
  {
    id: 2,
    retailer: 'Othaim',
    title: 'Monthly Deals Catalogue',
    validUntil: '30 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  },
  {
    id: 3,
    retailer: 'Carrefour',
    title: 'Special Discounts Flyer',
    validUntil: '22 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  },
  {
    id: 4,
    retailer: 'Danube',
    title: 'Fresh Produce Brochure',
    validUntil: '28 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  },
  {
    id: 5,
    retailer: 'Panda',
    title: 'Special Promotion Leaflet',
    validUntil: '23 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  },
  {
    id: 6,
    retailer: 'Tamimi',
    title: 'Weekly Offers Catalogue',
    validUntil: '21 Apr 2025',
    thumbnailUrl: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    pdfUrl: '#'
  }
];

const RetailerLeaflets = () => {
  const handleDownload = (leaflet: Leaflet) => {
    // In a real app, this would download the PDF
    console.log(`Downloading ${leaflet.title} from ${leaflet.retailer}`);
    
    // Mock download behavior
    alert(`Downloading ${leaflet.title} from ${leaflet.retailer}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 mb-16 pb-3">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-app-green" />
            Retailer Leaflets
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {leaflets.map((leaflet) => (
              <Card key={leaflet.id} className="overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={leaflet.thumbnailUrl} 
                    alt={`${leaflet.retailer} leaflet thumbnail`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="font-bold">{leaflet.retailer}</div>
                  <h2 className="text-lg font-medium mb-2">{leaflet.title}</h2>
                  <p className="text-sm text-gray-500">Valid until: {leaflet.validUntil}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleDownload(leaflet)} 
                    className="w-full bg-app-green hover:bg-app-green/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default RetailerLeaflets;
