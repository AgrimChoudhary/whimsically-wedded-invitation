
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Check, Copy, Edit, Eye, EyeOff, Palette, PenTool, Pencil, Save, X as CloseIcon, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { getDefaultInvitationTemplate } from "@/lib/supabase-helpers";

// Define a comprehensive interface for the event structure
interface EventData {
  id: string;
  name: string;
  date: Date | string;
  time: string;
  venue: string;
  address: string;
}

// Define the invitation data structure with all required fields
interface InvitationData {
  // Basic info
  bride_name: string;
  groom_name: string;
  bride_about: string;
  groom_about: string;
  couple_story: string;
  couple_image_url: string;
  
  // Wedding details
  wedding_date: string;
  wedding_time: string;
  wedding_venue: string;
  wedding_address: string;
  map_url: string;
  
  // Family details
  bride_parents: string;
  groom_parents: string;
  bride_family: Array<{
    id: string;
    name: string;
    relation: string;
    description: string;
  }>;
  groom_family: Array<{
    id: string;
    name: string;
    relation: string;
    description: string;
  }>;
  
  // Event details
  events: EventData[];
  
  // Gallery
  gallery_images: any[];
  
  // Custom message
  custom_message: string;
  
  // RSVP
  rsvp_email: string;
  rsvp_phone: string;
  rsvp_message: string;
  
  // Welcome page customizations
  welcome_title: string;
  welcome_subtitle: string;
  welcome_message: string;
  welcome_button_text: string;
  
  // Invitation specific customizations
  invitation_title: string;
  header_subtitle: string;
  save_date_text: string;
  
  // Styling options
  animations: {
    petals: boolean;
    confetti: boolean;
    hearts: boolean;
  };
  font_style: string;
  color_scheme: string;
  background_style: string;
}

const CustomizeInvitation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [editMode, setEditMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareLinkUrl, setShareLinkUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize invitation data with all required fields
  const [invitationData, setInvitationData] = useState<InvitationData>({
    // Basic info
    bride_name: "Ananya",
    groom_name: "Arjun",
    bride_about: "Ananya is a software engineer who loves to paint and travel.",
    groom_about: "Arjun is a doctor specialized in pediatrics with a passion for music.",
    couple_story: "We met during a charity event and immediately felt a connection that grew stronger with time.",
    couple_image_url: "",
    
    // Wedding details
    wedding_date: new Date().toISOString().split('T')[0],
    wedding_time: "11:00 AM",
    wedding_venue: "Royal Garden Palace",
    wedding_address: "123 Wedding Lane, Wedding City",
    map_url: "https://maps.google.com/...",
    
    // Family details
    bride_parents: "Mr. & Mrs. Sharma",
    groom_parents: "Mr. & Mrs. Patel",
    bride_family: [
      { 
        id: "1", 
        name: "Rajesh & Priya Sharma", 
        relation: "Parents of the Bride",
        description: "Rajesh is a successful businessman who loves cricket and traveling."
      }
    ],
    groom_family: [
      { 
        id: "4", 
        name: "Vikram & Nisha Patel", 
        relation: "Parents of the Groom",
        description: "Vikram is a retired professor who now mentors students."
      }
    ],
    
    // Event details
    events: [
      {
        id: "1",
        name: "Mehndi Ceremony",
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        time: "3:00 PM",
        venue: "Family Residence",
        address: "123 Wedding Lane, Wedding City"
      },
      {
        id: "2",
        name: "Sangeet Ceremony",
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        time: "7:00 PM",
        venue: "Golden Ballroom",
        address: "456 Celebration Blvd, Wedding City"
      }
    ],
    
    // Gallery
    gallery_images: [],
    
    // Custom message
    custom_message: "We would be honored by your presence on our special day.",
    
    // RSVP
    rsvp_email: "wedding@example.com",
    rsvp_phone: "+1 (555) 123-4567",
    rsvp_message: "Please let us know if you can join us in our celebration.",
    
    // Welcome page customizations
    welcome_title: "Ananya & Arjun's Wedding",
    welcome_subtitle: "Join us to celebrate our special day",
    welcome_message: "We are excited to share our joy with you as we begin our journey together.",
    welcome_button_text: "View Invitation",
    
    // Invitation specific customizations
    invitation_title: "Wedding Invitation",
    header_subtitle: "With the blessings of our parents",
    save_date_text: "Save the Date",
    
    // Styling options
    animations: {
      petals: true,
      confetti: false,
      hearts: false
    },
    font_style: "traditional",
    color_scheme: "wedding-gold",
    background_style: "floral"
  });
  
  const loadTemplateData = () => {
    const templateData = getDefaultInvitationTemplate();
    // Transform template data to match our expected format
    setInvitationData(prev => {
      // Create a new copy of the previous state
      const updatedData = { ...prev };
      
      // Update basic fields
      updatedData.bride_name = templateData.bride_name;
      updatedData.groom_name = templateData.groom_name;
      updatedData.couple_image_url = templateData.couple_image_url || "";
      updatedData.wedding_date = templateData.wedding_date;
      updatedData.wedding_time = templateData.wedding_time || "11:00 AM";
      updatedData.wedding_venue = templateData.wedding_venue || "Wedding Venue";
      updatedData.wedding_address = templateData.wedding_address || "Address";
      
      // Map events correctly
      if (templateData.events && Array.isArray(templateData.events)) {
        updatedData.events = templateData.events.map(event => {
          // Create correctly shaped event object
          return {
            id: event.id || String(Math.random()),
            name: event.name || event.event_name || "",
            date: event.date || (event.event_date ? new Date(event.event_date) : new Date()),
            time: event.time || event.event_time || "",
            venue: event.venue || event.event_venue || "",
            address: event.address || event.event_address || ""
          };
        });
      }
      
      // Copy other fields
      if (templateData.bride_family) updatedData.bride_family = templateData.bride_family;
      if (templateData.groom_family) updatedData.groom_family = templateData.groom_family;
      if (templateData.gallery_images) updatedData.gallery_images = templateData.gallery_images;
      if (templateData.custom_message) updatedData.custom_message = templateData.custom_message;
      
      return updatedData;
    });
  };
  
  useEffect(() => {
    // Load template data on component mount
    loadTemplateData();
  }, []);
  
  const handleFieldChange = (field: keyof InvitationData, value: any) => {
    setInvitationData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEventChange = (eventId: string, field: keyof EventData, value: any) => {
    setInvitationData(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === eventId ? { ...event, [field]: value } : event
      )
    }));
  };
  
  const addNewEvent = () => {
    const newEvent: EventData = {
      id: String(Date.now()),
      name: "New Event",
      date: new Date(),
      time: "12:00 PM",
      venue: "Event Venue",
      address: "Event Address"
    };
    
    setInvitationData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };
  
  const removeEvent = (eventId: string) => {
    setInvitationData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
  };
  
  const saveInvitation = async () => {
    setIsLoading(true);
    try {
      // Logic to save invitation to database would go here
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a share link
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      setShareLinkUrl(`${window.location.origin}/invitation/${uniqueId}`);
      
      setSaveSuccess(true);
      toast({
        title: "Invitation saved",
        description: "Your custom invitation has been saved successfully."
      });
    } catch (error) {
      console.error("Error saving invitation:", error);
      toast({
        title: "Error saving invitation",
        description: "There was a problem saving your invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyShareLink = () => {
    if (shareLinkUrl) {
      navigator.clipboard.writeText(shareLinkUrl);
      toast({
        title: "Link copied!",
        description: "Invitation link copied to clipboard.",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-wedding-cream/30 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-2xl md:text-3xl text-wedding-maroon">
            Customize Wedding Invitation
          </h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
              className="gap-1"
            >
              {editMode ? (
                <>
                  <Eye size={16} />
                  <span className="hidden sm:inline">Preview</span>
                </>
              ) : (
                <>
                  <PenTool size={16} />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={saveInvitation}
              disabled={isLoading}
              size="sm"
              className="gap-1 bg-wedding-gold hover:bg-wedding-deep-gold"
            >
              {isLoading ? (
                <><span className="loading loading-spinner loading-xs"></span> Saving...</>
              ) : (
                <><Save size={16} /> Save</>
              )}
            </Button>
          </div>
        </div>
        
        {saveSuccess && shareLinkUrl && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-800 font-medium">Invitation Saved!</h3>
                <p className="text-green-600 text-sm">
                  Your invitation is ready to be shared with your guests
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1 border-green-300 hover:bg-green-100"
                onClick={copyShareLink}
              >
                <Copy size={14} />
                Copy Link
              </Button>
            </div>
            <div className="mt-2 p-2 bg-white rounded border border-green-200 text-sm text-green-700 break-all">
              {shareLinkUrl}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor sidebar - only visible in edit mode */}
          {editMode && (
            <div className="lg:col-span-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Edit Invitation</CardTitle>
                </CardHeader>
                
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid grid-cols-3 mx-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  {/* CONTENT TAB */}
                  <TabsContent value="content" className="space-y-4 p-4">
                    {/* Basic Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="bride_name">Bride's Name</Label>
                          <Input 
                            id="bride_name" 
                            value={invitationData.bride_name}
                            onChange={(e) => handleFieldChange('bride_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="groom_name">Groom's Name</Label>
                          <Input 
                            id="groom_name" 
                            value={invitationData.groom_name}
                            onChange={(e) => handleFieldChange('groom_name', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Welcome Page Content */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Welcome Page</h3>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="welcome_title">Welcome Title</Label>
                          <Input 
                            id="welcome_title" 
                            value={invitationData.welcome_title}
                            onChange={(e) => handleFieldChange('welcome_title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="welcome_subtitle">Welcome Subtitle</Label>
                          <Input 
                            id="welcome_subtitle" 
                            value={invitationData.welcome_subtitle}
                            onChange={(e) => handleFieldChange('welcome_subtitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="welcome_message">Welcome Message</Label>
                          <Textarea 
                            id="welcome_message" 
                            value={invitationData.welcome_message}
                            onChange={(e) => handleFieldChange('welcome_message', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="welcome_button_text">Button Text</Label>
                          <Input 
                            id="welcome_button_text" 
                            value={invitationData.welcome_button_text}
                            onChange={(e) => handleFieldChange('welcome_button_text', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Preview */}
                      <div className="mt-2 p-3 border rounded-md bg-white/50">
                        <div className="text-center space-y-2">
                          <h3 className="font-dancing-script text-xl text-wedding-maroon">{invitationData.welcome_title}</h3>
                          <p className="text-sm text-wedding-gold/80">{invitationData.welcome_subtitle}</p>
                          <div className="py-2">
                            <p className="text-xs text-gray-600 italic">
                              {invitationData.welcome_message}
                            </p>
                          </div>
                          <div className="inline-block px-4 py-1 rounded-full bg-wedding-gold/80 text-white text-xs">
                            {invitationData.welcome_button_text}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Save the Date */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Save the Date</h3>
                      <div>
                        <Label htmlFor="save_date_text">Save the Date Text</Label>
                        <Input 
                          id="save_date_text" 
                          value={invitationData.save_date_text}
                          onChange={(e) => handleFieldChange('save_date_text', e.target.value)}
                        />
                      </div>
                      
                      <div className="mt-2 p-3 border rounded-md bg-white/50">
                        <div className="text-center">
                          <p className="text-sm text-wedding-gold font-medium">
                            {invitationData.save_date_text}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Wedding Details */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Wedding Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="wedding_date">Wedding Date</Label>
                          <Input 
                            id="wedding_date" 
                            type="date"
                            value={invitationData.wedding_date}
                            onChange={(e) => handleFieldChange('wedding_date', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="wedding_time">Wedding Time</Label>
                          <Input 
                            id="wedding_time" 
                            value={invitationData.wedding_time}
                            onChange={(e) => handleFieldChange('wedding_time', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="wedding_venue">Venue Name</Label>
                          <Input 
                            id="wedding_venue" 
                            value={invitationData.wedding_venue}
                            onChange={(e) => handleFieldChange('wedding_venue', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="wedding_address">Venue Address</Label>
                          <Textarea 
                            id="wedding_address" 
                            value={invitationData.wedding_address}
                            onChange={(e) => handleFieldChange('wedding_address', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="map_url">Google Maps URL (Optional)</Label>
                          <Input 
                            id="map_url" 
                            placeholder="https://maps.google.com/..."
                            value={invitationData.map_url}
                            onChange={(e) => handleFieldChange('map_url', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Couple Details */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Couple Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="couple_story">Your Love Story</Label>
                          <Textarea 
                            id="couple_story" 
                            value={invitationData.couple_story}
                            onChange={(e) => handleFieldChange('couple_story', e.target.value)}
                            rows={3}
                            placeholder="Share your journey together..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium">Bride</h4>
                            <div>
                              <Label htmlFor="bride_about">About Bride</Label>
                              <Textarea 
                                id="bride_about" 
                                value={invitationData.bride_about}
                                onChange={(e) => handleFieldChange('bride_about', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="bride_parents">Bride's Parents</Label>
                              <Input 
                                id="bride_parents" 
                                value={invitationData.bride_parents}
                                onChange={(e) => handleFieldChange('bride_parents', e.target.value)}
                                placeholder="Daughter of Mr. & Mrs..."
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium">Groom</h4>
                            <div>
                              <Label htmlFor="groom_about">About Groom</Label>
                              <Textarea 
                                id="groom_about" 
                                value={invitationData.groom_about}
                                onChange={(e) => handleFieldChange('groom_about', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="groom_parents">Groom's Parents</Label>
                              <Input 
                                id="groom_parents" 
                                value={invitationData.groom_parents}
                                onChange={(e) => handleFieldChange('groom_parents', e.target.value)}
                                placeholder="Son of Mr. & Mrs..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Events */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Events</h3>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs flex items-center gap-1"
                          onClick={addNewEvent}
                        >
                          <Plus size={14} /> Add Event
                        </Button>
                      </div>
                      
                      {invitationData.events.length === 0 ? (
                        <p className="text-xs text-gray-500 italic text-center py-2">
                          No events added yet. Click "Add Event" to get started.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {invitationData.events.map((event, index) => (
                            <div key={event.id} className="p-2 border rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-medium">Event {index + 1}</h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => removeEvent(event.id)}
                                >
                                  <Trash2 size={14} className="text-gray-500 hover:text-red-500" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-2">
                                <div>
                                  <Label htmlFor={`event_name_${event.id}`}>Event Name</Label>
                                  <Input 
                                    id={`event_name_${event.id}`} 
                                    value={event.name}
                                    onChange={(e) => handleEventChange(event.id, 'name', e.target.value)}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor={`event_date_${event.id}`}>Date</Label>
                                    <Input 
                                      id={`event_date_${event.id}`} 
                                      type="date"
                                      value={event.date instanceof Date ? 
                                        event.date.toISOString().split('T')[0] : 
                                        String(event.date).split('T')[0]}
                                      onChange={(e) => handleEventChange(event.id, 'date', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`event_time_${event.id}`}>Time</Label>
                                    <Input 
                                      id={`event_time_${event.id}`} 
                                      value={event.time}
                                      onChange={(e) => handleEventChange(event.id, 'time', e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`event_venue_${event.id}`}>Venue</Label>
                                  <Input 
                                    id={`event_venue_${event.id}`} 
                                    value={event.venue}
                                    onChange={(e) => handleEventChange(event.id, 'venue', e.target.value)}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`event_address_${event.id}`}>Address</Label>
                                  <Textarea 
                                    id={`event_address_${event.id}`} 
                                    value={event.address}
                                    onChange={(e) => handleEventChange(event.id, 'address', e.target.value)}
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Map URL */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Map URL</h3>
                      <div>
                        <Label htmlFor="map_url_input">Google Maps URL</Label>
                        <Input 
                          id="map_url_input" 
                          value={invitationData.map_url}
                          onChange={(e) => handleFieldChange('map_url', e.target.value)}
                          placeholder="https://maps.google.com/..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the Google Maps URL to help guests find your venue easily
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* RSVP Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">RSVP Information</h3>
                      
                      <div>
                        <Label htmlFor="rsvp_message">RSVP Message</Label>
                        <Textarea 
                          id="rsvp_message" 
                          value={invitationData.rsvp_message}
                          onChange={(e) => handleFieldChange('rsvp_message', e.target.value)}
                          placeholder="We would be honored by your presence..."
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="rsvp_email">RSVP Email</Label>
                        <Input 
                          id="rsvp_email" 
                          type="email"
                          value={invitationData.rsvp_email}
                          onChange={(e) => handleFieldChange('rsvp_email', e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="rsvp_phone">RSVP Phone</Label>
                        <Input 
                          id="rsvp_phone" 
                          value={invitationData.rsvp_phone}
                          onChange={(e) => handleFieldChange('rsvp_phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Custom Message */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Custom Message</h3>
                      <div>
                        <Label htmlFor="custom_message">Custom Message</Label>
                        <Textarea 
                          id="custom_message" 
                          value={invitationData.custom_message}
                          onChange={(e) => handleFieldChange('custom_message', e.target.value)}
                          placeholder="Add a custom message to your guests..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* STYLE TAB */}
                  <TabsContent value="style" className="space-y-4 p-4">
                    {/* Animation Settings */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Animations</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center justify-between space-x-2 border p-2 rounded">
                          <Label htmlFor="animation_petals">Petals</Label>
                          <Switch 
                            id="animation_petals" 
                            checked={invitationData.animations.petals}
                            onCheckedChange={(checked) => 
                              handleFieldChange('animations', {...invitationData.animations, petals: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 border p-2 rounded">
                          <Label htmlFor="animation_confetti">Confetti</Label>
                          <Switch 
                            id="animation_confetti" 
                            checked={invitationData.animations.confetti}
                            onCheckedChange={(checked) => 
                              handleFieldChange('animations', {...invitationData.animations, confetti: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between space-x-2 border p-2 rounded">
                          <Label htmlFor="animation_hearts">Hearts</Label>
                          <Switch 
                            id="animation_hearts" 
                            checked={invitationData.animations.hearts}
                            onCheckedChange={(checked) => 
                              handleFieldChange('animations', {...invitationData.animations, hearts: checked})
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Font Styles */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Font Style</h3>
                      <div>
                        <Select 
                          value={invitationData.font_style}
                          onValueChange={(value) => handleFieldChange('font_style', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select font style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">Traditional</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="elegant">Elegant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mt-2">
                        {invitationData.font_style === "traditional" && (
                          <div className="p-3 border rounded-md bg-white/50 text-center space-y-2">
                            <p className="font-dancing-script text-xl">Traditional Font</p>
                            <p className="font-playfair text-sm">Playfair Display for headings</p>
                            <p className="font-sans text-xs">Clean sans-serif for body text</p>
                          </div>
                        )}
                        {/* Add other font style previews as needed */}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Color Scheme */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Color Scheme</h3>
                      <div className="grid grid-cols-4 gap-2">
                        <div 
                          className={`h-10 rounded-md border-2 bg-wedding-gold cursor-pointer ${
                            invitationData.color_scheme === 'wedding-gold' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('color_scheme', 'wedding-gold')}
                        />
                        <div 
                          className={`h-10 rounded-md border-2 bg-pink-300 cursor-pointer ${
                            invitationData.color_scheme === 'wedding-pink' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('color_scheme', 'wedding-pink')}
                        />
                        <div 
                          className={`h-10 rounded-md border-2 bg-blue-300 cursor-pointer ${
                            invitationData.color_scheme === 'wedding-blue' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('color_scheme', 'wedding-blue')}
                        />
                        <div 
                          className={`h-10 rounded-md border-2 bg-purple-300 cursor-pointer ${
                            invitationData.color_scheme === 'wedding-purple' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('color_scheme', 'wedding-purple')}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Background Style */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Background Style</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className={`h-16 rounded-md border-2 bg-floral-pattern cursor-pointer ${
                            invitationData.background_style === 'floral' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('background_style', 'floral')}
                        >
                          <div className="h-full w-full flex items-center justify-center bg-black/10">
                            <span className="text-xs text-white font-medium">Floral</span>
                          </div>
                        </div>
                        <div 
                          className={`h-16 rounded-md border-2 bg-pattern-background cursor-pointer ${
                            invitationData.background_style === 'pattern' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('background_style', 'pattern')}
                        >
                          <div className="h-full w-full flex items-center justify-center bg-black/10">
                            <span className="text-xs text-white font-medium">Pattern</span>
                          </div>
                        </div>
                        <div 
                          className={`h-16 rounded-md border-2 bg-white cursor-pointer ${
                            invitationData.background_style === 'minimalist' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('background_style', 'minimalist')}
                        >
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-xs font-medium">Minimalist</span>
                          </div>
                        </div>
                        <div 
                          className={`h-16 rounded-md border-2 bg-gradient-to-r from-pink-100 to-purple-100 cursor-pointer ${
                            invitationData.background_style === 'gradient' ? 'border-black' : 'border-transparent'
                          }`}
                          onClick={() => handleFieldChange('background_style', 'gradient')}
                        >
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-xs font-medium">Gradient</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        className="w-full bg-wedding-gold hover:bg-wedding-deep-gold"
                        onClick={() => setActiveTab('preview')}
                      >
                        <Palette size={14} className="mr-2" /> Preview Design
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* PREVIEW TAB */}
                  <TabsContent value="preview" className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-sm font-medium">Live Preview</h3>
                      <p className="text-xs text-gray-500">
                        Changes you make will be reflected in the preview
                      </p>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-100 border-b p-2 flex items-center justify-between">
                        <span className="text-xs font-medium">Preview Mode</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 p-0 px-1"
                          onClick={() => setActiveTab('content')}
                        >
                          <Pencil size={14} className="mr-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                      </div>
                      
                      <div className="aspect-[9/16] max-h-[500px] overflow-y-auto bg-white p-2">
                        {/* This would be a mini version of the invitation */}
                        <div className="text-center p-4 border-b">
                          <h3 className="font-dancing-script text-lg text-wedding-maroon">
                            {invitationData.bride_name} & {invitationData.groom_name}
                          </h3>
                          <p className="text-xs text-wedding-gold/80">Wedding Invitation</p>
                        </div>
                        
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-600">
                            {invitationData.wedding_date && new Date(invitationData.wedding_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">{invitationData.wedding_time}</p>
                          <p className="text-sm font-medium mt-2">{invitationData.wedding_venue}</p>
                          <p className="text-xs text-gray-500">{invitationData.wedding_address}</p>
                        </div>
                        
                        {/* More preview elements would go here */}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        type="button" 
                        className="w-full bg-wedding-gold hover:bg-wedding-deep-gold"
                        onClick={() => setEditMode(false)}
                      >
                        <Eye size={14} className="mr-2" /> View Full Preview
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}
          
          {/* Preview/Full Width Container */}
          <div className={editMode ? "lg:col-span-8" : "lg:col-span-12"}>
            <Card className={`overflow-hidden border border-wedding-gold/20 ${
              !editMode ? "min-h-[calc(100vh-120px)]" : ""
            }`}>
              <CardHeader className="bg-wedding-gold/5 border-b border-wedding-gold/10 flex flex-row items-center justify-between p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-wedding-maroon">Invitation Preview</span>
                  {editMode && (
                    <span className="text-xs font-normal text-gray-500">
                      (Edit on the left panel)
                    </span>
                  )}
                </CardTitle>
                
                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                    className="gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Tabs for Welcome and Invitation */}
                <Tabs defaultValue="welcome" className="w-full">
                  <div className="bg-gray-50 border-b">
                    <TabsList className="w-full rounded-none bg-transparent h-12">
                      <TabsTrigger value="welcome" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wedding-gold data-[state=active]:shadow-none rounded-none">
                        Welcome Page
                      </TabsTrigger>
                      <TabsTrigger value="invitation" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wedding-gold data-[state=active]:shadow-none rounded-none">
                        Invitation Details
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Welcome Page Preview */}
                  <TabsContent value="welcome" className="m-0">
                    <div className={`min-h-[80vh] ${invitationData.background_style === 'floral' ? 'bg-floral-pattern' : 'bg-pattern-background'}`}>
                      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
                        <div className="glass-card p-8 text-center max-w-md border border-wedding-gold/20">
                          <h1 className={`font-great-vibes text-3xl sm:text-4xl text-wedding-maroon mb-4`}>
                            {invitationData.welcome_title || `${invitationData.bride_name} & ${invitationData.groom_name}`}
                          </h1>
                          
                          <p className="font-dancing-script text-xl text-wedding-gold mb-6">
                            {invitationData.welcome_subtitle || "Join us to celebrate our special day"}
                          </p>
                          
                          <div className="mb-8">
                            <p className="text-gray-600">
                              {invitationData.welcome_message || "We are excited to share our joy with you as we begin our journey together."}
                            </p>
                          </div>
                          
                          <Button className="bg-wedding-gold hover:bg-wedding-deep-gold text-white">
                            {invitationData.welcome_button_text || "View Invitation"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Invitation Details Preview */}
                  <TabsContent value="invitation" className="m-0">
                    <div className={`min-h-[80vh] ${invitationData.background_style === 'floral' ? 'bg-floral-pattern' : 'bg-pattern-background'}`}>
                      <div className="max-w-4xl mx-auto py-8 px-4">
                        <div className="text-center mb-8">
                          <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon">
                            {invitationData.bride_name} & {invitationData.groom_name}
                          </h1>
                          <p className="font-dancing-script text-xl text-wedding-gold mt-2">
                            {invitationData.invitation_title || "Wedding Invitation"}
                          </p>
                          <p className="text-sm text-gray-600 mt-4">
                            {invitationData.wedding_date && new Date(invitationData.wedding_date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            {invitationData.wedding_time && ` at ${invitationData.wedding_time}`}
                          </p>
                        </div>
                        
                        <div className="w-full py-6">
                          <div className="max-w-4xl mx-auto px-4">
                            <div className="glass-card p-6 border border-wedding-gold/30">
                              <div className="text-center mb-6">
                                <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-2">
                                  Our Story
                                </h2>
                                <p className="text-gray-600">
                                  {invitationData.couple_story}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                  <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                    {invitationData.bride_name}
                                  </h3>
                                  <p className="text-gray-600 text-center">
                                    {invitationData.bride_about}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-4 text-center italic">
                                    {invitationData.bride_parents}
                                  </p>
                                </div>
                                
                                <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                  <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                    {invitationData.groom_name}
                                  </h3>
                                  <p className="text-gray-600 text-center">
                                    {invitationData.groom_about}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-4 text-center italic">
                                    {invitationData.groom_parents}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {invitationData.events && invitationData.events.length > 0 && (
                          <div className="w-full py-6 bg-wedding-cream/20">
                            <div className="max-w-4xl mx-auto px-4">
                              <div className="text-center mb-6">
                                <h2 className="font-dancing-script text-2xl text-wedding-maroon">
                                  Wedding Events
                                </h2>
                              </div>
                              
                              <div className="space-y-4">
                                {invitationData.events.map((event) => (
                                  <div key={event.id} className="glass-card p-4 border border-wedding-gold/30">
                                    <h3 className="font-playfair text-lg text-wedding-maroon">
                                      {event.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2">
                                      <span className="mr-2 font-medium">Date:</span>
                                      <span>
                                        {event.date instanceof Date ? 
                                          event.date.toLocaleDateString() : 
                                          new Date(event.date).toLocaleDateString()}
                                      </span>
                                      <span className="mx-2">•</span>
                                      <span className="mr-2 font-medium">Time:</span>
                                      <span>{event.time}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                                      <span className="mr-2 font-medium">Venue:</span>
                                      <span>{event.venue}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                                      <span className="mr-2 font-medium">Address:</span>
                                      <span>{event.address}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="w-full py-6">
                          {/* Additional content like RSVP, venue details, etc. can be added here */}
                          <div className="text-center pt-6 pb-8">
                            <p className="italic text-gray-600">{invitationData.custom_message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
