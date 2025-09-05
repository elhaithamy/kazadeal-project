import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Store, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  unit: string;
  barcode: string;
  image_url: string;
}

interface RetailerPrice {
  retailer_id: string;
  retailer_name: string;
  price: number;
  is_available: boolean;
  selected: boolean;
}

const SingleProductManager = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [retailerPrices, setRetailerPrices] = useState<RetailerPrice[]>([]);
  
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    unit: 'each',
    barcode: '',
    image_url: ''
  });

  const categories = ['Fresh Produce', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'Other'];

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setRetailers(data || []);
      
      // Initialize retailer prices
      setRetailerPrices(data?.map(retailer => ({
        retailer_id: retailer.id,
        retailer_name: retailer.name,
        price: 0,
        is_available: true,
        selected: false
      })) || []);
    } catch (error) {
      console.error('Error loading retailers:', error);
    }
  };

  const updateRetailerPrice = (retailerId: string, field: keyof RetailerPrice, value: any) => {
    setRetailerPrices(prev => prev.map(price => 
      price.retailer_id === retailerId 
        ? { ...price, [field]: value }
        : price
    ));
  };

  const handleSaveProduct = async () => {
    try {
      setSaving(true);
      
      if (!productForm.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Product name is required',
          variant: 'destructive'
        });
        return;
      }

      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', productForm.name.trim())
        .single();

      let productId;

      if (existingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: productForm.name.trim(),
            description: productForm.description,
            category: productForm.category,
            unit: productForm.unit,
            image_url: productForm.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id);

        if (error) throw error;
        productId = existingProduct.id;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            name: productForm.name.trim(),
            description: productForm.description,
            category: productForm.category,
            unit: productForm.unit,
            image_url: productForm.image_url,
            is_active: true
          })
          .select('id')
          .single();

        if (error) throw error;
        productId = newProduct.id;
      }

      // Delete existing prices for this product
      await supabase
        .from('product_prices')
        .delete()
        .eq('product_id', productId);

      // Insert new prices for selected retailers with valid prices
      const selectedPrices = retailerPrices
        .filter(price => price.selected && price.price > 0)
        .map(price => ({
          product_id: productId,
          retailer_id: price.retailer_id,
          price: price.price,
          is_available: price.is_available
        }));

      if (selectedPrices.length > 0) {
        const { error: priceError } = await supabase
          .from('product_prices')
          .insert(selectedPrices);

        if (priceError) throw priceError;
      }

      toast({
        title: 'Success',
        description: `Product ${existingProduct ? 'updated' : 'created'} successfully with ${selectedPrices.length} retailer prices`
      });

      // Reset form
      setProductForm({
        name: '',
        description: '',
        category: '',
        unit: 'each',
        barcode: '',
        image_url: ''
      });
      setRetailerPrices(prev => prev.map(price => ({
        ...price,
        price: 0,
        is_available: true,
        selected: false
      })));

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const clearForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      unit: 'each',
      barcode: '',
      image_url: ''
    });
    setRetailerPrices(prev => prev.map(price => ({
      ...price,
      price: 0,
      is_available: true,
      selected: false
    })));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              value={productForm.name}
              onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={productForm.description}
            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
            placeholder="Product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="unit">Unit Type</Label>
            <Select value={productForm.unit} onValueChange={(value) => setProductForm({...productForm, unit: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="each">Each</SelectItem>
                <SelectItem value="kg">Kilogram</SelectItem>
                <SelectItem value="g">Gram</SelectItem>
                <SelectItem value="l">Liter</SelectItem>
                <SelectItem value="ml">Milliliter</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="barcode">Barcode (Optional)</Label>
            <Input
              id="barcode"
              value={productForm.barcode}
              onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
              placeholder="Product barcode"
            />
          </div>
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={productForm.image_url}
              onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
              placeholder="Product image URL"
            />
          </div>
        </div>

        {/* Retailer Prices */}
        <div>
          <Label className="text-base font-semibold">Select Retailers & Set Prices</Label>
          <div className="space-y-3 mt-2">
            {retailerPrices.map(retailerPrice => (
              <div key={retailerPrice.retailer_id} className="flex items-center gap-4 p-3 border rounded-lg">
                <Checkbox 
                  checked={retailerPrice.selected}
                  onCheckedChange={(checked) => updateRetailerPrice(retailerPrice.retailer_id, 'selected', checked)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">{retailerPrice.retailer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={retailerPrice.price || ''}
                    onChange={(e) => updateRetailerPrice(retailerPrice.retailer_id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    className="w-24"
                    disabled={!retailerPrice.selected}
                  />
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={retailerPrice.is_available}
                      onCheckedChange={(checked) => updateRetailerPrice(retailerPrice.retailer_id, 'is_available', checked)}
                      disabled={!retailerPrice.selected}
                    />
                    <span className="text-sm">Available</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSaveProduct} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
          <Button variant="outline" onClick={clearForm} disabled={saving} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleProductManager;