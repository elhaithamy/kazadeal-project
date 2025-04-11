
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { products, Product } from '@/data/products';

const PriceComparison = () => {
  const calculateTotals = () => {
    const totals = {
      lulu: 0,
      othaim: 0,
      carrefour: 0,
      danube: 0,
      panda: 0,
      tamimi: 0
    };

    products.forEach(product => {
      totals.lulu += product.prices.lulu;
      totals.othaim += product.prices.othaim;
      totals.carrefour += product.prices.carrefour;
      totals.danube += product.prices.danube;
      totals.panda += product.prices.panda;
      totals.tamimi += product.prices.tamimi;
    });

    return totals;
  };

  const totals = calculateTotals();
  
  // Find the lowest price for each product
  const findLowestPrice = (prices: Record<string, number>) => {
    return Math.min(...Object.values(prices));
  };

  // Find which store has the lowest total
  const findLowestTotal = () => {
    const lowestTotal = Math.min(...Object.values(totals));
    return Object.entries(totals).find(([_, value]) => value === lowestTotal)?.[0] || '';
  };

  const lowestTotalStore = findLowestTotal();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left w-1/3">Product</th>
              <th className="py-2 px-2 text-center">Tamimi</th>
              <th className="py-2 px-2 text-center">Panda</th>
              <th className="py-2 px-2 text-center">Danube</th>
              <th className="py-2 px-2 text-center">Carrefour</th>
              <th className="py-2 px-2 text-center">Othaim</th>
              <th className="py-2 px-2 text-center">LuLu</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowestPrice = findLowestPrice(product.prices);
              
              return (
                <tr key={product.id} className="comparison-row border-b">
                  <td className="py-3 px-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 mr-3 flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">Count: {product.count}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.tamimi === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.tamimi}
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.panda === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.panda}
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.danube === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.danube}
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.carrefour === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.carrefour}
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.othaim === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.othaim}
                    </div>
                  </td>
                  
                  <td className="py-2 px-2 text-center">
                    <div className={`${product.prices.lulu === lowestPrice ? 'best-price' : ''}`}>
                      {product.prices.lulu}
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="font-bold bg-gray-100">
              <td className="py-3 px-3">Total</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'tamimi' ? 'text-app-green' : ''}`}>{totals.tamimi}</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'panda' ? 'text-app-green' : ''}`}>{totals.panda}</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'danube' ? 'text-app-green' : ''}`}>{totals.danube}</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'carrefour' ? 'text-app-green' : ''}`}>{totals.carrefour}</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'othaim' ? 'text-app-green' : ''}`}>{totals.othaim}</td>
              <td className={`py-2 px-2 text-center ${lowestTotalStore === 'lulu' ? 'text-app-green' : ''}`}>{totals.lulu}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceComparison;
