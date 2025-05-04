
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { FloatingPetals } from '@/components/AnimatedElements';
import { GuestCard } from '@/components/GuestCard';
import { TemplateSelector } from '@/components/TemplateSelector';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Define the schema for the guest form
const createGuestSchema = z.object({
  name: z.string().min(2, 'Name should be at least 2 characters'),
  mobile: z.string().min(10, 'Mobile number should be at least 10 digits'),
});

type CreateGuestForm = z.infer<typeof createGuestSchema>;

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status: string | null;
  invitation_id: string | null;
}

const GuestManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invitationId = queryParams.get('invitationId');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showCreateGuestForm, setShowCreateGuestForm] = useState(false);
  const queryClient = useQueryClient();

  // Form for creating new guests
  const form = useForm<CreateGuestForm>({
    resolver: zodResolver(createGuestSchema),
    defaultValues: {
      name: '',
      mobile: '',
    },
  });
  
  // Query to get guests list
  const getGuestsList = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Guest[];
    } catch (error) {
      console.error('Error fetching guests:', error);
      return [];
    }
  };
  
  const guestsListQuery = useQuery({
    queryKey: ['guests', invitationId],
    queryFn: getGuestsList,
    enabled: !!invitationId,
  });

  // Message templates
  const messageTemplates = [
    {
      name: "Formal Invitation",
      template: "We request the honor of your presence at our wedding ceremony."
    },
    {
      name: "Casual Invitation",
      template: "Join us as we celebrate our special day!"
    },
    {
      name: "Detailed Invitation",
      template: "You are cordially invited to join us for our wedding ceremony and reception. We would be delighted to have you share in our joy."
    },
    {
      name: "Personal Message",
      template: "Dear Friend, your presence at our wedding would mean the world to us. We hope you can join us for this special celebration."
    }
  ];

  useEffect(() => {
    // If no invitationId in URL, check if we have one in localStorage
    if (!invitationId) {
      const storedInvitationId = localStorage.getItem('currentInvitationId');
      if (storedInvitationId) {
        navigate(`/guest-management?invitationId=${storedInvitationId}`);
        return;
      }
    } else {
      // Store the current invitationId in localStorage
      localStorage.setItem('currentInvitationId', invitationId);
    }
    
    setIsLoading(false);
  }, [invitationId, navigate]);
  
  // Handle template selection
  const handleTemplateSelect = (template: string, name: string) => {
    setSelectedTemplate(template);
    setSelectedTemplateName(name);
    setMessage(template);
  };
  
  // Handle opening the create guest form
  const handleAddGuestClick = () => {
    setShowCreateGuestForm(true);
  };

  // Handle submitting the guest form
  const onSubmitGuestForm = async (values: CreateGuestForm) => {
    if (!invitationId) {
      toast({
        title: "Error",
        description: "No invitation ID found. Please go to dashboard and select an invitation.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingGuest(true);
    
    try {
      // Generate a simple random ID for the guest (5 characters)
      const guestId = Math.random().toString(36).substring(2, 7);
      
      const { error } = await supabase
        .from('guests')
        .insert({
          id: guestId,
          name: values.name,
          mobile: values.mobile,
          status: 'pending',
          invitation_id: invitationId
        });
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Guest added successfully",
      });
      
      // Refresh the guests list
      queryClient.invalidateQueries({
        queryKey: ['guests', invitationId],
      });
      
      form.reset();
      setShowCreateGuestForm(false);
    } catch (error) {
      console.error('Error creating guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingGuest(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pattern-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-wedding-maroon mb-4" />
          <p className="text-wedding-maroon">Loading guest management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-background py-8">
      <FloatingPetals />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard/' + invitationId)}
            className="flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-playfair text-wedding-maroon text-center flex-1">
            Guest Management
          </h1>
          <div className="w-8 sm:w-20"></div> {/* Spacer for balance */}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-lg max-w-4xl mx-auto mb-8">
          {!invitationId ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-4">
                Please access this page from your dashboard to manage guests for a specific invitation.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
              >
                Go to Home
              </Button>
            </div>
          ) : (
            <>
              {showCreateGuestForm ? (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-wedding-maroon mb-4">Add New Guest</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitGuestForm)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter guest's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter guest's mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                          type="submit"
                          className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                          disabled={isSubmittingGuest}
                        >
                          {isSubmittingGuest && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Add Guest
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateGuestForm(false)}
                          className="border-wedding-gold text-wedding-maroon"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className="mb-8 text-center">
                  <p className="text-wedding-gold font-dancing-script text-xl mb-4">
                    Manage your wedding guests and track RSVPs
                  </p>
                  <Button
                    onClick={handleAddGuestClick}
                    className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                  >
                    Add New Guest
                  </Button>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-wedding-maroon mb-4">Guest List</h2>
                
                {guestsListQuery.isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="animate-spin mx-auto h-8 w-8 text-wedding-maroon mb-2" />
                    <p className="text-wedding-maroon">Loading guests...</p>
                  </div>
                ) : guestsListQuery.data?.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-wedding-gold/30 rounded-lg">
                    <p className="text-gray-500">No guests added yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guestsListQuery.data?.map((guest) => (
                      <GuestCard 
                        key={guest.id} 
                        guest={guest} 
                        invitationId={invitationId as string}
                        onDelete={() => {
                          queryClient.invalidateQueries({
                            queryKey: ['guests', invitationId],
                          });
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-wedding-maroon mb-4">Message Templates</h2>
                <p className="text-gray-600 mb-4">
                  Select a template for your invitation messages or write a custom one.
                </p>
                
                <TemplateSelector 
                  templates={messageTemplates}
                  selectedTemplate={selectedTemplateName}
                  onSelect={handleTemplateSelect}
                />
                
                <div className="mt-4">
                  <Label htmlFor="custom-message" className="mb-2 block">
                    Customize Message
                  </Label>
                  <Textarea
                    id="custom-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your custom invitation message here..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  className="mt-4 bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                  onClick={() => {
                    toast({
                      title: "Message Saved",
                      description: "Your custom message has been saved.",
                    });
                  }}
                >
                  <Check size={16} className="mr-2" />
                  Save Message
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestManagement;
