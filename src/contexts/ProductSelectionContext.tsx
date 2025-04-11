
import React, { createContext, useState, ReactNode } from 'react';

type ProductSelectionContextType = {
  selectedProducts: number[];
  toggleProductSelection: (productId: number | "clear") => void;
};

export const ProductSelectionContext = createContext<ProductSelectionContextType>({
  selectedProducts: [],
  toggleProductSelection: () => {},
});

type ProductSelectionProviderProps = {
  children: ReactNode;
};

export const ProductSelectionProvider: React.FC<ProductSelectionProviderProps> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const toggleProductSelection = (productId: number | "clear") => {
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
