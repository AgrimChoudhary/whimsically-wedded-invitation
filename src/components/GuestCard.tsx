
import React from 'react';
import { Phone, Copy, Edit, Trash, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: string | null;
  created_at: string;
  updated_at: string | null;
}

interface GuestCardProps {
  guest: Guest;
  onUpdate: () => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onUpdate }) => {
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
        Pending
      </Badge>
    );
    
    switch (status) {
      case 'viewed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Viewed
          </Badge>
        );
      case 'confirmed':
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Confirmed
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Declined
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const handleCopy = async () => {
    const inviteUrl = `${window.location.origin}/${guest.id}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast({
      title: "Link copied!",
      description: "Invitation link copied to clipboard",
    });
  };

  const handleShare = async () => {
    const inviteUrl = `${window.location.origin}/${guest.id}`;
    const shareText = `You're invited to our wedding! ${inviteUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Invitation',
          text: shareText,
          url: inviteUrl,
        });
      } catch (error) {
        // Fallback to copy
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Shared!",
          description: "Invitation details copied to clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Shared!",
        description: "Invitation details copied to clipboard",
      });
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${guest.name}?`)) {
      try {
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', guest.id);
        
        if (error) throw error;
        
        toast({
          title: "Guest deleted",
          description: `${guest.name} has been removed from the guest list`,
        });
        onUpdate();
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: "Error",
          description: "Failed to delete guest",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="border border-wedding-gold/20 rounded-lg overflow-hidden bg-white/95 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center p-3 border-b border-wedding-gold/10 bg-wedding-cream/30">
        <div className="flex flex-col">
          <h3 className="font-medium text-wedding-maroon truncate">{guest.name}</h3>
          {getStatusBadge(guest.status)}
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4 text-sm flex items-center">
          <Phone size={14} className="mr-2 text-wedding-gold" />
          {guest.mobile}
        </p>
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-wedding-maroon hover:bg-wedding-cream"
            onClick={handleCopy}
            title="Copy Link"
          >
            <Copy size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-green-600 hover:bg-green-50"
            onClick={handleShare}
            title="Share"
          >
            <Share2 size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
