
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, UserMinus, Copy, Check, User, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Guest {
  id: string;
  name: string;
}

interface GuestTableProps {
  invitationId: string;
}

const GuestTable: React.FC<GuestTableProps> = ({ invitationId }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch guests from Supabase
  useEffect(() => {
    async function fetchGuests() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('guests')
          .select('id, name')
          .eq('invitation_id', invitationId);
        
        if (error) {
          throw error;
        }
        
        setGuests(data || []);
      } catch (error) {
        console.error('Error fetching guests:', error);
        toast({
          title: "Error",
          description: "Failed to load guests. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    if (invitationId) {
      fetchGuests();
    } else {
      setIsLoading(false);
    }
  }, [invitationId, toast]);

  const handleAddGuest = async () => {
    if (newGuestName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a guest name",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert new guest into Supabase
      const { data, error } = await supabase
        .from('guests')
        .insert({
          name: newGuestName.trim(),
          invitation_id: invitationId,
          mobile: '' // Default empty value
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        setGuests([...guests, data[0]]);
        setNewGuestName('');
        setIsAdding(false);

        toast({
          title: "Success",
          description: "Guest added successfully!",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      // Delete guest from Supabase
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setGuests(guests.filter(guest => guest.id !== id));
      toast({
        title: "Guest Removed",
        description: "Guest has been removed from the list",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyInvitationLink = (guestName: string) => {
    // Create a personalized link with the guest's name
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invitation/${invitationId}?guest=${encodeURIComponent(guestName)}`;
    
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied!",
        description: `Personalized invitation link for ${guestName} copied to clipboard`,
        duration: 3000,
      });
    });
  };

  // Update GuestContext with selected guest
  const handleUpdateGuestContext = (guestName: string) => {
    // This function will be implemented if needed in the future
    console.log(`Set guest context to: ${guestName}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-wedding-maroon">Manage Guests</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus size={16} />
          <span>Add Guest</span>
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 p-3 bg-wedding-cream/50 rounded-md border border-wedding-gold/20">
          <Input
            placeholder="Enter guest name"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            className="border-wedding-gold/30"
          />
          <Button 
            size="sm" 
            onClick={handleAddGuest} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" />
                Adding...
              </>
            ) : 'Add'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setIsAdding(false);
              setNewGuestName('');
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-wedding-gold" />
        </div>
      ) : guests.length > 0 ? (
        <div className="rounded-md border border-wedding-gold/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-wedding-gold/10">
                <TableHead>Guest Name</TableHead>
                <TableHead className="w-[200px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id} className="hover:bg-wedding-cream/50">
                  <TableCell className="flex items-center gap-2">
                    <User size={16} className="text-wedding-maroon opacity-70" />
                    {guest.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 border-wedding-gold/20 hover:bg-wedding-gold/10"
                        onClick={() => {
                          copyInvitationLink(guest.name);
                          setCopiedId(guest.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                      >
                        {copiedId === guest.id ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copiedId === guest.id ? "Copied" : "Copy Invitation Link"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-500"
                        onClick={() => handleDeleteGuest(guest.id)}
                      >
                        <UserMinus size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-6 bg-wedding-cream/30 rounded-md border border-dashed border-wedding-gold/30">
          <User size={32} className="mx-auto text-wedding-gold/40 mb-2" />
          <p className="text-gray-500">No guests added yet</p>
          <Button 
            variant="link" 
            className="text-wedding-maroon mt-1"
            onClick={() => setIsAdding(true)}
          >
            Add your first guest
          </Button>
        </div>
      )}
    </div>
  );
};

export default GuestTable;
