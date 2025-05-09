
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Define the saved list type
interface SavedList {
  id: string;
  date: string;
  name: string;
  items: number[];
  totalPrices: {
    lulu: number;
    othaim: number;
    carrefour: number;
    danube: number;
    panda: number;
    tamimi: number;
  };
}

// Mock saved lists (in a real app, this would come from localStorage or a database)
const mockSavedLists: SavedList[] = [
  {
    id: '1',
    date: '2025-05-09',
    name: 'Weekly Groceries',
    items: [1, 2, 3],
    totalPrices: {
      lulu: 42,
      othaim: 38,
      carrefour: 39.3,
      danube: 39.3,
      panda: 33,
      tamimi: 50
    }
  },
  {
    id: '2',
    date: '2025-05-08',
    name: 'Household Items',
    items: [9, 10, 12, 15],
    totalPrices: {
      lulu: 89.4,
      othaim: 89.5,
      carrefour: 87.0,
      danube: 91.25,
      panda: 83.2,
      tamimi: 92.75
    }
  }
];

const ChecklistPage = () => {
  const [savedLists, setSavedLists] = useState<SavedList[]>(mockSavedLists);
  const { toast } = useToast();

  // Pretend to load lists from storage
  useEffect(() => {
    // In a real app, you would load from localStorage or a database
    // setSavedLists(JSON.parse(localStorage.getItem('savedLists') || '[]'));
  }, []);

  const handleDeleteList = (id: string) => {
    setSavedLists(savedLists.filter(list => list.id !== id));
    toast({
      title: 'List deleted',
      description: 'Your saved list has been removed'
    });
    // In a real app: localStorage.setItem('savedLists', JSON.stringify(updatedLists));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const findBestStore = (totalPrices: SavedList['totalPrices']) => {
    let lowestPrice = Infinity;
    let bestStore = '';

    Object.entries(totalPrices).forEach(([store, price]) => {
      if (price < lowestPrice) {
        lowestPrice = price;
        bestStore = store;
      }
    });

    return { store: bestStore, price: lowestPrice };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Your Saved Lists</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4">
        {savedLists.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">You don't have any saved lists yet</p>
            <Link 
              to="/" 
              className="inline-block bg-app-green text-white px-4 py-2 rounded-md"
            >
              Start Comparing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedLists.map(list => (
              <Card key={list.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h2 className="font-medium text-lg">{list.name}</h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(list.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/?list=${list.id}`}>
                        <Button size="sm" className="bg-app-green">View</Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteList(list.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm mb-2">
                      <span className="font-medium">{list.items.length} items</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-3">
                      <div className="text-sm mb-2 font-medium">Price Comparison:</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(list.totalPrices).map(([store, price]) => {
                          const isBest = findBestStore(list.totalPrices).store === store;
                          return (
                            <div 
                              key={store} 
                              className={`p-2 rounded ${isBest ? 'bg-app-green text-white' : 'bg-gray-100'}`}
                            >
                              <div className="capitalize">{store}</div>
                              <div className="font-bold">{price.toFixed(2)}</div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3 text-sm font-medium text-app-green">
                        Best Price: {findBestStore(list.totalPrices).store} ({findBestStore(list.totalPrices).price.toFixed(2)})
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ChecklistPage;
