
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Calendar, Copy, Heart, Upload, User, Users, Image, MapPin, CalendarRange, Sparkles, Loader2, Plus, X, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const familyMemberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  relation: z.string().min(2, { message: "Relation must be at least 2 characters." }),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
});

const galleryPhotoSchema = z.object({
  photoUrl: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).optional(),
  description: z.string().optional(),
});

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
  brideExtendedFamily: z.array(familyMemberSchema).optional().default([]),
  groomParents: z.string().min(5, { message: "Please add groom's parents names." }),
  groomFamily: z.string().optional(),
  groomExtendedFamily: z.array(familyMemberSchema).optional().default([]),
  
  // Events
  events: z.array(z.object({
    eventName: z.string().min(2, { message: "Event name is required" }),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    eventVenue: z.string().optional(),
    eventAddress: z.string().optional(),
    venueLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  })).default([]),
  
  // Gallery Photos
  galleryPhotos: z.array(galleryPhotoSchema).max(6, { message: "Maximum 6 photos allowed" }).default([]),
  
  // Custom Message
  customMessage: z.string().optional(),
  
  // Contact Details
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number" }).optional().or(z.literal('')),
  contactEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal('')),
  
  // RSVP Details
  rsvpEmail: z.string().email({ message: "Please enter a valid email for RSVP." }).optional().or(z.literal('')),
  rsvpPhone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CustomizeForm: React.FC = () => {
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupleImageFile, setCoupleImageFile] = useState<File | null>(null);
  const [coupleImagePreview, setCoupleImagePreview] = useState<string | null>(null);
  const [brideExtendedFamilyFiles, setBrideExtendedFamilyFiles] = useState<Record<number, File>>({});
  const [groomExtendedFamilyFiles, setGroomExtendedFamilyFiles] = useState<Record<number, File>>({});
  const [galleryFiles, setGalleryFiles] = useState<Record<number, File>>({});
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
      brideExtendedFamily: [],
      groomParents: '',
      groomFamily: '',
      groomExtendedFamily: [],
      events: [{ 
        eventName: 'Sangeet Ceremony', 
        eventDate: '', 
        eventTime: '', 
        eventVenue: '', 
        eventAddress: '',
        venueLink: ''
      }],
      galleryPhotos: [{ photoUrl: '', title: '', description: '' }],
      customMessage: '',
      contactPhone: '',
      contactEmail: '',
      rsvpEmail: '',
      rsvpPhone: '',
    },
  });

  const brideExtendedFamilyFields = useFieldArray({
    control: form.control,
    name: "brideExtendedFamily"
  });

  const groomExtendedFamilyFields = useFieldArray({
    control: form.control,
    name: "groomExtendedFamily"
  });

  const eventFields = useFieldArray({
    control: form.control,
    name: "events"
  });

  const galleryFields = useFieldArray({
    control: form.control,
    name: "galleryPhotos"
  });

  const handleCoupleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
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

  const handleFamilyMemberImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, isBride: boolean) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (isBride) {
        setBrideExtendedFamilyFiles({
          ...brideExtendedFamilyFiles,
          [index]: file
        });
      } else {
        setGroomExtendedFamilyFiles({
          ...groomExtendedFamilyFiles,
          [index]: file
        });
      }
      
      // Show preview directly in the form
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const familyMembers = isBride 
            ? [...form.getValues().brideExtendedFamily] 
            : [...form.getValues().groomExtendedFamily];
          
          familyMembers[index] = {
            ...familyMembers[index],
            photoUrl: event.target.result as string
          };
          
          if (isBride) {
            form.setValue('brideExtendedFamily', familyMembers);
          } else {
            form.setValue('groomExtendedFamily', familyMembers);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setGalleryFiles({
        ...galleryFiles,
        [index]: file
      });
      
      // Show preview directly in the form
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const photos = [...form.getValues().galleryPhotos];
          photos[index] = {
            ...photos[index],
            photoUrl: event.target.result as string
          };
          form.setValue('galleryPhotos', photos);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
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

  const uploadAllImages = async () => {
    // Upload couple image
    let coupleImageUrl = null;
    if (coupleImageFile) {
      coupleImageUrl = await uploadImage(coupleImageFile, 'couple_images');
    }
    
    // Upload bride family member images
    const brideExtendedFamilyUrls: Record<number, string> = {};
    for (const [index, file] of Object.entries(brideExtendedFamilyFiles)) {
      const url = await uploadImage(file, 'family_images');
      if (url) {
        brideExtendedFamilyUrls[Number(index)] = url;
      }
    }
    
    // Upload groom family member images
    const groomExtendedFamilyUrls: Record<number, string> = {};
    for (const [index, file] of Object.entries(groomExtendedFamilyFiles)) {
      const url = await uploadImage(file, 'family_images');
      if (url) {
        groomExtendedFamilyUrls[Number(index)] = url;
      }
    }
    
    // Upload gallery images
    const galleryPhotoUrls: Record<number, string> = {};
    for (const [index, file] of Object.entries(galleryFiles)) {
      const url = await uploadImage(file, 'gallery_images');
      if (url) {
        galleryPhotoUrls[Number(index)] = url;
      }
    }
    
    return { 
      coupleImageUrl, 
      brideExtendedFamilyUrls, 
      groomExtendedFamilyUrls, 
      galleryPhotoUrls 
    };
  };

  const saveEvents = async (invitationId: string, events: FormValues['events']) => {
    if (events.length === 0) return;
    
    const formattedEvents = events.map(event => ({
      invitation_id: invitationId,
      event_name: event.eventName,
      event_date: event.eventDate || null,
      event_time: event.eventTime || null,
      event_venue: event.eventVenue || null,
      event_address: event.eventAddress || null
    }));
    
    const { error } = await supabase
      .from('wedding_events')
      .insert(formattedEvents);
    
    if (error) {
      console.error('Error saving events:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Upload all images
      const { 
        coupleImageUrl, 
        brideExtendedFamilyUrls, 
        groomExtendedFamilyUrls, 
        galleryPhotoUrls 
      } = await uploadAllImages();
      
      // Update family members with actual image URLs
      const brideExtendedFamilyWithUrls = data.brideExtendedFamily?.map((member, index) => ({
        ...member,
        photoUrl: brideExtendedFamilyUrls[index] || member.photoUrl || null
      }));
      
      const groomExtendedFamilyWithUrls = data.groomExtendedFamily?.map((member, index) => ({
        ...member,
        photoUrl: groomExtendedFamilyUrls[index] || member.photoUrl || null
      }));
      
      // Update gallery photos with actual image URLs
      const galleryPhotosWithUrls = data.galleryPhotos.map((photo, index) => ({
        ...photo,
        photoUrl: galleryPhotoUrls[index] || photo.photoUrl || null
      }));
      
      // Format gallery images as JSON array of strings for storage
      const galleryImages = galleryPhotosWithUrls
        .filter(p => p.photoUrl)
        .map(p => ({
          url: p.photoUrl,
          title: p.title || '',
          description: p.description || ''
        }));
      
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
          bride_family: JSON.stringify(brideExtendedFamilyWithUrls),
          groom_parents: data.groomParents,
          groom_family: JSON.stringify(groomExtendedFamilyWithUrls),
          rsvp_email: data.rsvpEmail || null,
          rsvp_phone: data.rsvpPhone || null,
          custom_message: data.customMessage || null,
          couple_image_url: coupleImageUrl,
          gallery_images: galleryImages,
          contact_phone: data.contactPhone || null,
          contact_email: data.contactEmail || null
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Save events
      await saveEvents(invitationData.id, data.events);
      
      // Generate invitation link
      const invitationId = invitationData.id;
      const linkUrl = `${window.location.origin}/?id=${invitationId}`;
      
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
                  <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4 overflow-x-auto">
                    <TabsTrigger value="couple-info" className="flex gap-1 items-center">
                      <Users size={16} /> Couple
                    </TabsTrigger>
                    <TabsTrigger value="wedding-details" className="flex gap-1 items-center">
                      <Calendar size={16} /> Wedding
                    </TabsTrigger>
                    <TabsTrigger value="family-details" className="flex gap-1 items-center">
                      <User size={16} /> Family
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex gap-1 items-center">
                      <CalendarRange size={16} /> Events
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="flex gap-1 items-center">
                      <Image size={16} /> Gallery
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
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-wedding-maroon mb-3">Contact Information</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">Contact Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contact phone number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Will be displayed with click-to-call feature
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-wedding-maroon">Contact Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contact email address" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Will be displayed with click-to-email feature
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
                                  <FormLabel className="text-wedding-maroon">General Family Description (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="General description of bride's family" 
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
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-wedding-maroon">Extended Family Members</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                                onClick={() => brideExtendedFamilyFields.append({
                                  name: '',
                                  relation: '',
                                  description: '',
                                  photoUrl: ''
                                })}
                              >
                                <Plus size={14} /> Add Member
                              </Button>
                            </div>
                            
                            {brideExtendedFamilyFields.fields.length === 0 && (
                              <p className="text-sm text-gray-500 italic mb-3">
                                No family members added yet. Click "Add Member" to include.
                              </p>
                            )}
                            
                            <div className="space-y-4">
                              {brideExtendedFamilyFields.fields.map((field, index) => (
                                <div key={field.id} className="p-3 border border-wedding-gold/20 rounded-md relative">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                                    onClick={() => brideExtendedFamilyFields.remove(index)}
                                  >
                                    <X size={14} />
                                  </Button>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2 space-y-4">
                                      <FormField
                                        control={form.control}
                                        name={`brideExtendedFamily.${index}.name`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={form.control}
                                        name={`brideExtendedFamily.${index}.relation`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Relation</FormLabel>
                                            <FormControl>
                                              <Input placeholder="e.g. Sister, Brother, Grandmother" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={form.control}
                                        name={`brideExtendedFamily.${index}.description`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Description (Optional)</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                placeholder="Short description" 
                                                className="resize-none" 
                                                rows={2}
                                                {...field} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    
                                    <div className="flex flex-col items-center justify-center">
                                      <FormField
                                        control={form.control}
                                        name={`brideExtendedFamily.${index}.photoUrl`}
                                        render={({ field }) => (
                                          <FormItem className="w-full">
                                            <FormLabel className="text-wedding-maroon">Photo</FormLabel>
                                            <div className="flex flex-col items-center gap-2">
                                              <Avatar className="h-24 w-24 border-2 border-wedding-gold/20">
                                                {field.value ? (
                                                  <AvatarImage src={field.value} alt="Preview" className="object-cover" />
                                                ) : (
                                                  <AvatarFallback className="bg-wedding-blush/20 text-wedding-maroon">
                                                    {index + 1}
                                                  </AvatarFallback>
                                                )}
                                              </Avatar>
                                              <Input 
                                                type="file" 
                                                accept="image/*" 
                                                className="w-full text-xs"
                                                onChange={(e) => handleFamilyMemberImageChange(e, index, true)} 
                                              />
                                            </div>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                                  <FormLabel className="text-wedding-maroon">General Family Description (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="General description of groom's family" 
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
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-wedding-maroon">Extended Family Members</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                                onClick={() => groomExtendedFamilyFields.append({
                                  name: '',
                                  relation: '',
                                  description: '',
                                  photoUrl: ''
                                })}
                              >
                                <Plus size={14} /> Add Member
                              </Button>
                            </div>
                            
                            {groomExtendedFamilyFields.fields.length === 0 && (
                              <p className="text-sm text-gray-500 italic mb-3">
                                No family members added yet. Click "Add Member" to include.
                              </p>
                            )}
                            
                            <div className="space-y-4">
                              {groomExtendedFamilyFields.fields.map((field, index) => (
                                <div key={field.id} className="p-3 border border-wedding-gold/20 rounded-md relative">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                                    onClick={() => groomExtendedFamilyFields.remove(index)}
                                  >
                                    <X size={14} />
                                  </Button>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2 space-y-4">
                                      <FormField
                                        control={form.control}
                                        name={`groomExtendedFamily.${index}.name`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={form.control}
                                        name={`groomExtendedFamily.${index}.relation`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Relation</FormLabel>
                                            <FormControl>
                                              <Input placeholder="e.g. Brother, Sister, Grandfather" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={form.control}
                                        name={`groomExtendedFamily.${index}.description`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-wedding-maroon">Description (Optional)</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                placeholder="Short description" 
                                                className="resize-none" 
                                                rows={2}
                                                {...field} 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    
                                    <div className="flex flex-col items-center justify-center">
                                      <FormField
                                        control={form.control}
                                        name={`groomExtendedFamily.${index}.photoUrl`}
                                        render={({ field }) => (
                                          <FormItem className="w-full">
                                            <FormLabel className="text-wedding-maroon">Photo</FormLabel>
                                            <div className="flex flex-col items-center gap-2">
                                              <Avatar className="h-24 w-24 border-2 border-wedding-gold/20">
                                                {field.value ? (
                                                  <AvatarImage src={field.value} alt="Preview" className="object-cover" />
                                                ) : (
                                                  <AvatarFallback className="bg-wedding-blush/20 text-wedding-maroon">
                                                    {index + 1}
                                                  </AvatarFallback>
                                                )}
                                              </Avatar>
                                              <Input 
                                                type="file" 
                                                accept="image/*" 
                                                className="w-full text-xs"
                                                onChange={(e) => handleFamilyMemberImageChange(e, index, false)} 
                                              />
                                            </div>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Events */}
                  <TabsContent value="events" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-wedding-maroon font-medium flex items-center gap-2">
                          <CalendarRange size={16} className="text-wedding-gold" />
                          Wedding Events
                        </h3>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                          onClick={() => eventFields.append({
                            eventName: '',
                            eventDate: '',
                            eventTime: '',
                            eventVenue: '',
                            eventAddress: '',
                            venueLink: ''
                          })}
                        >
                          <Plus size={14} /> Add Event
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {eventFields.fields.map((field, index) => (
                          <div key={field.id} className="p-4 border border-wedding-gold/20 rounded-md relative">
                            {eventFields.fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                                onClick={() => eventFields.remove(index)}
                              >
                                <X size={14} />
                              </Button>
                            )}
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`events.${index}.eventName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-wedding-maroon">Event Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Mehndi, Sangeet, Reception" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`events.${index}.eventDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-wedding-maroon">Date</FormLabel>
                                      <FormControl>
                                        <Input type="date" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`events.${index}.eventTime`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-wedding-maroon">Time</FormLabel>
                                      <FormControl>
                                        <Input type="time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={form.control}
                                name={`events.${index}.eventVenue`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-wedding-maroon">Venue Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Venue name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`events.${index}.eventAddress`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-wedding-maroon">Venue Address</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Full address of the venue" 
                                        className="resize-none" 
                                        rows={2}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`events.${index}.venueLink`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-wedding-maroon">Venue Map Link (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://maps.google.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Gallery Photos */}
                  <TabsContent value="gallery" className="space-y-6">
                    <div className="bg-wedding-gold/5 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-wedding-maroon font-medium flex items-center gap-2">
                          <Image size={16} className="text-wedding-gold" />
                          Gallery Photos (Max 6)
                        </h3>
                        
                        {galleryFields.fields.length < 6 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                            onClick={() => galleryFields.append({
                              photoUrl: '',
                              title: '',
                              description: ''
                            })}
                          >
                            <Plus size={14} /> Add Photo
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryFields.fields.map((field, index) => (
                          <Card key={field.id} className="bg-white/70 overflow-hidden relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 absolute top-1 right-1 z-10 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                              onClick={() => galleryFields.remove(index)}
                            >
                              <X size={14} />
                            </Button>
                            
                            <CardContent className="pt-4 pb-4 px-4">
                              <div className="space-y-4">
                                <div className="relative aspect-square w-full bg-gray-100 mb-4 border border-wedding-gold/20 rounded-md overflow-hidden flex items-center justify-center">
                                  {form.watch(`galleryPhotos.${index}.photoUrl`) ? (
                                    <img 
                                      src={form.watch(`galleryPhotos.${index}.photoUrl`)} 
                                      alt="Gallery preview" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Image size={24} className="text-gray-400" />
                                  )}
                                </div>
                                
                                <Input 
                                  type="file" 
                                  accept="image/*" 
                                  className="text-xs mb-3"
                                  onChange={(e) => handleGalleryImageChange(e, index)} 
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`galleryPhotos.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-wedding-maroon">Title/Caption</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Engagement Ceremony" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name={`galleryPhotos.${index}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-wedding-maroon">Description (Optional)</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Short description of the photo" 
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
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {galleryFields.fields.length === 0 && (
                        <div className="bg-wedding-gold/5 border border-dashed border-wedding-gold/30 rounded-md p-6 text-center">
                          <Upload className="w-8 h-8 text-wedding-gold/50 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">
                            Add up to 6 pre-wedding or engagement photos to display in the gallery
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3 gap-1 border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                            onClick={() => galleryFields.append({
                              photoUrl: '',
                              title: '',
                              description: ''
                            })}
                          >
                            <Plus size={14} /> Add First Photo
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-wedding-gold/5 p-4 rounded-lg">
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
                              This message will appear at the bottom of the invitation.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                <h3 className="text-wedding-maroon font-medium mb-2 flex items-center gap-2">
                  <Check size={16} className="text-green-500" /> Your Invitation is Ready!
                </h3>
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
                  Share this link to view the personalized invitation
                </p>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className="gap-2 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10"
                    onClick={() => window.open(invitationLink, '_blank')}
                  >
                    <Heart size={16} className="text-wedding-gold" /> 
                    View Invitation
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomizeForm;
