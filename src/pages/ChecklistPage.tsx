import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Trash2, Calendar, ShoppingCart, ChevronDown, ChevronUp, Share2, Copy, Pin, Edit, MoreVertical, Upload, Image, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { products } from '@/data/products';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Define the saved list type
interface SavedList {
  id: string;
  created_at: string;
  name: string;
  items: any[];
  background_image_url?: string;
  reminder_date?: string;
  reminder_email?: boolean;
  user_id: string;
}


const ChecklistPage = () => {
  const { user } = useAuth();
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const [editingList, setEditingList] = useState<SavedList | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedLists();
    }
  }, [user]);

  const loadSavedLists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading saved lists:', error);
        return;
      }

      setSavedLists((data || []).map((list: any) => ({
        ...list,
        items: Array.isArray(list.items) ? list.items : []
      })));
    } catch (error) {
      console.error('Error loading saved lists:', error);
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_lists')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete list',
          variant: 'destructive'
        });
        return;
      }

      setSavedLists(savedLists.filter(list => list.id !== id));
      toast({
        title: 'List deleted',
        description: 'Your saved list has been removed'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete list',
        variant: 'destructive'
      });
    }
  };

  const handleCheckListPrices = (listItems: any[]) => {
    // Add all list items to cart for comparison
    listItems.forEach((item, index) => {
      toggleProductSelection(`demo-${index + 1}`);
    });
    
    toast({
      title: 'Items added to comparison',
      description: `${listItems.length} items added to your basket for price comparison`
    });
  };

  const toggleExpandList = (listId: string) => {
    const newExpanded = new Set(expandedLists);
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId);
    } else {
      newExpanded.add(listId);
    }
    setExpandedLists(newExpanded);
  };

  const handleShareList = async (list: SavedList) => {
    const shareText = `Check out my shopping list: ${list.name}\n\nItems:\n${
      list.items.map((item: any) => `• ${item.name || 'Item'}`).join('\n')
    }`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping List: ${list.name}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      handleCopyList(list);
    }
  };

  const handleCopyList = async (list: SavedList) => {
    const shareText = `Shopping List: ${list.name}\n\nItems:\n${
      list.items.map((item: any) => `• ${item.name || 'Item'}`).join('\n')
    }`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'List copied',
        description: 'Shopping list copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard'
      });
    }
  };

  const handleEditList = (list: SavedList) => {
    setEditingList(list);
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingList || !event.target.files || event.target.files.length === 0) return;

    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `list-bg-${editingList.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('saved_lists')
        .update({ background_image_url: data.publicUrl })
        .eq('id', editingList.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Background image uploaded successfully'
      });

      loadSavedLists();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload background image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleReminderUpdate = async (reminderDate: string, reminderEmail: boolean) => {
    if (!editingList) return;

    try {
      const { error } = await supabase
        .from('saved_lists')
        .update({ 
          reminder_date: reminderDate || null,
          reminder_email: reminderEmail
        })
        .eq('id', editingList.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Reminder settings updated'
      });

      loadSavedLists();
      setEditingList(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reminder settings',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Your Saved Lists</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 max-w-7xl mx-auto w-full">
        {savedLists.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">You don't have any saved lists yet</p>
            <Link 
              to="/" 
              className="inline-block bg-app-green text-white px-4 py-2 rounded-md"
            >
              Start Comparing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {savedLists.map(list => {
              const listItems = Array.isArray(list.items) ? list.items : [];
              const previewItems = listItems.slice(0, 4);
              const isExpanded = expandedLists.has(list.id);
              const hasMoreItems = listItems.length > 4;
              
              return (
                <div key={list.id} className="relative">
                  {/* Pin */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <Pin className="h-6 w-6 text-red-500 fill-red-500 rotate-45" />
                  </div>
                  
                  {/* Three dots menu in top right corner */}
                  <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDeleteList(list.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Card with shadow and slight rotation for natural look */}
                  <Card 
                    className="transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-lg hover:shadow-xl border-yellow-200 min-h-[300px] relative overflow-hidden"
                    style={{
                      background: list.background_image_url 
                        ? `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${list.background_image_url})` 
                        : 'rgb(254, 252, 232)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <CardContent className="p-4 pt-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h2 className="font-bold text-lg text-gray-900 mb-1">{list.name}</h2>
                        <div className="flex items-center text-sm text-gray-700 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="font-medium">{formatDate(list.created_at)}</span>
                          <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {listItems.length} items
                          </span>
                        </div>
                        {/* Reminder indicator */}
                        {list.reminder_date && (
                          <div className="flex items-center text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full w-fit">
                            <Bell className="h-3 w-3 mr-1" />
                            Reminder: {formatDate(list.reminder_date)}
                          </div>
                        )}
                      </div>
                      
                      {/* Items Preview */}
                      <div className="space-y-2 mb-4 flex-1">
                        {previewItems.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded border flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {item?.name?.[0]?.toUpperCase() || '•'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">
                                {item?.name || `Item ${index + 1}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expanded Items */}
                      {isExpanded && hasMoreItems && (
                        <div className="space-y-2 mb-4 pb-3 border-t border-yellow-300 pt-3">
                          {listItems.slice(4).map((item: any, index: number) => (
                            <div key={index + 4} className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded border flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {item?.name?.[0]?.toUpperCase() || '•'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {item?.name || `Item ${index + 5}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show All/Show Less Button */}
                      {hasMoreItems && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toggleExpandList(list.id)}
                          className="w-full mb-3 border-yellow-400 hover:bg-yellow-100 font-medium text-gray-800"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show All ({listItems.length - 4} more)
                            </>
                          )}
                        </Button>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                          onClick={() => handleCheckListPrices(listItems)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Check List Prices
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 border-yellow-400 hover:bg-yellow-100 font-medium text-gray-800"
                            onClick={() => handleEditList(list)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 border-yellow-400 hover:bg-yellow-100 font-medium text-gray-800"
                            onClick={() => handleShareList(list)}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 border-yellow-400 hover:bg-yellow-100 font-medium text-gray-800"
                            onClick={() => handleCopyList(list)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit List Dialog */}
      <Dialog open={!!editingList} onOpenChange={() => setEditingList(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize List: {editingList?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Background Image Upload */}
            <div>
              <Label htmlFor="background-upload" className="text-sm font-medium">
                Background Image
              </Label>
              <div className="mt-2">
                {editingList?.background_image_url && (
                  <div className="mb-2">
                    <img 
                      src={editingList.background_image_url} 
                      alt="Background preview" 
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                )}
                <label htmlFor="background-upload">
                  <Button variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      <Image className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Change Background'}
                    </span>
                  </Button>
                </label>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Reminder Settings */}
            <div>
              <Label className="text-sm font-medium">Reminder Settings</Label>
              <div className="mt-2 space-y-3">
                <div>
                  <Label htmlFor="reminder-date" className="text-xs text-muted-foreground">
                    Reminder Date
                  </Label>
                  <Input
                    id="reminder-date"
                    type="date"
                    defaultValue={editingList?.reminder_date || ''}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const dateInput = document.getElementById('reminder-date') as HTMLInputElement;
                    handleReminderUpdate(dateInput.value, editingList?.reminder_email || false);
                  }}
                  className="w-full"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Save Reminder
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default ChecklistPage;
