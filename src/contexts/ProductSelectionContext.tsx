
import React, { createContext, useState, ReactNode } from 'react';

type ProductSelectionContextType = {
  selectedProducts: string[];
  toggleProductSelection: (productId: string | "clear") => void;
};

export const ProductSelectionContext = createContext<ProductSelectionContextType>({
  selectedProducts: [],
  toggleProductSelection: () => {},
});

type ProductSelectionProviderProps = {
  children: ReactNode;
};

export const ProductSelectionProvider: React.FC<ProductSelectionProviderProps> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProductSelection = (productId: string | "clear") => {
    if (productId === "clear") {
      setSelectedProducts([]);
      return;
    }
    
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  return (
    <ProductSelectionContext.Provider value={{ selectedProducts, toggleProductSelection }}>
      {children}
    </ProductSelectionContext.Provider>
  );
};
