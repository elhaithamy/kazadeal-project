import React, { useState, useEffect } from 'react';
import { Upload, Download, CheckCircle, X, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RetailerColumn {
  id: string;
  name: string;
  columnName: string;
  selected: boolean;
}

const BulkProductImport = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [retailerColumns, setRetailerColumns] = useState<RetailerColumn[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setRetailers(data || []);
    } catch (error) {
      console.error('Error loading retailers:', error);
    }
  };

  const generateTemplate = () => {
    const retailerHeaders = retailers.map(r => `${r.name} Price`);
    const templateHeaders = ['SKU', 'Product Name', 'Image URL', 'Category', 'Unit', 'Description', ...retailerHeaders];
    
    const sampleRows = [
      ['P001', 'Almarai Milk 1L', '/product-images/milk.jpg', 'Dairy', 'each', 'Fresh whole milk 1 liter', ...retailers.map(() => '25.50')],
      ['P002', 'Bread Whole Wheat', '/product-images/bread.jpg', 'Bakery', 'each', 'Fresh whole wheat bread', ...retailers.map(() => '8.00')],
      ['P003', 'Bananas', '/product-images/bananas.jpg', 'Fresh Produce', 'kg', 'Fresh bananas per kilogram', ...retailers.map(() => '12.00')]
    ];

    const csvContent = [
      templateHeaders.join(','),
      ...sampleRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk-products-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Template downloaded',
      description: 'Use this template to bulk import products with retailer prices'
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const fileHeaders = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      setHeaders(fileHeaders);
      
      // Parse preview data (first 5 rows)
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const row: any = {};
        fileHeaders.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setPreviewData(preview);

      // Auto-detect retailer columns
      const detectedColumns: RetailerColumn[] = [];
      fileHeaders.forEach(header => {
        const retailer = retailers.find(r => 
          header.toLowerCase().includes(r.name.toLowerCase()) && 
          header.toLowerCase().includes('price')
        );
        if (retailer) {
          detectedColumns.push({
            id: retailer.id,
            name: retailer.name,
            columnName: header,
            selected: true
          });
        }
      });

      setRetailerColumns(detectedColumns);
      
      toast({
        title: 'File uploaded',
        description: `Detected ${detectedColumns.length} retailer price columns`
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Error reading CSV file',
        variant: 'destructive'
      });
    }
  };

  const processImport = async () => {
    try {
      setUploading(true);
      
      for (const row of previewData) {
        // Create/update product
        const productData = {
          name: row['Product Name'],
          description: row['Description'] || '',
          category: row['Category'] || 'Other',
          unit: row['Unit'] || 'each',
          image_url: row['Image URL'] || '',
          is_active: true
        };

        let productId;
        
        // Check if product exists (by SKU or name)
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('name', productData.name)
          .single();

        if (existingProduct) {
          // Update existing product
          await supabase
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id);
          productId = existingProduct.id;
        } else {
          // Create new product
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert(productData)
            .select('id')
            .single();
          
          if (error) throw error;
          productId = newProduct.id;
        }

        // Delete existing prices for this product
        await supabase
          .from('product_prices')
          .delete()
          .eq('product_id', productId);

        // Insert new prices for selected retailers
        const priceInserts = retailerColumns
          .filter(col => col.selected && row[col.columnName] && parseFloat(row[col.columnName]) > 0)
          .map(col => ({
            product_id: productId,
            retailer_id: col.id,
            price: parseFloat(row[col.columnName]),
            is_available: true
          }));

        if (priceInserts.length > 0) {
          const { error: priceError } = await supabase
            .from('product_prices')
            .insert(priceInserts);
          
          if (priceError) throw priceError;
        }
      }

      toast({
        title: 'Import successful',
        description: `Imported ${previewData.length} products with retailer prices`
      });

      // Clear preview data
      setPreviewData([]);
      setRetailerColumns([]);
      setHeaders([]);
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import failed',
        description: 'Error importing products',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleRetailerColumn = (columnId: string) => {
    setRetailerColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, selected: !col.selected } : col
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Product Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={generateTemplate} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <div className="flex-1">
              <Label htmlFor="bulk-import">
                <Button variant="outline" className="w-full" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Processing...' : 'Upload CSV File'}
                  </span>
                </Button>
              </Label>
              <Input
                id="bulk-import"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Retailer Column Selection */}
          {retailerColumns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Retailer Columns to Import</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {retailerColumns.map(col => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={col.id}
                        checked={col.selected}
                        onCheckedChange={() => toggleRetailerColumn(col.id)}
                      />
                      <Label htmlFor={col.id} className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{col.name}</div>
                          <div className="text-xs text-muted-foreground">{col.columnName}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Data */}
          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Preview Data (First 5 rows)
                  <Button onClick={processImport} disabled={uploading}>
                    {uploading ? 'Importing...' : 'Import Products'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        {['Product Name', 'Category', 'Unit', ...retailerColumns.filter(c => c.selected).map(c => c.name)].map(header => (
                          <th key={header} className="border border-border p-2 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="border border-border p-2 text-sm">{row['Product Name']}</td>
                          <td className="border border-border p-2 text-sm">{row['Category']}</td>
                          <td className="border border-border p-2 text-sm">{row['Unit']}</td>
                          {retailerColumns.filter(c => c.selected).map(col => (
                            <td key={col.id} className="border border-border p-2 text-sm">
                              {row[col.columnName] ? `$${row[col.columnName]}` : '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkProductImport;