
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trash2, User, Phone, CheckCircle, XCircle, Loader2, Copy, ExternalLink, Clock, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export interface Guest {
  id: string;
  name: string;
  mobile: string;
  status: string | null;
  invitation_id: string | null;
}

export interface GuestCardProps {
  guest: Guest;
  invitationId: string;
  onDelete: () => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, invitationId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guest.id)
        .eq('invitation_id', invitationId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Guest has been removed",
      });
      
      onDelete();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getStatusColor = () => {
    switch (guest.status) {
      case 'accepted':
        return 'text-green-600';
      case 'declined':
        return 'text-red-600';
      case 'viewed':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusLabel = () => {
    switch (guest.status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'viewed':
        return 'Viewed';
      default:
        return 'Pending';
    }
  };
  
  const getStatusIcon = () => {
    switch (guest.status) {
      case 'accepted':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'declined':
        return <XCircle size={16} className="text-red-600" />;
      case 'viewed':
        return <Eye size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  const copyInvitationLink = () => {
    const guestLink = `${window.location.origin}/invitation/${invitationId}-${guest.id}`;
    navigator.clipboard.writeText(guestLink);
    setIsCopied(true);
    
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const openInvitationLink = () => {
    const guestLink = `${window.location.origin}/invitation/${invitationId}-${guest.id}`;
    window.open(guestLink, '_blank');
  };
  
  return (
    <Card className="bg-white border-wedding-gold/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-wedding-maroon flex items-center">
              <User size={16} className="mr-1" />
              {guest.name}
            </h3>
            <p className="text-gray-600 text-sm flex items-center mt-1">
              <Phone size={14} className="mr-1" />
              {guest.mobile}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor()} bg-opacity-10`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusLabel()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs border-wedding-gold/50 text-wedding-maroon"
            onClick={copyInvitationLink}
          >
            {isCopied ? <CheckCircle size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
            Copy Link
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="text-xs border-wedding-gold/50 text-wedding-maroon"
            onClick={openInvitationLink}
          >
            <ExternalLink size={14} className="mr-1" />
            View
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} className="mr-1" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove {guest.name} from your guest list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestCard;
