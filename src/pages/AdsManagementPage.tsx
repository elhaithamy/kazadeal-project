import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
}

const AdsManagementPage = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advertisements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, adId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `ads/${adId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingAd?.image_url || null;

      const adData = {
        title: formData.title,
        description: formData.description || null,
        link_url: formData.link_url || null,
        image_url: imageUrl,
        is_active: true,
      };

      let adId: string;

      if (editingAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) throw error;
        adId = editingAd.id;

        toast({
          title: 'Success',
          description: 'Advertisement updated successfully',
        });
      } else {
        const { data, error } = await supabase
          .from('advertisements')
          .insert(adData)
          .select()
          .single();

        if (error) throw error;
        adId = data.id;

        toast({
          title: 'Success',
          description: 'Advertisement created successfully',
        });
      }

      // Upload image if provided
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile, adId);
        await supabase
          .from('advertisements')
          .update({ image_url: uploadedImageUrl })
          .eq('id', adId);
      }

      setFormData({ title: '', description: '', link_url: '' });
      setImageFile(null);
      setIsAddDialogOpen(false);
      setEditingAd(null);
      loadAds();
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
        .from('advertisements')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Advertisement deactivated successfully',
      });
      loadAds();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Advertisement ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      loadAds();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      link_url: ad.link_url || '',
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
            <h1 className="text-xl font-semibold">Advertisements Management</h1>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Advertisement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingAd ? 'Update' : 'Create')} Advertisement
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ad.title}</CardTitle>
                    {ad.description && (
                      <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(ad)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {ad.image_url && (
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={ad.is_active ? "default" : "secondary"}>
                      {ad.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(ad.id, ad.is_active)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {ad.is_active ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  
                  {ad.link_url && (
                    <a
                      href={ad.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block truncate"
                    >
                      {ad.link_url}
                    </a>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(ad.created_at).toLocaleDateString()}
                  </p>
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

export default AdsManagementPage;