
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Calendar, Copy, Heart, Upload, User, Users, Image, MapPin, CalendarRange, Sparkles, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  // Couple Info
  brideName: z.string().min(2, { message: "Bride's name must be at least 2 characters." }),
  brideAbout: z.string().min(10, { message: "Please provide a short description about the bride." }),
  groomName: z.string().min(2, { message: "Groom's name must be at least 2 characters." }),
  groomAbout: z.string().min(10, { message: "Please provide a short description about the groom." }),
  coupleStory: z.string().min(20, { message: "The love story should be at least 20 characters." }),
  
  // Wedding Details
  weddingDate: z.string().min(1, { message: "Wedding date is required" }),
  weddingTime: z.string().min(1, { message: "Wedding time is required" }),
  weddingVenue: z.string().min(5, { message: "Venue name must be at least 5 characters." }),
  weddingAddress: z.string().min(10, { message: "Address must be at least 10 characters." }),
  mapUrl: z.string().url({ message: "Please enter a valid URL for the venue location" }).optional().or(z.literal('')),
  
  // Family Details
  brideParents: z.string().min(5, { message: "Please add bride's parents names." }),
  brideFamily: z.string().optional(),
  groomParents: z.string().min(5, { message: "Please add groom's parents names." }),
  groomFamily: z.string().optional(),
  
  // Events
  sangeethDate: z.string().optional(),
  sangeethVenue: z.string().optional(),
  mehndiDate: z.string().optional(),
  mehndiVenue: z.string().optional(),
  haldiFunctionDate: z.string().optional(),
  haldiFunctionVenue: z.string().optional(),
  receptionDate: z.string().optional(),
  receptionVenue: z.string().optional(),
  
  // Custom Message
  customMessage: z.string().optional(),
  
  // RSVP Details
  rsvpEmail: z.string().email({ message: "Please enter a valid email for RSVP." }).optional().or(z.literal('')),
  rsvpPhone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CustomizeForm: React.FC = () => {
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupleImageFile, setCoupleImageFile] = useState<File | null>(null);
  const [coupleImagePreview, setCoupleImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideName: '',
      brideAbout: '',
      groomName: '',
      groomAbout: '',
      coupleStory: '',
      weddingDate: '',
      weddingTime: '',
      weddingVenue: '',
      weddingAddress: '',
      mapUrl: '',
      brideParents: '',
      brideFamily: '',
      groomParents: '',
      groomFamily: '',
      sangeethDate: '',
      sangeethVenue: '',
      mehndiDate: '',
      mehndiVenue: '',
      haldiFunctionDate: '',
      haldiFunctionVenue: '',
      receptionDate: '',
      receptionVenue: '',
      customMessage: '',
      rsvpEmail: '',
      rsvpPhone: '',
    },
  });

  const handleCoupleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoupleImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setCoupleImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCoupleImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `couple_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('wedding_images')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('wedding_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const saveEvents = async (invitationId: string, data: FormValues) => {
    const events = [];
    
    // Sangeet event
    if (data.sangeethDate || data.sangeethVenue) {
      events.push({
        invitation_id: invitationId,
        event_name: 'Sangeet Ceremony',
        event_date: data.sangeethDate || null,
        event_time: null,
        event_venue: data.sangeethVenue || null,
        event_address: null
      });
    }
    
    // Mehndi event
    if (data.mehndiDate || data.mehndiVenue) {
      events.push({
        invitation_id: invitationId,
        event_name: 'Mehndi Ceremony',
        event_date: data.mehndiDate || null,
        event_time: null,
        event_venue: data.mehndiVenue || null,
        event_address: null
      });
    }
    
    // Haldi event
    if (data.haldiFunctionDate || data.haldiFunctionVenue) {
      events.push({
        invitation_id: invitationId,
        event_name: 'Haldi Ceremony',
        event_date: data.haldiFunctionDate || null,
        event_time: null,
        event_venue: data.haldiFunctionVenue || null,
        event_address: null
      });
    }
    
    // Reception event
    if (data.receptionDate || data.receptionVenue) {
      events.push({
        invitation_id: invitationId,
        event_name: 'Reception',
        event_date: data.receptionDate || null,
        event_time: null,
        event_venue: data.receptionVenue || null,
        event_address: null
      });
    }
    
    // Save events to database if there are any
    if (events.length > 0) {
      const { error } = await supabase
        .from('wedding_events')
        .insert(events);
      
      if (error) {
        console.error('Error saving events:', error);
        throw error;
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Upload couple image if provided
      let coupleImageUrl = null;
      if (coupleImageFile) {
        coupleImageUrl = await uploadCoupleImage(coupleImageFile);
      }
      
      // Insert wedding invitation data
      const { data: invitationData, error } = await supabase
        .from('wedding_invitations')
        .insert({
          bride_name: data.brideName,
          bride_about: data.brideAbout,
          groom_name: data.groomName,
          groom_about: data.groomAbout,
          couple_story: data.coupleStory,
          wedding_date: data.weddingDate,
          wedding_time: data.weddingTime,
          wedding_venue: data.weddingVenue,
          wedding_address: data.weddingAddress,
          map_url: data.mapUrl || null,
          bride_parents: data.brideParents,
          bride_family: data.brideFamily || null,
          groom_parents: data.groomParents,
          groom_family: data.groomFamily || null,
          rsvp_email: data.rsvpEmail || null,
          rsvp_phone: data.rsvpPhone || null,
          custom_message: data.customMessage || null,
          couple_image_url: coupleImageUrl,
          gallery_images: []
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Save events
      await saveEvents(invitationData.id, data);
      
      // Generate invitation link
      const invitationId = invitationData.id;
      const linkUrl = `${window.location.origin}/invitation/${invitationId}`;
      
      setInvitationLink(linkUrl);
      toast({
        title: "Invitation Created!",
        description: "Your custom wedding invitation has been created successfully.",
      });
    } catch (error) {
      console.error('Error saving invitation:', error);
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
    <div className="min-h-screen bg-wedding-cream/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-wedding-maroon mb-2">Create Custom Wedding Invitation</h1>
          <p className="text-gray-600">Fill in the details below to create a personalized wedding invitation</p>
        </div>
        
        <Card className="border-wedding-gold/20 shadow-gold-soft">
          <CardHeader className="bg-wedding-gold/5">
            <CardTitle className="flex items-center gap-2 text-wedding-maroon">
              <Heart className="text-wedding-gold" size={18} />
              Wedding Invitation Customization
            </CardTitle>
            <CardDescription>
              Create a personalized wedding invitation by filling in all the details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="couple-info" className="w-full">
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
                    <TabsTrigger value="couple-info" className="flex gap-1 items-center">
                      <Users size={16} /> Couple
                    </TabsTrigger>
                    <TabsTrigger value="wedding-details" className="flex gap-1 items-center">
                      <Calendar size={16} /> Wedding
                    </TabsTrigger>
                    <TabsTrigger value="family-details" className="flex gap-1 items-center">
                      <User size={16} /> Family
                    </TabsTrigger>
                    <TabsTrigger value="events-photos" className="flex gap-1 items-center">
                      <CalendarRange size={16} /> Events
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Couple Information */}
                  <TabsContent value="couple-info" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <h3 className="text-wedding-maroon font-medium flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-wedding-gold" />
                        Couple Information
                      </h3>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-wedding-maroon mb-3">Couple Photo</h4>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-wedding-gold/20 flex items-center justify-center">
                            {coupleImagePreview ? (
                              <img src={coupleImagePreview} alt="Couple Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Users size={32} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleCoupleImageChange}
                              className="text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Upload a photo of the couple (max 5MB)
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
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
                            name="brideAbout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">About the Bride</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="A short description about the bride" 
                                    className="resize-none" 
                                    rows={3}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Education, profession, hobbies, etc.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
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
                          
                          <FormField
                            control={form.control}
                            name="groomAbout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">About the Groom</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="A short description about the groom" 
                                    className="resize-none" 
                                    rows={3}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Education, profession, hobbies, etc.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <FormField
                          control={form.control}
                          name="coupleStory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">Love Story</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Share how the couple met and their journey together" 
                                  className="resize-none" 
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                This will be displayed in the couple's section of the invitation.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Wedding Details */}
                  <TabsContent value="wedding-details" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <h3 className="text-wedding-maroon font-medium flex items-center gap-2 mb-4">
                        <Calendar size={16} className="text-wedding-gold" />
                        Wedding Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FormField
                          control={form.control}
                          name="weddingDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">Wedding Date</FormLabel>
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
                          name="weddingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">Wedding Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="HH:MM"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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
                      
                      <div className="mt-4">
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
                      </div>
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="mapUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">Google Maps URL (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="https://maps.google.com/..." 
                                    {...field} 
                                    className="pl-10"
                                  />
                                  <MapPin 
                                    size={16} 
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Paste a Google Maps link to the venue location
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                          control={form.control}
                          name="rsvpEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">RSVP Email (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Email for RSVPs" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="rsvpPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-wedding-maroon">RSVP Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone number for RSVPs" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Family Details */}
                  <TabsContent value="family-details" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <h3 className="text-wedding-maroon font-medium flex items-center gap-2 mb-4">
                        <Users size={16} className="text-wedding-gold" />
                        Family Details
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3">Bride's Family</h4>
                          <FormField
                            control={form.control}
                            name="brideParents"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">Bride's Parents</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Daughter of Mr. & Mrs. Sharma" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="brideFamily"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Extended Family (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Grandparents, siblings, etc." 
                                      className="resize-none" 
                                      rows={3}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div>
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3">Groom's Family</h4>
                          <FormField
                            control={form.control}
                            name="groomParents"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">Groom's Parents</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Son of Mr. & Mrs. Patel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name="groomFamily"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Extended Family (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Grandparents, siblings, etc." 
                                      className="resize-none" 
                                      rows={3}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Events & Photos */}
                  <TabsContent value="events-photos" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <h3 className="text-wedding-maroon font-medium flex items-center gap-2 mb-4">
                        <CalendarRange size={16} className="text-wedding-gold" />
                        Wedding Events
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Mehndi */}
                        <div className="p-3 border border-wedding-gold/20 rounded-md">
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3 flex items-center gap-2">
                            <div className="w-4 h-4 bg-wedding-blush rounded-full"></div>
                            Mehndi Function
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="mehndiDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Date (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="mehndiVenue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Venue (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Venue name and address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        {/* Sangeet */}
                        <div className="p-3 border border-wedding-gold/20 rounded-md">
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3 flex items-center gap-2">
                            <div className="w-4 h-4 bg-wedding-gold rounded-full"></div>
                            Sangeet Ceremony
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="sangeethDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Date (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="sangeethVenue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Venue (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Venue name and address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        {/* Haldi */}
                        <div className="p-3 border border-wedding-gold/20 rounded-md">
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3 flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            Haldi Ceremony
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="haldiFunctionDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Date (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="haldiFunctionVenue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Venue (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Venue name and address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        {/* Reception */}
                        <div className="p-3 border border-wedding-gold/20 rounded-md">
                          <h4 className="text-sm font-medium text-wedding-maroon mb-3 flex items-center gap-2">
                            <div className="w-4 h-4 bg-wedding-lavender rounded-full"></div>
                            Reception
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="receptionDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Date (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="receptionVenue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-wedding-maroon">Venue (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Venue name and address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
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
                              <FormDescription>
                                This message will appear in the invitation.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-wedding-maroon mb-3 flex items-center gap-2">
                          <Image size={16} className="text-wedding-gold" />
                          Gallery Photos
                        </h4>
                        <div className="bg-wedding-gold/5 border border-dashed border-wedding-gold/30 rounded-md p-6 text-center">
                          <Upload className="w-8 h-8 text-wedding-gold/50 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">
                            Multi-photo upload functionality is coming soon. You can upload the couple's main photo above.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  type="submit" 
                  className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Creating Invitation...
                    </span>
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
