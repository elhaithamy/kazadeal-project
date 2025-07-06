import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  unit: string;
  is_active: boolean;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  retailer_id: string;
  price: number;
  is_available: boolean;
  retailers?: {
    name: string;
    logo_url: string;
  };
}

export interface ProductWithPrices extends Product {
  prices: ProductPrice[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductWithPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (productsError) throw productsError;

      // Load prices with retailer info
      const { data: pricesData, error: pricesError } = await supabase
        .from('product_prices')
        .select(`
          *,
          retailers (
            name,
            logo_url
          )
        `)
        .eq('is_available', true);

      if (pricesError) throw pricesError;

      // Combine products with their prices
      const productsWithPrices = productsData?.map(product => ({
        ...product,
        prices: pricesData?.filter(price => price.product_id === product.id) || []
      })) || [];

      setProducts(productsWithPrices);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory,
    searchProducts,
    reloadProducts: loadProducts
  };
};