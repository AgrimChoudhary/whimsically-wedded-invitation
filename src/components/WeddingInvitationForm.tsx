
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import FileUploader from './FileUploader';
import DynamicFormFields from './DynamicFormFields';
import { createWeddingInvitation, generateUniqueInvitationLink } from '@/lib/supabase-helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Copy, Check } from 'lucide-react';

// Schema validation
const formSchema = z.object({
  bride_name: z.string().min(1, 'Bride\'s name is required'),
  bride_about: z.string().optional(),
  groom_name: z.string().min(1, 'Groom\'s name is required'),
  groom_about: z.string().optional(),
  couple_story: z.string().optional(),
  wedding_date: z.string().min(1, 'Wedding date is required'),
  wedding_time: z.string().min(1, 'Wedding time is required'),
  wedding_venue: z.string().min(1, 'Venue name is required'),
  wedding_address: z.string().optional(),
  map_url: z.string().url().optional().or(z.literal('')),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  custom_message: z.string().optional(),
});

const WeddingInvitationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('couple');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupleImageUrl, setCoupleImageUrl] = useState('');
  const [brideFamily, setBrideFamily] = useState<any[]>([]);
  const [groomFamily, setGroomFamily] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bride_name: '',
      bride_about: '',
      groom_name: '',
      groom_about: '',
      couple_story: '',
      wedding_date: '',
      wedding_time: '',
      wedding_venue: '',
      wedding_address: '',
      map_url: '',
      contact_email: '',
      contact_phone: '',
      custom_message: '',
    },
  });

  // Family members handlers
  const addBrideFamilyMember = () => {
    setBrideFamily([
      ...brideFamily,
      { id: uuidv4(), name: '', relation: '', description: '', image: '' }
    ]);
  };

  const removeBrideFamilyMember = (index: number) => {
    const newMembers = [...brideFamily];
    newMembers.splice(index, 1);
    setBrideFamily(newMembers);
  };

  const updateBrideFamilyMember = (index: number, field: string, value: any) => {
    const newMembers = [...brideFamily];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setBrideFamily(newMembers);
  };

  const addGroomFamilyMember = () => {
    setGroomFamily([
      ...groomFamily,
      { id: uuidv4(), name: '', relation: '', description: '', image: '' }
    ]);
  };

  const removeGroomFamilyMember = (index: number) => {
    const newMembers = [...groomFamily];
    newMembers.splice(index, 1);
    setGroomFamily(newMembers);
  };

  const updateGroomFamilyMember = (index: number, field: string, value: any) => {
    const newMembers = [...groomFamily];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setGroomFamily(newMembers);
  };

  // Events handlers
  const addEvent = () => {
    setEvents([
      ...events,
      { 
        id: uuidv4(), 
        name: '', // event_name
        relation: '', // event_date
        description: '', // event_time
        image: '' // event_venue
      }
    ]);
  };

  const removeEvent = (index: number) => {
    const newEvents = [...events];
    newEvents.splice(index, 1);
    setEvents(newEvents);
  };

  const updateEvent = (index: number, field: string, value: any) => {
    const newEvents = [...events];
    
    // Map the form fields to the database fields
    const dbFieldMap: Record<string, string> = {
      'name': 'event_name',
      'relation': 'event_date',
      'description': 'event_time',
      'image': 'event_venue'
    };
    
    // If there's a mapping, use it
    const dbField = dbFieldMap[field] || field;
    
    newEvents[index] = { 
      ...newEvents[index], 
      [field]: value, // Keep original field for the UI
      [dbField]: value // Add mapped field for database
    };
    
    setEvents(newEvents);
  };

  // Gallery images handlers
  const addGalleryImage = () => {
    setGalleryImages([
      ...galleryImages,
      { id: uuidv4(), image: '', name: '', description: '' }
    ]);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setGalleryImages(newImages);
  };

  const updateGalleryImage = (index: number, field: string, value: any) => {
    const newImages = [...galleryImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setGalleryImages(newImages);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Process events data
      const formattedEvents = events.map(event => ({
        event_name: event.name,
        event_date: event.relation,
        event_time: event.description,
        event_venue: event.image,
        event_address: '' // Optional field we're not collecting
      }));

      // Create invitation data
      const invitationData = {
        ...data,
        couple_image_url: coupleImageUrl,
        bride_family: brideFamily,
        groom_family: groomFamily,
        gallery_images: galleryImages,
        events: formattedEvents
      };

      // Save to Supabase
      const invitation = await createWeddingInvitation(invitationData);
      
      if (invitation) {
        // Generate unique link
        const link = generateUniqueInvitationLink(invitation.id);
        setGeneratedLink(link);
        
        toast({
          title: "Success!",
          description: "Your wedding invitation has been created."
        });
        
        // Move to the result tab
        setActiveTab('result');
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create your invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewInvitation = () => {
    // The invitation ID is the last part of the generated link
    const id = generatedLink.split('/').pop();
    navigate(`/invitation/${id}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-wedding-maroon">Create Your Wedding Invitation</CardTitle>
          <CardDescription>Fill in the details to generate a beautiful wedding invitation.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="couple">Couple</TabsTrigger>
          <TabsTrigger value="wedding">Wedding</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="result" disabled={!generatedLink}>Result</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <TabsContent value="couple" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Couple Information</CardTitle>
                  <CardDescription>Tell us about the bride and groom.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Couple Photo</h3>
                    <FileUploader 
                      onFileUpload={setCoupleImageUrl}
                      defaultImageUrl={coupleImageUrl}
                      bucket="couple_photos"
                      label="Upload a couple photo (Max 5MB)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Bride</h3>
                      <FormField
                        control={form.control}
                        name="bride_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bride's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Sophie Miller" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bride_about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About the Bride</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="E.g., Sophie is a passionate artist with a love for travel..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Groom</h3>
                      <FormField
                        control={form.control}
                        name="groom_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Groom's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., James Carter" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="groom_about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About the Groom</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="E.g., James is a software engineer who enjoys hiking..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="couple_story"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Our Love Story</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell your love story. How you met, your journey together..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('wedding')}
                      className="flex items-center gap-2"
                    >
                      Next <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wedding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Details</CardTitle>
                  <CardDescription>Information about your wedding day.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="wedding_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wedding Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="wedding_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wedding Time</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., 2:00 PM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="wedding_venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Rosewood Hall" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wedding_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="E.g., 456 Oak Street, Austin, TX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="map_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Maps URL</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., https://maps.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Events</h3>
                    <p className="text-sm text-gray-500">Add other events related to your wedding celebration.</p>
                    
                    <DynamicFormFields
                      fields={events}
                      onAdd={addEvent}
                      onRemove={removeEvent}
                      onChange={updateEvent}
                      type="event"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('couple')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('family')}
                      className="flex items-center gap-2"
                    >
                      Next <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family Details</CardTitle>
                  <CardDescription>Information about the families of the bride and groom.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b pb-2">Bride's Family</h3>
                    
                    <DynamicFormFields
                      fields={brideFamily}
                      onAdd={addBrideFamilyMember}
                      onRemove={removeBrideFamilyMember}
                      onChange={updateBrideFamilyMember}
                      type="familyMember"
                    />
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium border-b pb-2">Groom's Family</h3>
                    
                    <DynamicFormFields
                      fields={groomFamily}
                      onAdd={addGroomFamilyMember}
                      onRemove={removeGroomFamilyMember}
                      onChange={updateGroomFamilyMember}
                      type="familyMember"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('wedding')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab('gallery')}
                      className="flex items-center gap-2"
                    >
                      Next <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gallery & Contact</CardTitle>
                  <CardDescription>Add photos and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Photo Gallery</h3>
                    <p className="text-sm text-gray-500">Add up to 6 photos for your gallery (engagement, pre-wedding).</p>
                    
                    <DynamicFormFields
                      fields={galleryImages}
                      onAdd={addGalleryImage}
                      onRemove={removeGalleryImage}
                      onChange={updateGalleryImage}
                      type="gallery"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., +1-512-555-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., sophie.james@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="custom_message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="E.g., We can't wait to celebrate with you!" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab('family')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Invitation'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="result" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Invitation is Ready!</CardTitle>
                  <CardDescription>Your wedding invitation has been created successfully.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-2">Invitation Link:</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={generatedLink} 
                        readOnly 
                        className="flex-1 p-2 text-sm border rounded-md" 
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={copyToClipboard}
                        className="flex items-center gap-1"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => form.reset()}
                      className="w-full sm:w-auto"
                    >
                      Create Another Invitation
                    </Button>
                    <Button 
                      type="button" 
                      onClick={previewInvitation}
                      className="w-full sm:w-auto"
                    >
                      Preview Invitation
                    </Button>
                  </div>

                  <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-md">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This invitation uses a placeholder for the guest name. 
                      You can share this link to preview the invitation. In a real scenario, you would 
                      create individual links for each guest with their specific names.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default WeddingInvitationForm;
