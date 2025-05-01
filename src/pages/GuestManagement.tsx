
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Heart, Trash, Copy, X, Plus, Check, User, Phone, Link, Eye, Share } from 'lucide-react';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: 'viewed' | 'accepted' | null;
  created_at?: string;
  updated_at?: string;
}

const GuestManagement = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Fetch existing guests
  useEffect(() => {
    fetchGuests();
  }, []);
  
  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to load guest list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !mobile.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and mobile number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{ 
          name, 
          mobile,
          status: null,
          updated_at: null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Guest added successfully",
        variant: "default",
      });
      
      // Reset the form
      setName('');
      setMobile('');
      
      // Refresh guest list
      fetchGuests();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setGuests(guests.filter(guest => guest.id !== id));
      
      toast({
        title: "Guest removed",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest",
        variant: "destructive",
      });
    }
  };
  
  const getGuestLink = (guestId: string) => {
    // Get the base URL of the site
    const baseUrl = window.location.origin;
    // Create the guest-specific link
    return `${baseUrl}/${guestId}`;
  };

  const copyGuestLink = (guestId: string) => {
    // Get the welcome link
    const welcomeLink = getGuestLink(guestId);
    
    // Copy to clipboard
    navigator.clipboard.writeText(welcomeLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Guest invitation link has been copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };

  const shareOnWhatsApp = (guest: Guest) => {
    const welcomeLink = getGuestLink(guest.id);
    const message = encodeURIComponent(
      `Dear ${guest.name},\n\nYou are cordially invited to the wedding ceremony of Umashankar & Bhavana on April 29, 2025.\n\nClick here to view your personalized invitation: ${welcomeLink}\n\nWe look forward to celebrating our special day with you!`
    );
    
    // Format the phone number (remove any non-digits)
    let phoneNumber = guest.mobile.replace(/\D/g, "");
    // If it doesn't start with a country code, add India's country code
    if (!phoneNumber.startsWith("+") && !phoneNumber.startsWith("00")) {
      phoneNumber = "91" + phoneNumber;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'viewed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Eye size={12} className="mr-1" /> Viewed
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check size={12} className="mr-1" /> Accepted
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pattern-background">
      <FloatingPetals />
      
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="font-great-vibes text-3xl sm:text-4xl text-wedding-maroon mb-2">Guest Management</h1>
            <p className="text-gray-600">Create personalized invitation links for your guests</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              variant="outline" 
              className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
              onClick={() => navigate('/')}
            >
              <Heart size={16} className="mr-2 text-wedding-blush" />
              Welcome Page
            </Button>
            
            <Button 
              variant="outline" 
              className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
              onClick={() => navigate('/invitation')}
            >
              <Heart size={16} className="mr-2 text-wedding-blush" />
              Invitation
            </Button>
          </div>
        </div>
        
        <div className="glass-card mb-8 relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-wedding-gold/50 rounded-tl-lg"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-wedding-gold/50 rounded-tr-lg"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-wedding-gold/50 rounded-bl-lg"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-wedding-gold/50 rounded-br-lg"></div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="font-playfair text-xl text-wedding-maroon mb-4 text-center">
              <Plus size={18} className="inline-block mr-2 text-wedding-gold" />
              Add New Guest
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-wedding-gold flex-shrink-0" />
                <Input
                  placeholder="Guest Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-wedding-gold flex-shrink-0" />
                <Input
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add Guest
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="glass-card">
          <div className="p-6">
            <h2 className="font-playfair text-xl text-wedding-maroon mb-4 text-center">
              <User size={18} className="inline-block mr-2 text-wedding-gold" />
              Guest List
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="loading-spinner mb-4"></div>
                <p className="text-wedding-maroon font-dancing-script text-xl ml-3">Loading guests...</p>
              </div>
            ) : guests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User size={48} className="mx-auto mb-2 opacity-30" />
                <p>No guests added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id} className="hover:bg-wedding-cream/30 transition-colors">
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>{guest.mobile}</TableCell>
                        <TableCell>
                          {getStatusBadge(guest.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-wedding-gold/20 text-wedding-maroon hover:bg-wedding-cream"
                                    onClick={() => copyGuestLink(guest.id)}
                                  >
                                    <Copy size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy invitation link</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-wedding-gold/20 text-green-600 hover:bg-green-50"
                                    onClick={() => shareOnWhatsApp(guest)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                    </svg>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Share on WhatsApp</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 border-wedding-gold/20 text-wedding-maroon hover:bg-red-50"
                                    onClick={() => deleteGuest(guest.id)}
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete guest</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestManagement;
