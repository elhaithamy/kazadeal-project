import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown } from 'lucide-react';

interface OfferLogicProps {
  products: Array<{
    id: string;
    name: string;
    prices: Array<{
      price: number;
      retailer_id: string;
      retailers?: {
        name: string;
      };
    }>;
    unit?: string;
  }>;
}

const OfferLogic: React.FC<OfferLogicProps> = ({ products }) => {
  const calculateUnitPrice = (price: number, unit: string = 'each') => {
    // Extract numeric value and unit type from unit string
    const match = unit.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|liter|pack|each)?/i);
    if (!match) return price;
    
    const quantity = parseFloat(match[1]);
    const unitType = match[2]?.toLowerCase() || 'each';
    
    // Convert to standard units (per kg, per liter, per unit)
    switch (unitType) {
      case 'g':
        return price / (quantity / 1000); // Convert to per kg
      case 'ml':
        return price / (quantity / 1000); // Convert to per liter
      case 'kg':
      case 'l':
      case 'liter':
      case 'pack':
      case 'each':
        return price / quantity;
      default:
        return price;
    }
  };

  const productsWithUnitPrices = useMemo(() => {
    return products.map(product => {
      const pricesWithUnitCalculation = product.prices.map(priceInfo => ({
        ...priceInfo,
        unitPrice: calculateUnitPrice(priceInfo.price, product.unit || 'each'),
        retailerName: priceInfo.retailers?.name || 'Unknown'
      }));

      // Sort by unit price to find best deal
      pricesWithUnitCalculation.sort((a, b) => a.unitPrice - b.unitPrice);

      return {
        ...product,
        pricesWithUnit: pricesWithUnitCalculation,
        bestUnitPrice: pricesWithUnitCalculation[0]?.unitPrice || 0,
        bestRetailer: pricesWithUnitCalculation[0]?.retailerName || 'Unknown'
      };
    });
  }, [products]);

  const renderPriceComparison = (product: any) => {
    const { pricesWithUnit } = product;
    if (!pricesWithUnit || pricesWithUnit.length === 0) return null;

    return (
      <div className="space-y-2">
        {pricesWithUnit.map((priceInfo, index) => {
          const isBest = index === 0;
          const savings = index > 0 ? ((priceInfo.unitPrice - pricesWithUnit[0].unitPrice) / pricesWithUnit[0].unitPrice * 100) : 0;
          
          return (
            <div
              key={priceInfo.retailer_id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isBest ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{priceInfo.retailerName}</span>
                <span className="text-xs text-muted-foreground">
                  Total: ${priceInfo.price.toFixed(2)} | Unit: ${priceInfo.unitPrice.toFixed(2)}/{product.unit || 'each'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isBest && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Best Deal
                  </Badge>
                )}
                {savings > 0 && (
                  <Badge variant="outline" className="text-red-600">
                    +{savings.toFixed(1)}% more
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Smart Unit Price Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {productsWithUnitPrices.map(product => (
          <div key={product.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <Badge variant="outline">{product.unit || 'each'}</Badge>
            </div>
            {renderPriceComparison(product)}
          </div>
        ))}
        
        {productsWithUnitPrices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No products selected for unit price comparison</p>
            <p className="text-sm">Select products to see smart pricing analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferLogic;