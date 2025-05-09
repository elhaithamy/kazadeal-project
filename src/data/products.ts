
// Define the product type
export interface Product {
  id: number;
  name: string;
  image: string;
  count: number;
  category?: string;
  addedDate: Date; // Add date for sorting new arrivals
  prices: {
    lulu: number;
    othaim: number;
    carrefour: number;
    danube: number;
    panda: number;
    tamimi: number;
  };
  isAvailable?: boolean; // Added to handle out of stock products
}

// Export the products data with some marked as unavailable
export const products: Product[] = [
  {
    id: 1,
    name: "Goody Creamy Peanut Butter",
    image: "/lovable-uploads/8a017eaf-e3f6-4a8c-93f0-48b63f40c835.png",
    count: 1,
    category: "Snacks",
    addedDate: new Date("2024-03-15"),
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
    addedDate: new Date("2024-03-10"),
    isAvailable: false, // Out of stock
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
    addedDate: new Date("2024-02-25"),
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
    addedDate: new Date("2024-02-15"),
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
    addedDate: new Date("2024-01-20"),
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
    addedDate: new Date("2024-01-15"),
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
    addedDate: new Date("2024-01-10"),
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
    addedDate: new Date("2023-12-28"),
    prices: {
      lulu: 6,
      othaim: 5,
      carrefour: 6.9,
      danube: 6.6,
      panda: 5,
      tamimi: 4.3
    }
  },
  {
    id: 9,
    name: "L'Oreal Shampoo",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Personal Care",
    addedDate: new Date("2023-12-20"),
    prices: {
      lulu: 29.5,
      othaim: 28,
      carrefour: 27.5,
      danube: 29,
      panda: 26,
      tamimi: 29.9
    }
  },
  {
    id: 10,
    name: "Dettol Sanitizer Spray",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Household",
    addedDate: new Date("2023-12-15"),
    prices: {
      lulu: 15.2,
      othaim: 16,
      carrefour: 15.9,
      danube: 16.5,
      panda: 14.8,
      tamimi: 16.2
    }
  },
  {
    id: 11,
    name: "Al Marai Fresh Chicken",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Meat & Poultry",
    addedDate: new Date("2023-12-10"),
    prices: {
      lulu: 18.5,
      othaim: 17.5,
      carrefour: 19,
      danube: 18.75,
      panda: 17,
      tamimi: 19.5
    }
  },
  {
    id: 12,
    name: "Tide Laundry Detergent",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Household",
    addedDate: new Date("2023-12-05"),
    prices: {
      lulu: 31.75,
      othaim: 32.5,
      carrefour: 30.9,
      danube: 31.5,
      panda: 29.9,
      tamimi: 32
    }
  },
  {
    id: 13,
    name: "Lipton Yellow Label Tea",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Beverages",
    addedDate: new Date("2023-11-30"),
    prices: {
      lulu: 19.95,
      othaim: 20.5,
      carrefour: 19.75,
      danube: 20.25,
      panda: 18.9,
      tamimi: 20.5
    }
  },
  {
    id: 14,
    name: "Nutella Hazelnut Spread",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Snacks",
    addedDate: new Date("2023-11-25"),
    prices: {
      lulu: 24.5,
      othaim: 25,
      carrefour: 24.9,
      danube: 25.5,
      panda: 23.75,
      tamimi: 25.9
    }
  },
  {
    id: 15,
    name: "Fairy Dish Soap",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Household",
    addedDate: new Date("2023-11-20"),
    prices: {
      lulu: 12.95,
      othaim: 13.5,
      carrefour: 12.75,
      danube: 13.25,
      panda: 12.5,
      tamimi: 13.75
    }
  },
  {
    id: 16,
    name: "Fresh Apples",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Fruits & Vegetables",
    addedDate: new Date("2023-11-15"),
    prices: {
      lulu: 8.95,
      othaim: 7.95,
      carrefour: 9.25,
      danube: 8.5,
      panda: 7.75,
      tamimi: 8.9
    }
  },
  {
    id: 17,
    name: "Sadia Frozen Chicken Nuggets",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Meat & Poultry",
    addedDate: new Date("2023-11-10"),
    prices: {
      lulu: 22.95,
      othaim: 23.5,
      carrefour: 22.5,
      danube: 23,
      panda: 21.95,
      tamimi: 23.9
    }
  },
  {
    id: 18,
    name: "Al Baker Fresh White Bread",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Bakery",
    addedDate: new Date("2023-11-05"),
    prices: {
      lulu: 4.5,
      othaim: 4.25,
      carrefour: 4.75,
      danube: 4.5,
      panda: 4,
      tamimi: 4.9
    }
  },
  {
    id: 19,
    name: "Pampers Diapers Pack",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Personal Care",
    addedDate: new Date("2023-10-30"),
    prices: {
      lulu: 53.95,
      othaim: 55,
      carrefour: 52.9,
      danube: 54.5,
      panda: 51.5,
      tamimi: 55.9
    }
  },
  {
    id: 20,
    name: "Coca-Cola 6-Pack",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Beverages",
    addedDate: new Date("2023-10-25"),
    prices: {
      lulu: 16.5,
      othaim: 17,
      carrefour: 16.25,
      danube: 16.75,
      panda: 15.95,
      tamimi: 17.25
    }
  },
  // New arrivals - Latest 5 products
  {
    id: 21,
    name: "Freshly Imported Avocados",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Fruits & Vegetables",
    addedDate: new Date("2024-04-10"), // Recent date for new arrival
    prices: {
      lulu: 12.95,
      othaim: 13.5,
      carrefour: 12.5,
      danube: 13.25,
      panda: 11.95,
      tamimi: 13.75
    }
  },
  {
    id: 22,
    name: "Premium Arabic Coffee",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Beverages",
    addedDate: new Date("2024-04-08"), // Recent date for new arrival
    prices: {
      lulu: 45.5,
      othaim: 46.95,
      carrefour: 44.75,
      danube: 46.5,
      panda: 43.95,
      tamimi: 47.25
    }
  },
  {
    id: 23,
    name: "Organic Free-Range Eggs",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Dairy & Eggs",
    addedDate: new Date("2024-04-07"), // Recent date for new arrival
    prices: {
      lulu: 19.95,
      othaim: 20.5,
      carrefour: 19.5,
      danube: 20.25,
      panda: 18.95,
      tamimi: 20.75
    }
  },
  {
    id: 24,
    name: "Eco-Friendly Cleaning Spray",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Household",
    addedDate: new Date("2024-04-05"), // Recent date for new arrival
    prices: {
      lulu: 27.5,
      othaim: 28.95,
      carrefour: 27.25,
      danube: 28.5,
      panda: 26.95,
      tamimi: 29.25
    }
  },
  {
    id: 25,
    name: "Premium Grass-Fed Beef",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100",
    count: 1,
    category: "Meat & Poultry",
    addedDate: new Date("2024-04-02"), // Recent date for new arrival
    prices: {
      lulu: 59.95,
      othaim: 62.5,
      carrefour: 58.75,
      danube: 61.25,
      panda: 57.95,
      tamimi: 63.25
    }
  }
];

// Helper function to get new arrivals
export const getNewArrivals = (count: number = 5): Product[] => {
  return [...products]
    .sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime())
    .slice(0, count);
};
