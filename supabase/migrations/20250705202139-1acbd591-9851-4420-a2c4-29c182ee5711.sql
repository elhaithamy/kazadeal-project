-- Enable RLS and create content management tables
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create retailers table
CREATE TABLE public.retailers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  unit VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product prices table
CREATE TABLE public.product_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES public.retailers(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, retailer_id)
);

-- Create leaflets table for PDF management
CREATE TABLE public.leaflets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  retailer_id UUID REFERENCES public.retailers(id),
  pdf_url TEXT NOT NULL,
  thumbnail_url TEXT,
  valid_from DATE,
  valid_until DATE,
  processing_status VARCHAR(20) DEFAULT 'pending',
  extracted_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaflets ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view active retailers" ON public.retailers FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product prices" ON public.product_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can view leaflets" ON public.leaflets FOR SELECT USING (true);

-- Admin policies (will be restricted to authenticated admin users later)
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage retailers" ON public.retailers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage product prices" ON public.product_prices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage leaflets" ON public.leaflets FOR ALL USING (true) WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('retailer-logos', 'retailer-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('leaflets', 'leaflets', true);

-- Storage policies
CREATE POLICY "Public can view retailer logos" ON storage.objects FOR SELECT USING (bucket_id = 'retailer-logos');
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public can view leaflets" ON storage.objects FOR SELECT USING (bucket_id = 'leaflets');

CREATE POLICY "Admins can upload retailer logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'retailer-logos');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admins can upload leaflets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'leaflets');

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_retailers_updated_at BEFORE UPDATE ON public.retailers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leaflets_updated_at BEFORE UPDATE ON public.leaflets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type) VALUES
('site_title', 'Kaza Deal - Best Price Comparison', 'text'),
('site_description', 'Find the best deals and compare prices across major retailers', 'text'),
('hero_title', 'Compare Prices, Save Money', 'text'),
('hero_subtitle', 'Find the best deals across all major retailers in one place', 'text'),
('contact_email', 'info@kazadeal.com', 'email'),
('phone_number', '+966 XX XXX XXXX', 'tel');

-- Insert default retailers
INSERT INTO public.retailers (name, logo_url, website_url, sort_order) VALUES
('LuLu Hypermarket', '/retailer-logos/lulu.png', 'https://www.luluhypermarket.com', 1),
('Panda', '/retailer-logos/panda.png', 'https://www.pandamarket.com', 2),
('Othaim Markets', '/retailer-logos/othaim.png', 'https://www.othaimmarkets.com', 3),
('Carrefour', '/retailer-logos/carrefour.png', 'https://www.carrefourksa.com', 4),
('Danube', '/retailer-logos/danube.png', 'https://www.danube.sa', 5),
('Tamimi Markets', '/retailer-logos/tamimi.png', 'https://www.tamimimarkets.com', 6);