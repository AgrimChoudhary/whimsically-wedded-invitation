
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import GuestForm from '@/components/GuestForm';
import GuestCard from '@/components/GuestCard';
import { ArrowLeft, Search, Users, UserPlus, BarChart3, Share2, Copy, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}

const GuestManagement = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({ name: '', mobile: '' });
  
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching guests:', error);
        toast({
          title: "Error",
          description: "Failed to fetch guests",
          variant: "destructive",
        });
      } else {
        setGuests(data || []);
      }
    } catch (error) {
      console.error('Error in fetchGuests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.mobile.includes(searchTerm)
  );

  const copyGuestLink = (guestId: string) => {
    const link = `${window.location.origin}/${guestId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Guest invitation link copied to clipboard",
    });
  };

  const shareGuest = (guest: Guest) => {
    const link = `${window.location.origin}/${guest.id}`;
    const message = `You're invited to ${guest.name}'s wedding! Click here to view: ${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Wedding Invitation',
        text: message,
        url: link
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Invitation Copied",
        description: "Wedding invitation message copied to clipboard",
      });
    }
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setEditForm({ name: guest.name, mobile: guest.mobile });
  };

  const saveEditGuest = async () => {
    if (!editingGuest) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: editForm.name,
          mobile: editForm.mobile,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGuest.id);
      
      if (error) {
        console.error('Error updating guest:', error);
        toast({
          title: "Error",
          description: "Failed to update guest",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Guest updated successfully",
        });
        setEditingGuest(null);
        fetchGuests();
      }
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  const deleteGuest = async (guest: Guest) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guest.id);
      
      if (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: "Error",
          description: "Failed to delete guest",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Guest deleted successfully",
        });
        fetchGuests();
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  // Statistics
  const totalGuests = guests.length;
  const acceptedGuests = guests.filter(g => g.status === 'accepted').length;
  const viewedGuests = guests.filter(g => g.status === 'viewed').length;
  const pendingGuests = guests.filter(g => !g.status).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-wedding-blush/20 to-wedding-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-wedding-gold/30"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-great-vibes text-wedding-maroon">Guest Management</h1>
              <p className="text-gray-600">Manage your wedding guest list</p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-wedding-gold hover:bg-wedding-deep-gold">
                <UserPlus size={16} className="mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
              </DialogHeader>
              <GuestForm onSuccess={() => {
                fetchGuests();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-wedding-maroon">{totalGuests}</p>
                </div>
                <Users className="h-8 w-8 text-wedding-gold" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{acceptedGuests}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Viewed</p>
                  <p className="text-2xl font-bold text-blue-600">{viewedGuests}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-600">{pendingGuests}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search guests by name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-wedding-gold/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Guests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Guest List ({filteredGuests.length})</span>
              {searchTerm && (
                <Badge variant="outline" className="text-wedding-maroon">
                  {filteredGuests.length} results
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold"></div>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No guests found' : 'No guests yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first guest to the list.'}
                </p>
                {!searchTerm && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-wedding-gold hover:bg-wedding-deep-gold">
                        <UserPlus size={16} className="mr-2" />
                        Add Your First Guest
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Guest</DialogTitle>
                      </DialogHeader>
                      <GuestForm onSuccess={() => {
                        fetchGuests();
                      }} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuests.map((guest) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    onCopy={copyGuestLink}
                    onShare={shareGuest}
                    onEdit={handleEditGuest}
                    onDelete={deleteGuest}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Guest Dialog */}
        <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile</label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Mobile number"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingGuest(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditGuest} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GuestManagement;
