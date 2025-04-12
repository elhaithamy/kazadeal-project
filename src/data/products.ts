
// Define the product type
export interface Product {
  id: number;
  name: string;
  image: string;
  count: number;
  category?: string;
  prices: {
    lulu: number;
    othaim: number;
    carrefour: number;
    danube: number;
    panda: number;
    tamimi: number;
  };
}

// Export the products data
export const products: Product[] = [
  {
    id: 1,
    name: "Goody Creamy Peanut Butter",
    image: "/lovable-uploads/8a017eaf-e3f6-4a8c-93f0-48b63f40c835.png",
    count: 1,
    category: "Snacks",
    prices: {
      lulu: 10,
      othaim: 16,
      carrefour: 16,
      danube: 16.3,
      panda: 12,
      tamimi: 16.5
    }
  },
  {
    id: 2,
    name: "Almarai Premium Yogurt",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Dairy & Eggs",
    prices: {
      lulu: 22,
      othaim: 22,
      carrefour: 10,
      danube: 22,
      panda: 11,
      tamimi: 22
    }
  },
  {
    id: 3,
    name: "Pride Shredded Mozzarella",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Dairy & Eggs",
    prices: {
      lulu: 38,
      othaim: 30,
      carrefour: 37.3,
      danube: 38,
      panda: 28,
      tamimi: 38
    }
  },
  {
    id: 4,
    name: "Tomato",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Fruits & Vegetables",
    prices: {
      lulu: 10,
      othaim: 4.7,
      carrefour: 13,
      danube: 13,
      panda: 10,
      tamimi: 11
    }
  },
  {
    id: 5,
    name: "Al Walima Sella Basmati Rice",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Bakery",
    prices: {
      lulu: 89.5,
      othaim: 67,
      carrefour: 90.8,
      danube: 84.3,
      panda: 70,
      tamimi: 84.5
    }
  },
  {
    id: 6,
    name: "Nescafe Red Mug Instant",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Beverages",
    prices: {
      lulu: 34.1,
      othaim: 38,
      carrefour: 34.5,
      danube: 26,
      panda: 27,
      tamimi: 37.8
    }
  },
  {
    id: 7,
    name: "Nadec Long Life Full Milk",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Dairy & Eggs",
    prices: {
      lulu: 53,
      othaim: 51,
      carrefour: 53,
      danube: 51.5,
      panda: 40,
      tamimi: 40
    }
  },
  {
    id: 8,
    name: "Bananas",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Fruits & Vegetables",
    prices: {
      lulu: 6,
      othaim: 5,
      carrefour: 6.9,
      danube: 6.6,
      panda: 5,
      tamimi: 4.3
    }
  }
];
