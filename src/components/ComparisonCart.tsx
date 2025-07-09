import React, { useContext, useState } from 'react';
import { X, ShoppingCart, Plus, Save, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ComparisonCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonCart: React.FC<ComparisonCartProps> = ({ isOpen, onClose }) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { products } = useProducts();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listName, setListName] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedProductData = products.filter(product => 
    selectedProducts.includes(product.id)
  );

  const calculateTotal = () => {
    return selectedProductData.reduce((total, product) => {
      const lowestPrice = product.prices?.length > 0 
        ? Math.min(...product.prices.map(p => p.price))
        : 0;
      return total + lowestPrice;
    }, 0);
  };

  const calculateSavings = () => {
    return selectedProductData.reduce((savings, product) => {
      if (!product.prices || product.prices.length <= 1) return savings;
      
      const prices = product.prices.map(p => p.price);
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      return savings + (highestPrice - lowestPrice);
    }, 0);
  };

  const handleSaveList = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save your shopping list',
        variant: 'destructive'
      });
      return;
    }

    if (!listName.trim()) {
      toast({
        title: 'List name required',
        description: 'Please enter a name for your shopping list',
        variant: 'destructive'
      });
      return;
    }

    if (selectedProducts.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select items to save to your list',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const listItems = selectedProductData.map(product => ({
        id: product.id,
        name: product.name,
        quantity: 1,
        lowestPrice: product.prices?.length > 0 
          ? Math.min(...product.prices.map(p => p.price))
          : 0
      }));

      const { error } = await supabase
        .from('saved_lists')
        .insert({
          user_id: user.id,
          name: listName,
          items: listItems
        });

      if (error) throw error;

      toast({
        title: 'List saved',
        description: `"${listName}" has been saved successfully`
      });

      setListName('');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save shopping list',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const removeItem = (productId: string) => {
    toggleProductSelection(productId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <Card className="w-full max-w-md mx-4 mb-0 md:mb-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Comparison Cart ({selectedProducts.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 overflow-y-auto max-h-96">
          {selectedProductData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No items in your cart</p>
              <p className="text-sm">Select items to compare prices</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {selectedProductData.map(product => {
                  const lowestPrice = product.prices?.length > 0 
                    ? Math.min(...product.prices.map(p => p.price))
                    : 0;
                  const priceRange = product.prices?.length > 0
                    ? Math.max(...product.prices.map(p => p.price)) - lowestPrice
                    : 0;

                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 font-semibold">
                            ${lowestPrice.toFixed(2)}
                          </span>
                          {priceRange > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Save ${priceRange.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(product.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total (Best Prices):</span>
                  <span className="text-lg font-bold text-green-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                
                {calculateSavings() > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Potential Savings:</span>
                    <span className="text-green-600 font-medium">
                      ${calculateSavings().toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Save List Section */}
              {user && (
                <div className="border-t pt-4 space-y-3">
                  <Input
                    placeholder="Enter list name (e.g., Weekly Groceries)"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  />
                  <Button
                    onClick={handleSaveList}
                    disabled={saving || !listName.trim()}
                    className="w-full"
                  >
                    {saving ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Shopping List
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!user && (
                <div className="border-t pt-4">
                  <p className="text-center text-sm text-muted-foreground mb-3">
                    Sign in to save your shopping lists
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth'}>
                    Sign In
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonCart;