
import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Trash2, Calendar, ShoppingCart, ChevronDown, ChevronUp, Share2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { products } from '@/data/products';

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

// Mock saved lists
const mockSavedLists: SavedList[] = [
  {
    id: '1',
    date: '2025-05-09',
    name: 'Weekly Groceries',
    items: [1, 2, 3, 4, 5, 6],
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
    items: [9, 10, 12, 15, 16, 17, 18],
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
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const { toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would load from localStorage or a database
  }, []);

  const handleDeleteList = (id: string) => {
    setSavedLists(savedLists.filter(list => list.id !== id));
    toast({
      title: 'List deleted',
      description: 'Your saved list has been removed'
    });
  };

  const handleCheckListPrices = (listItems: number[]) => {
    // Add all list items to cart for comparison
    listItems.forEach(productId => {
      toggleProductSelection(productId);
    });
    
    toast({
      title: 'Items added to comparison',
      description: `${listItems.length} items added to your basket for price comparison`
    });
  };

  const toggleExpandList = (listId: string) => {
    const newExpanded = new Set(expandedLists);
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId);
    } else {
      newExpanded.add(listId);
    }
    setExpandedLists(newExpanded);
  };

  const handleShareList = async (list: SavedList) => {
    const shareText = `Check out my shopping list: ${list.name}\n\nItems:\n${
      list.items.map(id => {
        const product = products.find(p => p.id === id);
        return product ? `• ${product.name}` : '';
      }).filter(Boolean).join('\n')
    }`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping List: ${list.name}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      handleCopyList(list);
    }
  };

  const handleCopyList = async (list: SavedList) => {
    const shareText = `Shopping List: ${list.name}\n\nItems:\n${
      list.items.map(id => {
        const product = products.find(p => p.id === id);
        return product ? `• ${product.name}` : '';
      }).filter(Boolean).join('\n')
    }`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'List copied',
        description: 'Shopping list copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getListItems = (itemIds: number[]) => {
    return itemIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Your Saved Lists</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 max-w-4xl mx-auto w-full">
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
            {savedLists.map(list => {
              const listItems = getListItems(list.items);
              const previewItems = listItems.slice(0, 5);
              const isExpanded = expandedLists.has(list.id);
              const hasMoreItems = listItems.length > 5;
              
              return (
                <Card key={list.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="font-medium text-lg">{list.name}</h2>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(list.date)}</span>
                          <span className="ml-3">{list.items.length} items</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          className="bg-app-green hover:bg-app-green/90"
                          onClick={() => handleCheckListPrices(list.items)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Check List Prices
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShareList(list)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopyList(list)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteList(list.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Items Preview */}
                    <div className="space-y-2">
                      <div className="space-y-2">
                        {previewItems.map(product => (
                          <div key={product?.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                            <img 
                              src={product?.image} 
                              alt={product?.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{product?.name}</p>
                              <p className="text-xs text-gray-500">{product?.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expanded Items */}
                      {isExpanded && hasMoreItems && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                          {listItems.slice(5).map(product => (
                            <div key={product?.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                              <img 
                                src={product?.image} 
                                alt={product?.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{product?.name}</p>
                                <p className="text-xs text-gray-500">{product?.category}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show All/Show Less Button */}
                      {hasMoreItems && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleExpandList(list.id)}
                          className="w-full mt-3"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show All Items ({listItems.length - 5} more)
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default ChecklistPage;
