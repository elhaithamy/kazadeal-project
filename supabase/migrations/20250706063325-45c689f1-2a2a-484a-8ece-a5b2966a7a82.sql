-- Create user reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for timestamps
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products into the products table
INSERT INTO public.products (name, description, category, image_url, unit) VALUES
('Goody Creamy Peanut Butter', 'Premium creamy peanut butter spread', 'Snacks', '/product-images/peanut-butter.jpg', 'jar'),
('Almarai Premium Yogurt', 'Fresh and creamy premium yogurt', 'Dairy & Eggs', '/product-images/yogurt.jpg', 'cup'),
('Pride Shredded Mozzarella', 'High quality shredded mozzarella cheese', 'Dairy & Eggs', '/product-images/cheese.jpg', 'pack'),
('Fresh Tomatoes', 'Fresh red tomatoes', 'Fruits & Vegetables', '/product-images/tomato.jpg', 'kg'),
('Al Walima Sella Basmati Rice', 'Premium basmati rice', 'Bakery', '/product-images/rice.jpg', '5kg bag'),
('Nescafe Red Mug Instant', 'Premium instant coffee', 'Beverages', '/product-images/coffee.jpg', 'jar'),
('Nadec Long Life Full Milk', 'Long life full cream milk', 'Dairy & Eggs', '/product-images/milk.jpg', 'liter'),
('Fresh Bananas', 'Sweet and fresh bananas', 'Fruits & Vegetables', '/product-images/bananas.jpg', 'kg'),
('L''Oreal Shampoo', 'Professional hair care shampoo', 'Personal Care', '/product-images/shampoo.jpg', 'bottle');

-- Insert sample product prices for the products we just added
-- Get product and retailer IDs first, then insert prices
DO $$
DECLARE
    product_pb UUID;
    product_yogurt UUID;
    product_cheese UUID;
    product_tomato UUID;
    product_rice UUID;
    product_coffee UUID;
    product_milk UUID;
    product_banana UUID;
    product_shampoo UUID;
    
    retailer_lulu UUID;
    retailer_panda UUID;
    retailer_othaim UUID;
    retailer_carrefour UUID;
    retailer_danube UUID;
    retailer_tamimi UUID;
BEGIN
    -- Get product IDs
    SELECT id INTO product_pb FROM products WHERE name = 'Goody Creamy Peanut Butter';
    SELECT id INTO product_yogurt FROM products WHERE name = 'Almarai Premium Yogurt';
    SELECT id INTO product_cheese FROM products WHERE name = 'Pride Shredded Mozzarella';
    SELECT id INTO product_tomato FROM products WHERE name = 'Fresh Tomatoes';
    SELECT id INTO product_rice FROM products WHERE name = 'Al Walima Sella Basmati Rice';
    SELECT id INTO product_coffee FROM products WHERE name = 'Nescafe Red Mug Instant';
    SELECT id INTO product_milk FROM products WHERE name = 'Nadec Long Life Full Milk';
    SELECT id INTO product_banana FROM products WHERE name = 'Fresh Bananas';
    SELECT id INTO product_shampoo FROM products WHERE name = 'L''Oreal Shampoo';
    
    -- Get retailer IDs
    SELECT id INTO retailer_lulu FROM retailers WHERE name = 'LuLu Hypermarket';
    SELECT id INTO retailer_panda FROM retailers WHERE name = 'Panda';
    SELECT id INTO retailer_othaim FROM retailers WHERE name = 'Othaim Markets';
    SELECT id INTO retailer_carrefour FROM retailers WHERE name = 'Carrefour';
    SELECT id INTO retailer_danube FROM retailers WHERE name = 'Danube';
    SELECT id INTO retailer_tamimi FROM retailers WHERE name = 'Tamimi Markets';
    
    -- Insert prices for Peanut Butter
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_pb, retailer_lulu, 10.00),
    (product_pb, retailer_panda, 12.00),
    (product_pb, retailer_othaim, 16.00),
    (product_pb, retailer_carrefour, 16.00),
    (product_pb, retailer_danube, 16.30),
    (product_pb, retailer_tamimi, 16.50);
    
    -- Insert prices for Yogurt
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_yogurt, retailer_lulu, 22.00),
    (product_yogurt, retailer_panda, 11.00),
    (product_yogurt, retailer_othaim, 22.00),
    (product_yogurt, retailer_carrefour, 10.00),
    (product_yogurt, retailer_danube, 22.00),
    (product_yogurt, retailer_tamimi, 22.00);
    
    -- Insert prices for Cheese
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_cheese, retailer_lulu, 38.00),
    (product_cheese, retailer_panda, 28.00),
    (product_cheese, retailer_othaim, 30.00),
    (product_cheese, retailer_carrefour, 37.30),
    (product_cheese, retailer_danube, 38.00),
    (product_cheese, retailer_tamimi, 38.00);
    
    -- Insert prices for Tomato
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_tomato, retailer_lulu, 10.00),
    (product_tomato, retailer_panda, 10.00),
    (product_tomato, retailer_othaim, 4.70),
    (product_tomato, retailer_carrefour, 13.00),
    (product_tomato, retailer_danube, 13.00),
    (product_tomato, retailer_tamimi, 11.00);
    
    -- Insert prices for Rice
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_rice, retailer_lulu, 89.50),
    (product_rice, retailer_panda, 70.00),
    (product_rice, retailer_othaim, 67.00),
    (product_rice, retailer_carrefour, 90.80),
    (product_rice, retailer_danube, 84.30),
    (product_rice, retailer_tamimi, 84.50);
    
    -- Insert prices for Coffee
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_coffee, retailer_lulu, 34.10),
    (product_coffee, retailer_panda, 27.00),
    (product_coffee, retailer_othaim, 38.00),
    (product_coffee, retailer_carrefour, 34.50),
    (product_coffee, retailer_danube, 26.00),
    (product_coffee, retailer_tamimi, 37.80);
    
    -- Insert prices for Milk
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_milk, retailer_lulu, 53.00),
    (product_milk, retailer_panda, 40.00),
    (product_milk, retailer_othaim, 51.00),
    (product_milk, retailer_carrefour, 53.00),
    (product_milk, retailer_danube, 51.50),
    (product_milk, retailer_tamimi, 40.00);
    
    -- Insert prices for Banana
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_banana, retailer_lulu, 6.00),
    (product_banana, retailer_panda, 5.00),
    (product_banana, retailer_othaim, 5.00),
    (product_banana, retailer_carrefour, 6.90),
    (product_banana, retailer_danube, 6.60),
    (product_banana, retailer_tamimi, 4.30);
    
    -- Insert prices for Shampoo
    INSERT INTO product_prices (product_id, retailer_id, price) VALUES
    (product_shampoo, retailer_lulu, 29.50),
    (product_shampoo, retailer_panda, 26.00),
    (product_shampoo, retailer_othaim, 28.00),
    (product_shampoo, retailer_carrefour, 27.50),
    (product_shampoo, retailer_danube, 29.00),
    (product_shampoo, retailer_tamimi, 29.90);
END $$;