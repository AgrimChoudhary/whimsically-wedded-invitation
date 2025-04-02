import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { uploadImageToSupabase } from "@/lib/supabase-helpers";

interface InvitationEditorProps {
  section: "couple" | "date" | "photos" | "family" | "events" | "venue" | "contact";
  initialData?: any;
  onUpdate?: (data: any) => void;
}

const InvitationEditor: React.FC<InvitationEditorProps> = ({ section, initialData = {}, onUpdate = () => {} }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState<{id: string, name: string, date: Date | undefined, time: string, venue: string, address: string}[]>(
    initialData.events || [
      { id: uuidv4(), name: 'Wedding Ceremony', date: new Date(), time: '11:00 AM', venue: 'Garden Venue', address: '123 Wedding Lane' }
    ]
  );
  const [familyMembers, setFamilyMembers] = useState<{id: string, side: 'bride' | 'groom', name: string, relation: string, description: string, imageUrl: string}[]>(
    initialData.brideFamily?.map(member => ({ ...member, side: 'bride' })).concat(
      initialData.groomFamily?.map(member => ({ ...member, side: 'groom' }))
    ) || [
      { id: uuidv4(), side: 'bride', name: 'Mr. & Mrs. Sharma', relation: 'Parents of the Bride', description: 'Loving parents who have supported throughout life', imageUrl: '' },
      { id: uuidv4(), side: 'groom', name: 'Mr. & Mrs. Patel', relation: 'Parents of the Groom', description: 'Caring parents who have guided at every step', imageUrl: '' }
    ]
  );
  const [galleryImages, setGalleryImages] = useState<any[]>(
    initialData.galleryImages || []
  );
  
  // Define the form schema for each section
  const coupleSchema = z.object({
    brideName: z.string().min(2, { message: "Bride name is required" }),
    groomName: z.string().min(2, { message: "Groom name is required" }),
    brideAbout: z.string().optional(),
    groomAbout: z.string().optional(),
    coupleStory: z.string().optional(),
    coupleImageUrl: z.string().optional()
  });
  
  const dateSchema = z.object({
    weddingDate: z.date({
      required_error: "Wedding date is required",
    }),
    weddingTime: z.string().optional()
  });
  
  const venueSchema = z.object({
    venueName: z.string().min(2, { message: "Venue name is required" }),
    venueAddress: z.string().min(2, { message: "Venue address is required" }),
    mapUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal(''))
  });
  
  const contactSchema = z.object({
    rsvpEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal('')),
    rsvpPhone: z.string().optional(),
    customMessage: z.string().optional()
  });
  
  // Create the form for the active section
  const coupleForm = useForm<z.infer<typeof coupleSchema>>({
    resolver: zodResolver(coupleSchema),
    defaultValues: {
      brideName: initialData.brideName || "Ananya",
      groomName: initialData.groomName || "Arjun",
      brideAbout: initialData.brideAbout || "A beautiful soul with a passion for arts and culture.",
      groomAbout: initialData.groomAbout || "A dedicated individual with a love for adventure.",
      coupleStory: initialData.coupleStory || "We met through mutual friends at a college gathering and it was love at first sight.",
      coupleImageUrl: initialData.coupleImageUrl || ""
    }
  });
  
  const dateForm = useForm<z.infer<typeof dateSchema>>({
    resolver: zodResolver(dateSchema),
    defaultValues: {
      weddingDate: initialData.weddingDate || new Date('2025-04-10'),
      weddingTime: initialData.weddingTime || "11:00 AM"
    }
  });
  
  const venueForm = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      venueName: initialData.venueName || "Royal Garden Palace",
      venueAddress: initialData.venueAddress || "123 Wedding Lane, Wedding City, WD 12345",
      mapUrl: initialData.mapUrl || "https://maps.google.com"
    }
  });
  
  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      rsvpEmail: initialData.rsvpEmail || "rsvp@wedding.com",
      rsvpPhone: initialData.rsvpPhone || "+1 (555) 123-4567",
      customMessage: initialData.customMessage || "We would be honored by your presence on our special day."
    }
  });
  
  // Event handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    setUploading(true);
    try {
      // Upload to Supabase storage
      const imageUrl = await uploadImageToSupabase(files[0], 'couple_photos');
      
      if (imageUrl) {
        coupleForm.setValue("coupleImageUrl", imageUrl);
        setUploading(false);
        
        toast({
          title: "Image Uploaded",
          description: "Your image has been successfully uploaded."
        });
        
        // Trigger update to parent component
        onUpdate({
          brideName: coupleForm.getValues().brideName,
          groomName: coupleForm.getValues().groomName,
          coupleImageUrl: imageUrl
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddEvent = () => {
    const newEvents = [...events, {
      id: uuidv4(),
      name: '',
      date: undefined,
      time: '',
      venue: '',
      address: ''
    }];
    setEvents(newEvents);
    if (onUpdate) {
      onUpdate({ events: newEvents });
    }
  };
  
  const handleRemoveEvent = (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    setEvents(newEvents);
    if (onUpdate) {
      onUpdate({ events: newEvents });
    }
  };
  
  const handleUpdateEvent = (id: string, field: string, value: any) => {
    const newEvents = events.map(event => {
      if (event.id === id) {
        return { ...event, [field]: value };
      }
      return event;
    });
    setEvents(newEvents);
    if (onUpdate) {
      onUpdate({ events: newEvents });
    }
  };
  
  const handleAddFamilyMember = (side: 'bride' | 'groom') => {
    const newFamilyMembers = [...familyMembers, {
      id: uuidv4(),
      side,
      name: '',
      relation: '',
      description: '',
      imageUrl: ''
    }];
    setFamilyMembers(newFamilyMembers);
    
    if (onUpdate) {
      const brideFamily = newFamilyMembers.filter(m => m.side === 'bride');
      const groomFamily = newFamilyMembers.filter(m => m.side === 'groom');
      onUpdate({ 
        brideFamily,
        groomFamily 
      });
    }
  };
  
  const handleRemoveFamilyMember = (id: string) => {
    const newFamilyMembers = familyMembers.filter(member => member.id !== id);
    setFamilyMembers(newFamilyMembers);
    
    if (onUpdate) {
      const brideFamily = newFamilyMembers.filter(m => m.side === 'bride');
      const groomFamily = newFamilyMembers.filter(m => m.side === 'groom');
      onUpdate({ 
        brideFamily,
        groomFamily 
      });
    }
  };
  
  const handleUpdateFamilyMember = (id: string, field: string, value: string) => {
    const newFamilyMembers = familyMembers.map(member => {
      if (member.id === id) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setFamilyMembers(newFamilyMembers);
    
    if (onUpdate) {
      const brideFamily = newFamilyMembers.filter(m => m.side === 'bride');
      const groomFamily = newFamilyMembers.filter(m => m.side === 'groom');
      onUpdate({ 
        brideFamily,
        groomFamily 
      });
    }
  };
  
  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    setUploading(true);
    try {
      // Upload to Supabase storage
      const imageUrl = await uploadImageToSupabase(files[0], 'gallery_images');
      
      if (imageUrl) {
        const newImage = {
          id: uuidv4(),
          image: imageUrl,
          name: '',
          description: ''
        };
        
        const newGalleryImages = [...galleryImages, newImage];
        setGalleryImages(newGalleryImages);
        setUploading(false);
        
        toast({
          title: "Image Uploaded",
          description: "Your gallery image has been successfully uploaded."
        });
        
        // Trigger update to parent component
        if (onUpdate) {
          onUpdate({ galleryImages: newGalleryImages });
        }
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      setUploading(false);
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveGalleryImage = (id: string) => {
    const newGalleryImages = galleryImages.filter(image => image.id !== id);
    setGalleryImages(newGalleryImages);
    if (onUpdate) {
      onUpdate({ galleryImages: newGalleryImages });
    }
  };
  
  // Submit handlers for each form
  const onSubmitCouple = (data: z.infer<typeof coupleSchema>) => {
    console.log("Couple data:", data);
    toast({
      title: "Couple Details Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({
        brideName: data.brideName,
        groomName: data.groomName,
        brideAbout: data.brideAbout,
        groomAbout: data.groomAbout,
        coupleStory: data.coupleStory,
        coupleImageUrl: data.coupleImageUrl
      });
    }
  };
  
  const onSubmitDate = (data: z.infer<typeof dateSchema>) => {
    console.log("Date data:", data);
    toast({
      title: "Wedding Date Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({
        weddingDate: data.weddingDate,
        weddingTime: data.weddingTime
      });
    }
  };
  
  const onSubmitVenue = (data: z.infer<typeof venueSchema>) => {
    console.log("Venue data:", data);
    toast({
      title: "Venue Details Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        mapUrl: data.mapUrl
      });
    }
  };
  
  const onSubmitContact = (data: z.infer<typeof contactSchema>) => {
    console.log("Contact data:", data);
    toast({
      title: "Contact Information Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({
        rsvpEmail: data.rsvpEmail,
        rsvpPhone: data.rsvpPhone,
        customMessage: data.customMessage
      });
    }
  };
  
  const saveEvents = () => {
    console.log("Events data:", events);
    toast({
      title: "Wedding Events Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({ events });
    }
  };
  
  const saveFamilyMembers = () => {
    console.log("Family data:", familyMembers);
    toast({
      title: "Family Details Updated",
      description: "Your changes have been saved."
    });
    
    const brideFamily = familyMembers.filter(m => m.side === 'bride');
    const groomFamily = familyMembers.filter(m => m.side === 'groom');
    
    if (onUpdate) {
      onUpdate({ 
        brideFamily,
        groomFamily 
      });
    }
  };
  
  const savePhotos = () => {
    console.log("Gallery data:", galleryImages);
    toast({
      title: "Gallery Updated",
      description: "Your changes have been saved."
    });
    
    if (onUpdate) {
      onUpdate({ galleryImages });
    }
  };
  
  // Render the appropriate editor section
  const renderSection = () => {
    switch (section) {
      case "couple":
        return (
          <Form {...coupleForm}>
            <form onSubmit={coupleForm.handleSubmit(onSubmitCouple)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={coupleForm.control}
                  name="brideName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bride's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bride's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={coupleForm.control}
                  name="groomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groom's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter groom's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={coupleForm.control}
                  name="brideAbout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About the Bride</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about the bride..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={coupleForm.control}
                  name="groomAbout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About the Groom</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about the groom..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={coupleForm.control}
                name="coupleStory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Love Story</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Share your love story..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={coupleForm.control}
                name="coupleImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couple Photo</FormLabel>
                    <div className="flex flex-col items-center">
                      {field.value ? (
                        <div className="relative w-40 h-40 mb-2">
                          <img src={field.value} alt="Couple" className="w-full h-full object-cover rounded-lg" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6"
                            onClick={() => {
                              coupleForm.setValue("coupleImageUrl", "");
                              onUpdate({ coupleImageUrl: "" });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg w-40 h-40 flex items-center justify-center mb-2">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="couple-image-upload"
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("couple-image-upload")?.click()}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Save Couple Details</Button>
            </form>
          </Form>
        );
        
      case "date":
        return (
          <Form {...dateForm}>
            <form onSubmit={dateForm.handleSubmit(onSubmitDate)} className="space-y-4">
              <FormField
                control={dateForm.control}
                name="weddingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Wedding Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={dateForm.control}
                name="weddingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 11:00 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Save Wedding Date</Button>
            </form>
          </Form>
        );
        
      case "family":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Bride's Family</h3>
              {familyMembers.filter(member => member.side === 'bride').map((member, index) => (
                <div key={member.id} className="p-4 border rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Family Member {index + 1}</h4>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleRemoveFamilyMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input 
                        value={member.name} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'name', e.target.value)} 
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Relation</label>
                      <Input 
                        value={member.relation} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'relation', e.target.value)} 
                        placeholder="e.g. Mother of the Bride"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={member.description} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'description', e.target.value)} 
                        placeholder="Short bio or description"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleAddFamilyMember('bride')}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Bride's Family Member
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Groom's Family</h3>
              {familyMembers.filter(member => member.side === 'groom').map((member, index) => (
                <div key={member.id} className="p-4 border rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Family Member {index + 1}</h4>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleRemoveFamilyMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input 
                        value={member.name} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'name', e.target.value)} 
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Relation</label>
                      <Input 
                        value={member.relation} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'relation', e.target.value)} 
                        placeholder="e.g. Father of the Groom"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={member.description} 
                        onChange={(e) => handleUpdateFamilyMember(member.id, 'description', e.target.value)} 
                        placeholder="Short bio or description"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm" 
                className="mt-2"
                onClick={() => handleAddFamilyMember('groom')}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Groom's Family Member
              </Button>
            </div>
            
            <Button className="w-full" onClick={saveFamilyMembers}>
              Save Family Details
            </Button>
          </div>
        );
        
      case "events":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Wedding Events</h3>
            
            {events.map((event, index) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Event {index + 1}</h4>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleRemoveEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Event Name</label>
                    <Input 
                      value={event.name} 
                      onChange={(e) => handleUpdateEvent(event.id, 'name', e.target.value)} 
                      placeholder="e.g. Wedding Ceremony"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Event Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !event.date && "text-muted-foreground"
                          )}
                        >
                          {event.date ? (
                            format(event.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={event.date}
                          onSelect={(date) => handleUpdateEvent(event.id, 'date', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Event Time</label>
                    <Input 
                      value={event.time} 
                      onChange={(e) => handleUpdateEvent(event.id, 'time', e.target.value)} 
                      placeholder="e.g. 3:00 PM"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Venue Name</label>
                    <Input 
                      value={event.venue} 
                      onChange={(e) => handleUpdateEvent(event.id, 'venue', e.target.value)} 
                      placeholder="e.g. Grand Ballroom"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Venue Address</label>
                    <Textarea 
                      value={event.address} 
                      onChange={(e) => handleUpdateEvent(event.id, 'address', e.target.value)} 
                      placeholder="Full address"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddEvent}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
            
            <Button className="w-full" onClick={saveEvents}>
              Save Events
            </Button>
          </div>
        );
        
      case "venue":
        return (
          <Form {...venueForm}>
            <form onSubmit={venueForm.handleSubmit(onSubmitVenue)} className="space-y-4">
              <FormField
                control={venueForm.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter venue name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={venueForm.control}
                name="venueAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={venueForm.control}
                name="mapUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Google Maps link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Save Venue Details</Button>
            </form>
          </Form>
        );
        
      case "contact":
        return (
          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
              <FormField
                control={contactForm.control}
                name="rsvpEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSVP Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email for RSVPs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contactForm.control}
                name="rsvpPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSVP Phone Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number for RSVPs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={contactForm.control}
                name="customMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Message (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a custom message for your guests" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">Save Contact Information</Button>
            </form>
          </Form>
        );
        
      case "photos":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Gallery Photos</h3>
            <p className="text-sm text-gray-500">Upload photos for your wedding gallery</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((image, index) => (
                <div key={image.id} className="relative border rounded-lg aspect-square overflow-hidden">
                  <img 
                    src={image.image} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6"
                    onClick={() => handleRemoveGalleryImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {galleryImages.length < 6 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAddGalleryImage}
                      disabled={uploading}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <Button className="w-full" onClick={savePhotos} disabled={galleryImages.length === 0}>
              Save Photos
            </Button>
          </div>
        );
        
      default:
        return <p>Select a section to edit</p>;
    }
  };
  
  return <div className="space-y-4">{renderSection()}</div>;
};

export default InvitationEditor;
