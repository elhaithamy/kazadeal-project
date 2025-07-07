import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
}

export const useAds = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    loadAds();
  }, []);

  // Auto-rotate ads every 3 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const loadAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAd = () => {
    return ads.length > 0 ? ads[currentAdIndex] : null;
  };

  return {
    ads,
    loading,
    currentAd: getCurrentAd(),
    reloadAds: loadAds,
  };
};