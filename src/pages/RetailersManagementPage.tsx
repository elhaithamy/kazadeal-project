import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Retailer {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  sort_order: number | null;
  offer_expiry?: string;
}

const RetailersManagementPage = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    offer_expiry: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setRetailers(data || []);
    } catch (error) {
      console.error('Error loading retailers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load retailers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File, retailerId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${retailerId}.${fileExt}`;
    const filePath = `retailer-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('retailer-logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('retailer-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = editingRetailer?.logo_url || null;

      if (logoFile) {
        const retailerId = editingRetailer?.id || crypto.randomUUID();
        logoUrl = await uploadLogo(logoFile, retailerId);
      }

      const retailerData = {
        name: formData.name,
        website_url: formData.website_url || null,
        logo_url: logoUrl,
        is_active: true,
        sort_order: retailers.length + 1,
      };

      if (editingRetailer) {
        const { error } = await supabase
          .from('retailers')
          .update(retailerData)
          .eq('id', editingRetailer.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Retailer updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('retailers')
          .insert(retailerData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Retailer added successfully',
        });
      }

      setFormData({ name: '', website_url: '', offer_expiry: '' });
      setLogoFile(null);
      setIsAddDialogOpen(false);
      setEditingRetailer(null);
      loadRetailers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('retailers')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Retailer deactivated successfully',
      });
      loadRetailers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (retailer: Retailer) => {
    setEditingRetailer(retailer);
    setFormData({
      name: retailer.name,
      website_url: retailer.website_url || '',
      offer_expiry: '',
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <div className="bg-card shadow-sm mb-4">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Retailers Management</h1>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Retailer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRetailer ? 'Edit Retailer' : 'Add New Retailer'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Retailer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="expiry">Offer Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={formData.offer_expiry}
                    onChange={(e) => setFormData({ ...formData, offer_expiry: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingRetailer ? 'Update' : 'Add')} Retailer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retailers.filter(r => r.is_active).map((retailer) => (
            <Card key={retailer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {retailer.logo_url ? (
                      <img
                        src={retailer.logo_url}
                        alt={retailer.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{retailer.name}</CardTitle>
                      {retailer.website_url && (
                        <a
                          href={retailer.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(retailer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(retailer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Offers expire: Not set</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default RetailersManagementPage;