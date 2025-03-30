
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Copy, Heart, Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const formSchema = z.object({
  brideName: z.string().min(2, {
    message: "Bride's name must be at least 2 characters.",
  }),
  groomName: z.string().min(2, {
    message: "Groom's name must be at least 2 characters.",
  }),
  weddingDate: z.string().min(1, {
    message: "Wedding date is required",
  }),
  weddingVenue: z.string().min(5, {
    message: "Venue name must be at least 5 characters.",
  }),
  weddingAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  customMessage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomizeForm: React.FC = () => {
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: '',
      groomName: '',
      weddingDate: '',
      weddingVenue: '',
      weddingAddress: '',
      customMessage: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a unique ID for the invitation
      const invitationId = Math.random().toString(36).substring(2, 15);
      const linkUrl = `${window.location.origin}/invitation?id=${invitationId}&bride=${encodeURIComponent(data.brideName)}&groom=${encodeURIComponent(data.groomName)}`;
      
      setInvitationLink(linkUrl);
      toast({
        title: "Invitation Created!",
        description: "Your custom wedding invitation has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not create invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast({
        title: "Link Copied!",
        description: "Invitation link copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-wedding-cream/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-wedding-maroon mb-2">Create Your Custom Wedding Invitation</h1>
          <p className="text-gray-600">Fill in the details below to customize the wedding invitation for your clients</p>
        </div>
        
        <Card className="border-wedding-gold/20 shadow-gold-soft">
          <CardHeader className="bg-wedding-gold/5">
            <CardTitle className="flex items-center gap-2 text-wedding-maroon">
              <Heart className="text-wedding-gold" size={18} />
              Wedding Details
            </CardTitle>
            <CardDescription>
              Customize your wedding invitation with personal details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brideName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-wedding-maroon">Bride's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bride's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="groomName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-wedding-maroon">Groom's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter groom's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="weddingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-wedding-maroon">
                        <div className="flex items-center gap-2">
                          <span>Wedding Date</span>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Info size={14} className="text-gray-400 cursor-help" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <p className="text-sm">
                                Enter the date in DD/MM/YYYY format or use the calendar selector
                              </p>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            placeholder="DD/MM/YYYY"
                            {...field}
                            className="pr-10"
                          />
                          <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weddingVenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-wedding-maroon">Wedding Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue name (e.g. Grand Pavilion)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weddingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-wedding-maroon">Venue Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter complete venue address" 
                          className="resize-none" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-wedding-maroon">Custom Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a custom message for the invitation" 
                          className="resize-none" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Invitation...
                    </>
                  ) : (
                    "Create Wedding Invitation"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          {invitationLink && (
            <CardFooter className="flex flex-col space-y-4 border-t border-wedding-gold/20 bg-wedding-gold/5 p-6">
              <div className="w-full">
                <h3 className="text-wedding-maroon font-medium mb-2">Your Custom Invitation Link:</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="w-full p-2 border border-wedding-gold/30 rounded bg-white/80 text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="border-wedding-gold/30 hover:bg-wedding-gold/10"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Share this link with your clients to view their personalized invitation
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomizeForm;
