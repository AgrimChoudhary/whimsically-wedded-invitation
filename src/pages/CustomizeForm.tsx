
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  Camera,
  Clock,
  CopyCheck,
  Heart,
  Link,
  MapPin,
  PlusCircle,
  Trash2,
  Upload,
  Users,
  User,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { createInvitation, uploadImage, InvitationData, FamilyMember, EventData, GalleryPhoto } from '@/lib/invitation-helpers';

// Form validation schema
const formSchema = z.object({
  brideFirstName: z.string().min(1, 'Bride\'s first name is required'),
  brideLastName: z.string().min(1, 'Bride\'s last name is required'),
  groomFirstName: z.string().min(1, 'Groom\'s first name is required'),
  groomLastName: z.string().min(1, 'Groom\'s last name is required'),
  weddingDate: z.string().min(1, 'Wedding date is required'),
  weddingTime: z.string().min(1, 'Wedding time is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().min(1, 'Venue address is required'),
  venueMapLink: z.string().url().optional().or(z.literal('')),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
});

type FormData = z.infer<typeof formSchema>;

const CustomizeForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('couple');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // State for family members
  const [brideFamilyMembers, setBrideFamilyMembers] = useState<FamilyMember[]>([
    { name: '', relation: 'Father', description: '', image_url: '', family_type: 'bride', is_parent: true },
    { name: '', relation: 'Mother', description: '', image_url: '', family_type: 'bride', is_parent: true }
  ]);
  
  const [groomFamilyMembers, setGroomFamilyMembers] = useState<FamilyMember[]>([
    { name: '', relation: 'Father', description: '', image_url: '', family_type: 'groom', is_parent: true },
    { name: '', relation: 'Mother', description: '', image_url: '', family_type: 'groom', is_parent: true }
  ]);
  
  // State for additional family members
  const [additionalBrideFamily, setAdditionalBrideFamily] = useState<FamilyMember[]>([]);
  const [additionalGroomFamily, setAdditionalGroomFamily] = useState<FamilyMember[]>([]);
  
  // State for events
  const [events, setEvents] = useState<EventData[]>([
    { name: '', date: '', time: '', venue_name: '', venue_address: '', venue_map_link: '' }
  ]);
  
  // State for uploaded images
  const [couplePhotoFile, setCouplePhotoFile] = useState<File | null>(null);
  const [couplePhotoPreview, setCouplePhotoPreview] = useState<string>('');
  const [familyPhotoFiles, setFamilyPhotoFiles] = useState<Record<string, File>>({});
  const [galleryPhotoFiles, setGalleryPhotoFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideFirstName: '',
      brideLastName: '',
      groomFirstName: '',
      groomLastName: '',
      weddingDate: '',
      weddingTime: '',
      venueName: '',
      venueAddress: '',
      venueMapLink: '',
      phoneNumber: '',
      email: '',
    }
  });
  
  // Handler for couple photo upload
  const handleCouplePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCouplePhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCouplePhotoPreview(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for family photo upload
  const handleFamilyPhotoChange = (e: React.ChangeEvent<HTMLInputElement>, familyType: 'bride' | 'groom', index: number, isAdditional: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const key = `${familyType}-${index}-${isAdditional ? 'add' : 'main'}`;
      
      setFamilyPhotoFiles(prev => ({
        ...prev,
        [key]: file
      }));
      
      // Create preview and update state
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          if (familyType === 'bride') {
            if (isAdditional) {
              const newAdditionalBrideFamily = [...additionalBrideFamily];
              newAdditionalBrideFamily[index] = {
                ...newAdditionalBrideFamily[index],
                image_url: reader.result.toString()
              };
              setAdditionalBrideFamily(newAdditionalBrideFamily);
            } else {
              const newBrideFamilyMembers = [...brideFamilyMembers];
              newBrideFamilyMembers[index] = {
                ...newBrideFamilyMembers[index],
                image_url: reader.result.toString()
              };
              setBrideFamilyMembers(newBrideFamilyMembers);
            }
          } else {
            if (isAdditional) {
              const newAdditionalGroomFamily = [...additionalGroomFamily];
              newAdditionalGroomFamily[index] = {
                ...newAdditionalGroomFamily[index],
                image_url: reader.result.toString()
              };
              setAdditionalGroomFamily(newAdditionalGroomFamily);
            } else {
              const newGroomFamilyMembers = [...groomFamilyMembers];
              newGroomFamilyMembers[index] = {
                ...newGroomFamilyMembers[index],
                image_url: reader.result.toString()
              };
              setGroomFamilyMembers(newGroomFamilyMembers);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler for gallery photo upload
  const handleGalleryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const maxFiles = 5 - galleryPhotoFiles.length;
      const selectedFiles = files.slice(0, maxFiles);
      
      setGalleryPhotoFiles(prev => [...prev, ...selectedFiles]);
      
      // Create previews
      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setGalleryPreviews(prev => [...prev, reader.result.toString()]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  // Handler for adding a bride family member
  const addBrideFamilyMember = () => {
    setAdditionalBrideFamily(prev => [
      ...prev,
      { name: '', relation: '', description: '', image_url: '', family_type: 'bride', is_parent: false }
    ]);
  };
  
  // Handler for removing a bride family member
  const removeBrideFamilyMember = (index: number) => {
    setAdditionalBrideFamily(prev => prev.filter((_, i) => i !== index));
    
    // Remove the associated photo file
    const key = `bride-${index}-add`;
    setFamilyPhotoFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
  };
  
  // Handler for updating a bride family member
  const updateBrideFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    setAdditionalBrideFamily(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    );
  };
  
  // Handler for updating a bride parent
  const updateBrideParent = (index: number, field: keyof FamilyMember, value: string) => {
    setBrideFamilyMembers(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    );
  };
  
  // Handler for adding a groom family member
  const addGroomFamilyMember = () => {
    setAdditionalGroomFamily(prev => [
      ...prev,
      { name: '', relation: '', description: '', image_url: '', family_type: 'groom', is_parent: false }
    ]);
  };
  
  // Handler for removing a groom family member
  const removeGroomFamilyMember = (index: number) => {
    setAdditionalGroomFamily(prev => prev.filter((_, i) => i !== index));
    
    // Remove the associated photo file
    const key = `groom-${index}-add`;
    setFamilyPhotoFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
  };
  
  // Handler for updating a groom family member
  const updateGroomFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    setAdditionalGroomFamily(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    );
  };
  
  // Handler for updating a groom parent
  const updateGroomParent = (index: number, field: keyof FamilyMember, value: string) => {
    setGroomFamilyMembers(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    );
  };
  
  // Handler for adding an event
  const addEvent = () => {
    setEvents(prev => [
      ...prev,
      { name: '', date: '', time: '', venue_name: '', venue_address: '', venue_map_link: '' }
    ]);
  };
  
  // Handler for removing an event
  const removeEvent = (index: number) => {
    if (events.length > 1) {
      setEvents(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  // Handler for updating an event
  const updateEvent = (index: number, field: keyof EventData, value: string) => {
    setEvents(prev => 
      prev.map((event, i) => 
        i === index ? { ...event, [field]: value } : event
      )
    );
  };
  
  // Handler for removing a gallery photo
  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handler for copying the generated link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handler for form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Upload couple photo if provided
      let couplePhotoUrl = '';
      if (couplePhotoFile) {
        const uploadedUrl = await uploadImage(couplePhotoFile, 'couple');
        if (uploadedUrl) {
          couplePhotoUrl = uploadedUrl;
        }
      }
      
      // Upload family photos
      for (const key in familyPhotoFiles) {
        const [familyType, index, type] = key.split('-');
        const file = familyPhotoFiles[key];
        const uploadedUrl = await uploadImage(file, 'family');
        
        if (uploadedUrl) {
          if (familyType === 'bride') {
            if (type === 'add') {
              const newAdditionalBrideFamily = [...additionalBrideFamily];
              newAdditionalBrideFamily[parseInt(index)] = {
                ...newAdditionalBrideFamily[parseInt(index)],
                image_url: uploadedUrl
              };
              setAdditionalBrideFamily(newAdditionalBrideFamily);
            } else {
              const newBrideFamilyMembers = [...brideFamilyMembers];
              newBrideFamilyMembers[parseInt(index)] = {
                ...newBrideFamilyMembers[parseInt(index)],
                image_url: uploadedUrl
              };
              setBrideFamilyMembers(newBrideFamilyMembers);
            }
          } else if (familyType === 'groom') {
            if (type === 'add') {
              const newAdditionalGroomFamily = [...additionalGroomFamily];
              newAdditionalGroomFamily[parseInt(index)] = {
                ...newAdditionalGroomFamily[parseInt(index)],
                image_url: uploadedUrl
              };
              setAdditionalGroomFamily(newAdditionalGroomFamily);
            } else {
              const newGroomFamilyMembers = [...groomFamilyMembers];
              newGroomFamilyMembers[parseInt(index)] = {
                ...newGroomFamilyMembers[parseInt(index)],
                image_url: uploadedUrl
              };
              setGroomFamilyMembers(newGroomFamilyMembers);
            }
          }
        }
      }
      
      // Upload gallery photos
      const galleryPhotos: GalleryPhoto[] = [];
      for (const file of galleryPhotoFiles) {
        const uploadedUrl = await uploadImage(file, 'gallery');
        if (uploadedUrl) {
          galleryPhotos.push({ photo_url: uploadedUrl });
        }
      }
      
      // Prepare invitation data
      const invitationData: InvitationData = {
        bride_first_name: data.brideFirstName,
        bride_last_name: data.brideLastName,
        groom_first_name: data.groomFirstName,
        groom_last_name: data.groomLastName,
        wedding_date: data.weddingDate,
        wedding_time: data.weddingTime,
        venue_name: data.venueName,
        venue_address: data.venueAddress,
        venue_map_link: data.venueMapLink,
        phone_number: data.phoneNumber,
        email: data.email,
        couple_photo_url: couplePhotoUrl
      };
      
      // Combine all family members
      const allFamilyMembers = [
        ...brideFamilyMembers.filter(member => member.name.trim() !== ''),
        ...additionalBrideFamily.filter(member => member.name.trim() !== ''),
        ...groomFamilyMembers.filter(member => member.name.trim() !== ''),
        ...additionalGroomFamily.filter(member => member.name.trim() !== '')
      ];
      
      // Filter valid events
      const validEvents = events.filter(event => 
        event.name.trim() !== '' && 
        event.date.trim() !== '' && 
        event.time.trim() !== '' && 
        event.venue_name.trim() !== '' && 
        event.venue_address.trim() !== ''
      );
      
      // Create the invitation
      const invitationId = await createInvitation(
        invitationData,
        allFamilyMembers,
        validEvents,
        galleryPhotos
      );
      
      if (invitationId) {
        // Generate invitation link
        const link = `${window.location.origin}/invitation/${invitationId}`;
        setGeneratedLink(link);
        
        toast({
          title: "Success!",
          description: "Your wedding invitation has been created successfully."
        });
        
        setActiveTab('result');
      } else {
        toast({
          title: "Error",
          description: "Failed to create invitation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-wedding-cream/20 pattern-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border-wedding-gold/20 shadow-md">
          <CardHeader className="bg-wedding-gold/5">
            <CardTitle className="text-2xl font-great-vibes text-wedding-maroon flex items-center gap-2">
              <Heart className="text-wedding-gold" size={20} />
              Customize Your Wedding Invitation
            </CardTitle>
            <CardDescription>
              Fill in all the details to create your personalized wedding invitation
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mx-4 mt-4 bg-wedding-cream/50">
                  <TabsTrigger value="couple" className="data-[state=active]:bg-wedding-maroon/10">
                    <Users size={16} className="mr-2" /> Couple
                  </TabsTrigger>
                  <TabsTrigger value="wedding" className="data-[state=active]:bg-wedding-maroon/10">
                    <Calendar size={16} className="mr-2" /> Wedding
                  </TabsTrigger>
                  <TabsTrigger value="family" className="data-[state=active]:bg-wedding-maroon/10">
                    <User size={16} className="mr-2" /> Family
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="data-[state=active]:bg-wedding-maroon/10">
                    <Camera size={16} className="mr-2" /> Photos
                  </TabsTrigger>
                  <TabsTrigger value="result" className="data-[state=active]:bg-wedding-maroon/10" disabled={!generatedLink}>
                    <CopyCheck size={16} className="mr-2" /> Result
                  </TabsTrigger>
                </TabsList>
                
                {/* Couple Details Tab */}
                <TabsContent value="couple">
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-wedding-gold/5 border border-wedding-gold/10">
                      <h3 className="text-lg font-medium text-wedding-maroon mb-4 flex items-center">
                        <Heart className="mr-2 text-wedding-gold" size={18} />
                        Couple Photo
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-wedding-cream/50 border-2 border-wedding-gold/20 flex items-center justify-center">
                          {couplePhotoPreview ? (
                            <img 
                              src={couplePhotoPreview} 
                              alt="Couple" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Users size={48} className="text-wedding-gold/30" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-wedding-maroon mb-2">
                            Upload Couple Photo
                          </label>
                          <div className="flex items-center">
                            <label className="flex-1 cursor-pointer bg-wedding-cream hover:bg-wedding-cream/70 text-wedding-maroon py-2 px-4 rounded-lg border border-wedding-gold/20 transition-colors">
                              <div className="flex items-center justify-center">
                                <Upload size={18} className="mr-2" />
                                <span>Choose Photo</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCouplePhotoChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Recommended: Square image, max 5MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-wedding-maroon mb-2">Bride's Details</h3>
                          
                          <FormField
                            control={form.control}
                            name="brideFirstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ananya" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="brideLastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Sharma" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-wedding-maroon mb-2">Groom's Details</h3>
                          
                          <FormField
                            control={form.control}
                            name="groomFirstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Arjun" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="groomLastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Patel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('wedding')}
                        className="bg-wedding-maroon hover:bg-wedding-maroon/80"
                      >
                        Next: Wedding Details
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Wedding Details Tab */}
                <TabsContent value="wedding">
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-wedding-gold/5 border border-wedding-gold/10">
                      <h3 className="text-lg font-medium text-wedding-maroon mb-4 flex items-center">
                        <Calendar className="mr-2 text-wedding-gold" size={18} />
                        Wedding Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FormField
                          control={form.control}
                          name="weddingDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Wedding Date</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="date" 
                                    placeholder="Wedding Date" 
                                    {...field} 
                                  />
                                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wedding-gold/50" size={16} />
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
                              <FormLabel>Wedding Time</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="time" 
                                    placeholder="Wedding Time" 
                                    {...field} 
                                  />
                                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-wedding-gold/50" size={16} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="venueName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Name</FormLabel>
                            <FormControl>
                              <Input placeholder="The Grand Pavilion" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="venueAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="123 Wedding Lane, Mumbai, Maharashtra, 400001" 
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
                          name="venueMapLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Google Maps Link (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="https://maps.google.com/..." 
                                    {...field} 
                                  />
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wedding-gold/50" size={16} />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-sm text-gray-500 pl-6">
                                      https://
                                    </span>
                                  </div>
                                </div>
                              </FormControl>
                              <p className="text-xs text-gray-500 mt-1">
                                Add a Google Maps link to help guests find your venue
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-wedding-maroon flex items-center">
                            <Calendar className="mr-2 text-wedding-gold" size={18} />
                            Custom Events
                          </h3>
                          
                          <Button
                            type="button"
                            onClick={addEvent}
                            size="sm"
                            variant="outline"
                            className="text-wedding-gold border-wedding-gold/30 hover:bg-wedding-gold/10"
                          >
                            <PlusCircle size={16} className="mr-1" />
                            Add Event
                          </Button>
                        </div>
                        
                        <div className="space-y-6">
                          {events.map((event, index) => (
                            <div 
                              key={index} 
                              className="p-4 border border-wedding-gold/20 rounded-md relative bg-white/20 backdrop-blur-sm"
                            >
                              {events.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeEvent(index)}
                                  className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                                >
                                  <X size={14} />
                                </Button>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Event Name
                                  </label>
                                  <Input
                                    placeholder="E.g., Sangeet Ceremony"
                                    value={event.name}
                                    onChange={(e) => updateEvent(index, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                      Date
                                    </label>
                                    <Input
                                      type="date"
                                      value={event.date}
                                      onChange={(e) => updateEvent(index, 'date', e.target.value)}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                      Time
                                    </label>
                                    <Input
                                      type="time"
                                      value={event.time}
                                      onChange={(e) => updateEvent(index, 'time', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                  Venue Name
                                </label>
                                <Input
                                  placeholder="E.g., Golden Garden"
                                  value={event.venue_name}
                                  onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                                />
                              </div>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                  Venue Address
                                </label>
                                <Textarea
                                  placeholder="Enter full address"
                                  value={event.venue_address}
                                  onChange={(e) => updateEvent(index, 'venue_address', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                  Google Maps Link (Optional)
                                </label>
                                <div className="relative">
                                  <Input 
                                    placeholder="https://maps.google.com/..."
                                    value={event.venue_map_link}
                                    onChange={(e) => updateEvent(index, 'venue_map_link', e.target.value)}
                                  />
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wedding-gold/50" size={16} />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-sm text-gray-500 pl-6">
                                      https://
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 98765 43210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input placeholder="ananya.arjun@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab('couple')}
                      >
                        Back: Couple Details
                      </Button>
                      
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('family')}
                        className="bg-wedding-maroon hover:bg-wedding-maroon/80"
                      >
                        Next: Family Details
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Family Details Tab */}
                <TabsContent value="family">
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-wedding-gold/5 border border-wedding-gold/10">
                      <h3 className="text-lg font-medium text-wedding-maroon mb-4 flex items-center">
                        <Users className="mr-2 text-wedding-gold" size={18} />
                        Bride's Family
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Bride's Parents */}
                        {brideFamilyMembers.map((member, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-wedding-gold/20 rounded-md bg-white/20 backdrop-blur-sm"
                          >
                            <h4 className="text-sm font-medium text-wedding-maroon mb-3">
                              {member.relation}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Name
                                  </label>
                                  <Input
                                    placeholder={`Bride's ${member.relation}`}
                                    value={member.name}
                                    onChange={(e) => updateBrideParent(index, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    placeholder="Short description"
                                    value={member.description || ''}
                                    onChange={(e) => updateBrideParent(index, 'description', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center">
                                <Avatar className="w-24 h-24 border-2 border-wedding-gold/20">
                                  {member.image_url ? (
                                    <AvatarImage src={member.image_url} alt={member.name} />
                                  ) : (
                                    <AvatarFallback className="bg-wedding-cream text-wedding-gold">
                                      {member.relation.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                
                                <label className="cursor-pointer mt-2 text-xs text-center bg-wedding-cream hover:bg-wedding-cream/70 text-wedding-maroon py-1 px-2 rounded border border-wedding-gold/20 transition-colors">
                                  <div className="flex items-center justify-center">
                                    <Upload size={12} className="mr-1" />
                                    <span>Upload Photo</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFamilyPhotoChange(e, 'bride', index)}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Additional Bride Family Members */}
                        {additionalBrideFamily.map((member, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-wedding-gold/20 rounded-md relative bg-white/20 backdrop-blur-sm"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBrideFamilyMember(index)}
                              className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                            >
                              <X size={14} />
                            </Button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Name
                                  </label>
                                  <Input
                                    placeholder="Family Member Name"
                                    value={member.name}
                                    onChange={(e) => updateBrideFamilyMember(index, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Relation
                                  </label>
                                  <Input
                                    placeholder="E.g., Sister, Brother"
                                    value={member.relation}
                                    onChange={(e) => updateBrideFamilyMember(index, 'relation', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    placeholder="Short description"
                                    value={member.description || ''}
                                    onChange={(e) => updateBrideFamilyMember(index, 'description', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center">
                                <Avatar className="w-24 h-24 border-2 border-wedding-gold/20">
                                  {member.image_url ? (
                                    <AvatarImage src={member.image_url} alt={member.name} />
                                  ) : (
                                    <AvatarFallback className="bg-wedding-cream text-wedding-gold">
                                      {member.name.charAt(0) || 'F'}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                
                                <label className="cursor-pointer mt-2 text-xs text-center bg-wedding-cream hover:bg-wedding-cream/70 text-wedding-maroon py-1 px-2 rounded border border-wedding-gold/20 transition-colors">
                                  <div className="flex items-center justify-center">
                                    <Upload size={12} className="mr-1" />
                                    <span>Upload Photo</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFamilyPhotoChange(e, 'bride', index, true)}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addBrideFamilyMember}
                          className="w-full mt-2 text-wedding-gold border-wedding-gold/30 hover:bg-wedding-gold/10"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Add Family Member
                        </Button>
                      </div>
                      
                      <Separator className="my-8" />
                      
                      <h3 className="text-lg font-medium text-wedding-maroon mb-4 flex items-center">
                        <Users className="mr-2 text-wedding-gold" size={18} />
                        Groom's Family
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Groom's Parents */}
                        {groomFamilyMembers.map((member, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-wedding-gold/20 rounded-md bg-white/20 backdrop-blur-sm"
                          >
                            <h4 className="text-sm font-medium text-wedding-maroon mb-3">
                              {member.relation}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Name
                                  </label>
                                  <Input
                                    placeholder={`Groom's ${member.relation}`}
                                    value={member.name}
                                    onChange={(e) => updateGroomParent(index, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    placeholder="Short description"
                                    value={member.description || ''}
                                    onChange={(e) => updateGroomParent(index, 'description', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center">
                                <Avatar className="w-24 h-24 border-2 border-wedding-gold/20">
                                  {member.image_url ? (
                                    <AvatarImage src={member.image_url} alt={member.name} />
                                  ) : (
                                    <AvatarFallback className="bg-wedding-cream text-wedding-gold">
                                      {member.relation.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                
                                <label className="cursor-pointer mt-2 text-xs text-center bg-wedding-cream hover:bg-wedding-cream/70 text-wedding-maroon py-1 px-2 rounded border border-wedding-gold/20 transition-colors">
                                  <div className="flex items-center justify-center">
                                    <Upload size={12} className="mr-1" />
                                    <span>Upload Photo</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFamilyPhotoChange(e, 'groom', index)}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Additional Groom Family Members */}
                        {additionalGroomFamily.map((member, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-wedding-gold/20 rounded-md relative bg-white/20 backdrop-blur-sm"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGroomFamilyMember(index)}
                              className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500"
                            >
                              <X size={14} />
                            </Button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Name
                                  </label>
                                  <Input
                                    placeholder="Family Member Name"
                                    value={member.name}
                                    onChange={(e) => updateGroomFamilyMember(index, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Relation
                                  </label>
                                  <Input
                                    placeholder="E.g., Sister, Brother"
                                    value={member.relation}
                                    onChange={(e) => updateGroomFamilyMember(index, 'relation', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-wedding-maroon mb-1">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    placeholder="Short description"
                                    value={member.description || ''}
                                    onChange={(e) => updateGroomFamilyMember(index, 'description', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center justify-center">
                                <Avatar className="w-24 h-24 border-2 border-wedding-gold/20">
                                  {member.image_url ? (
                                    <AvatarImage src={member.image_url} alt={member.name} />
                                  ) : (
                                    <AvatarFallback className="bg-wedding-cream text-wedding-gold">
                                      {member.name.charAt(0) || 'F'}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                
                                <label className="cursor-pointer mt-2 text-xs text-center bg-wedding-cream hover:bg-wedding-cream/70 text-wedding-maroon py-1 px-2 rounded border border-wedding-gold/20 transition-colors">
                                  <div className="flex items-center justify-center">
                                    <Upload size={12} className="mr-1" />
                                    <span>Upload Photo</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFamilyPhotoChange(e, 'groom', index, true)}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addGroomFamilyMember}
                          className="w-full mt-2 text-wedding-gold border-wedding-gold/30 hover:bg-wedding-gold/10"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Add Family Member
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab('wedding')}
                      >
                        Back: Wedding Details
                      </Button>
                      
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab('photos')}
                        className="bg-wedding-maroon hover:bg-wedding-maroon/80"
                      >
                        Next: Gallery Photos
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Photos Tab */}
                <TabsContent value="photos">
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-wedding-gold/5 border border-wedding-gold/10">
                      <h3 className="text-lg font-medium text-wedding-maroon mb-4 flex items-center">
                        <Camera className="mr-2 text-wedding-gold" size={18} />
                        Photo Gallery
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        Add up to 5 photos to your gallery (engagement photos, pre-wedding memories, etc.)
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                        {/* Gallery Preview */}
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border border-wedding-gold/20">
                              <img 
                                src={preview} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGalleryPhoto(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        ))}
                        
                        {/* Upload More Photos Button */}
                        {galleryPreviews.length < 5 && (
                          <div>
                            <label className="flex flex-col items-center justify-center w-full h-full aspect-square cursor-pointer bg-wedding-cream/50 hover:bg-wedding-cream rounded-md border-2 border-dashed border-wedding-gold/30 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera size={24} className="text-wedding-gold mb-2" />
                                <p className="text-xs text-center text-gray-600">
                                  Click to add photos
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {galleryPreviews.length}/5 photos
                                  </span>
                                </p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleGalleryPhotoChange}
                                accept="image/*"
                                multiple={true}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setActiveTab('family')}
                      >
                        Back: Family Details
                      </Button>
                      
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-wedding-maroon hover:bg-wedding-maroon/80"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">&#8981;</span>
                            Creating Invitation...
                          </>
                        ) : (
                          'Create Invitation'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </TabsContent>
                
                {/* Result Tab */}
                <TabsContent value="result">
                  <CardContent className="space-y-6">
                    <div className="p-6 rounded-lg bg-wedding-gold/5 border border-wedding-gold/10 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CopyCheck size={24} className="text-green-600" />
                      </div>
                      
                      <h3 className="text-xl font-medium text-wedding-maroon mb-2">
                        Invitation Created Successfully!
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        Your wedding invitation has been created. Share this link with your guests:
                      </p>
                      
                      <div className="flex items-center mb-6 max-w-xl mx-auto">
                        <div className="bg-white flex-1 p-3 border border-wedding-gold/20 rounded-l-md truncate font-mono text-sm">
                          {generatedLink}
                        </div>
                        <Button
                          type="button"
                          onClick={copyToClipboard}
                          className="rounded-l-none bg-wedding-gold hover:bg-wedding-gold/80"
                        >
                          {copied ? (
                            <>
                              <CopyCheck size={16} className="mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Link size={16} className="mr-2" />
                              Copy Link
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            // Reset form
                            form.reset();
                            setCouplePhotoFile(null);
                            setCouplePhotoPreview('');
                            setBrideFamilyMembers([
                              { name: '', relation: 'Father', description: '', image_url: '', family_type: 'bride', is_parent: true },
                              { name: '', relation: 'Mother', description: '', image_url: '', family_type: 'bride', is_parent: true }
                            ]);
                            setGroomFamilyMembers([
                              { name: '', relation: 'Father', description: '', image_url: '', family_type: 'groom', is_parent: true },
                              { name: '', relation: 'Mother', description: '', image_url: '', family_type: 'groom', is_parent: true }
                            ]);
                            setAdditionalBrideFamily([]);
                            setAdditionalGroomFamily([]);
                            setEvents([
                              { name: '', date: '', time: '', venue_name: '', venue_address: '', venue_map_link: '' }
                            ]);
                            setFamilyPhotoFiles({});
                            setGalleryPhotoFiles([]);
                            setGalleryPreviews([]);
                            setGeneratedLink('');
                            setActiveTab('couple');
                          }}
                          className="w-full sm:w-auto"
                        >
                          Create Another Invitation
                        </Button>
                        
                        <Button 
                          type="button" 
                          onClick={() => navigate('/invitations')}
                          className="w-full sm:w-auto bg-wedding-maroon hover:bg-wedding-maroon/80"
                        >
                          Manage Invitations
                        </Button>
                        
                        <Button 
                          type="button" 
                          onClick={() => window.open(generatedLink, '_blank')}
                          className="w-full sm:w-auto bg-wedding-gold hover:bg-wedding-gold/80"
                        >
                          View Invitation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CustomizeForm;
