import React, { useState } from 'react';
import { Download, Upload, FileText, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProductImportExportProps {
  selectedProducts?: string[];
  onImport?: (products: any[]) => void;
}

const ProductImportExport: React.FC<ProductImportExportProps> = ({ 
  selectedProducts = [], 
  onImport 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const exportToCSV = async () => {
    try {
      if (selectedProducts.length === 0) {
        toast({
          title: 'No products selected',
          description: 'Please select some products to export',
          variant: 'destructive'
        });
        return;
      }

      // Create CSV content
      const csvHeaders = ['Product Name', 'Category', 'Notes', 'Quantity'];
      const csvRows = selectedProducts.map((productId, index) => [
        `Product ${index + 1}`,
        'Grocery',
        '',
        '1'
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shopping-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Save export to user's lists if authenticated
      if (user) {
        await supabase
          .from('saved_lists')
          .insert({
            user_id: user.id,
            name: `Exported List - ${new Date().toLocaleDateString()}`,
            items: selectedProducts.map((id, index) => ({
              id,
              name: `Product ${index + 1}`,
              quantity: 1
            }))
          });
      }

      toast({
        title: 'Export successful',
        description: 'Your shopping list has been exported to CSV'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Unable to export shopping list',
        variant: 'destructive'
      });
    }
  };

  const importFromCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const products = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          return {
            id: `imported-${index}`,
            name: values[0] || `Imported Product ${index + 1}`,
            category: values[1] || 'Grocery',
            notes: values[2] || '',
            quantity: parseInt(values[3]) || 1
          };
        });

      // Save imported list for authenticated users
      if (user && products.length > 0) {
        await supabase
          .from('saved_lists')
          .insert({
            user_id: user.id,
            name: `Imported from ${file.name}`,
            items: products
          });

        toast({
          title: 'Import successful',
          description: `Imported ${products.length} products from CSV`
        });
      }

      onImport?.(products);
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Unable to import CSV file. Please check the format.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const templateContent = [
      'Product Name,Category,Notes,Quantity',
      '"Milk","Dairy","Low fat","2"',
      '"Bread","Bakery","Whole wheat","1"',
      '"Apples","Produce","Red apples","6"'
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopping-list-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Template downloaded',
      description: 'Use this template to create your shopping lists'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import / Export Lists
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Export Current Selection</h3>
            <Button 
              onClick={exportToCSV}
              disabled={selectedProducts.length === 0}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV ({selectedProducts.length} items)
            </Button>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Import Shopping List</h3>
            <label htmlFor="csv-import">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={uploading}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Importing...' : 'Import CSV'}
                </span>
              </Button>
            </label>
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              className="hidden"
            />
          </div>
        </div>

        {/* Template Download */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Need a template?</p>
              <p className="text-xs text-muted-foreground">
                Download our CSV template to get started
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
        </div>

        {/* Format Info */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">CSV Format:</h4>
          <p className="text-xs text-muted-foreground">
            Your CSV should have columns: Product Name, Category, Notes, Quantity
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImportExport;