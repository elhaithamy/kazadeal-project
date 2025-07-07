import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Plus, Edit, Trash2, FileText, Settings, Store, Package } from 'lucide-react';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
}

interface Retailer {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  unit: string;
  is_active: boolean;
}

interface Leaflet {
  id: string;
  title: string;
  retailer_id: string;
  pdf_url: string;
  processing_status: string;
  valid_from: string;
  valid_until: string;
  retailers?: { name: string };
}

const AdminPage = () => {
  const { toast } = useToast();
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leaflets, setLeaflets] = useState<Leaflet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsRes, retailersRes, productsRes, leafletsRes] = await Promise.all([
        supabase.from('site_settings').select('*').order('setting_key'),
        supabase.from('retailers').select('*').order('sort_order'),
        supabase.from('products').select('*').order('name'),
        supabase.from('leaflets').select('*, retailers(name)').order('created_at', { ascending: false })
      ]);

      if (settingsRes.data) setSiteSettings(settingsRes.data);
      if (retailersRes.data) setRetailers(retailersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (leafletsRes.data) setLeaflets(leafletsRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (settingKey: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', settingKey);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File, bucket: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  const processLeaflet = async (leafletId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('process-leaflet', {
        body: { leafletId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Leaflet processing started",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process leaflet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadLeaflet = async (file: File, title: string, retailerId: string, validFrom: string, validUntil: string) => {
    try {
      setLoading(true);
      
      // Upload PDF file
      const pdfUrl = await handleFileUpload(file, 'leaflets');
      if (!pdfUrl) return;

      // Create leaflet record
      const { data, error } = await supabase
        .from('leaflets')
        .insert({
          title,
          retailer_id: retailerId,
          pdf_url: pdfUrl,
          valid_from: validFrom,
          valid_until: validUntil,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Start processing
      await processLeaflet(data.id);
      
      toast({
        title: "Success",
        description: "Leaflet uploaded and processing started",
      });
      
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload leaflet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="retailers" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Retailers
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="leaflets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Leaflets
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.setting_key}>{setting.setting_key.replace('_', ' ').toUpperCase()}</Label>
                  {setting.setting_type === 'text' ? (
                    <Input
                      id={setting.setting_key}
                      defaultValue={setting.setting_value}
                      onBlur={(e) => updateSetting(setting.setting_key, e.target.value)}
                    />
                  ) : (
                    <Textarea
                      id={setting.setting_key}
                      defaultValue={setting.setting_value}
                      onBlur={(e) => updateSetting(setting.setting_key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retailers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Retailers Management</CardTitle>
                <Button asChild>
                  <a href="/admin/retailers">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Retailers
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {retailers.slice(0, 5).map((retailer) => (
                  <div key={retailer.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img src={retailer.logo_url} alt={retailer.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{retailer.name}</h3>
                      <p className="text-sm text-muted-foreground">{retailer.website_url}</p>
                    </div>
                    <Badge variant={retailer.is_active ? "default" : "secondary"}>
                      {retailer.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
                {retailers.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {retailers.length - 5} more retailers...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {products.slice(0, 10).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category} • {product.unit}</p>
                    </div>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaflets">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Leaflet</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const file = formData.get('leaflet') as File;
                  const title = formData.get('title') as string;
                  const retailerId = formData.get('retailer') as string;
                  const validFrom = formData.get('validFrom') as string;
                  const validUntil = formData.get('validUntil') as string;
                  
                  if (file && title && retailerId) {
                    uploadLeaflet(file, title, retailerId, validFrom, validUntil);
                  }
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input name="title" placeholder="Leaflet title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retailer">Retailer</Label>
                    <select name="retailer" className="w-full p-2 border rounded" required>
                      <option value="">Select retailer</option>
                      {retailers.map(retailer => (
                        <option key={retailer.id} value={retailer.id}>{retailer.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validFrom">Valid From</Label>
                      <Input name="validFrom" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input name="validUntil" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaflet">PDF File</Label>
                    <Input name="leaflet" type="file" accept=".pdf" required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : 'Upload & Process'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Leaflets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaflets.map((leaflet) => (
                    <div key={leaflet.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{leaflet.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {leaflet.retailers?.name} • {leaflet.valid_from} to {leaflet.valid_until}
                        </p>
                      </div>
                      <Badge variant={
                        leaflet.processing_status === 'completed' ? 'default' :
                        leaflet.processing_status === 'processing' ? 'secondary' :
                        leaflet.processing_status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {leaflet.processing_status}
                      </Badge>
                      {leaflet.processing_status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => processLeaflet(leaflet.id)}
                          disabled={loading}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;