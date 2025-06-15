
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, FileText, Eye, Share2, X } from 'lucide-react';
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
  const [previewLeaflet, setPreviewLeaflet] = useState<Leaflet | null>(null);

  const handleDownload = (leaflet: Leaflet) => {
    console.log(`Downloading ${leaflet.title} from ${leaflet.retailer}`);
    alert(`Downloading ${leaflet.title} from ${leaflet.retailer}`);
  };

  const handlePreview = (leaflet: Leaflet) => {
    setPreviewLeaflet(leaflet);
  };

  const handleShare = async (leaflet: Leaflet) => {
    const shareText = `Check out this offer: ${leaflet.title} from ${leaflet.retailer}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${leaflet.retailer} - ${leaflet.title}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
      } catch (error) {
        alert('Unable to copy to clipboard');
      }
    }
  };

  const closePreview = () => {
    setPreviewLeaflet(null);
  };

  if (previewLeaflet) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex-1 mb-16">
          <div className="bg-white shadow-sm mb-4">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-semibold">{previewLeaflet.retailer} - {previewLeaflet.title}</h1>
              <Button variant="ghost" onClick={closePreview}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-4 min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">PDF Preview</p>
                <p className="text-sm text-gray-500 mb-4">
                  {previewLeaflet.title} - Valid until {previewLeaflet.validUntil}
                </p>
                <p className="text-xs text-gray-400">
                  (In a real app, the PDF would be displayed here)
                </p>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 mb-16 pb-3">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-6 w-6 text-app-green" />
            Offers
          </h1>
          <h2 className="text-lg text-gray-600 mb-6">Offers Magazines</h2>
          
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
                <CardFooter className="space-y-2">
                  <div className="flex gap-2 w-full">
                    <Button 
                      onClick={() => handlePreview(leaflet)} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => handleShare(leaflet)} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button 
                    onClick={() => handleDownload(leaflet)} 
                    className="w-full bg-app-green hover:bg-app-green/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
