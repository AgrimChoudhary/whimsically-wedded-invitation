
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ImagePlus, Upload, Save, ArrowLeft, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import InvitationPreview from '@/components/InvitationPreview';
import { 
  uploadImageToSupabase, 
  createWeddingInvitation, 
  getDefaultInvitationTemplate,
} from '@/lib/supabase-helpers';
import { FloatingPetals } from '@/components/AnimatedElements';

// Define the Event type to ensure consistency
interface EventType {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}

// Define the full InvitationData type
interface InvitationData {
  bride_name: string;
  groom_name: string;
  couple_image_url: string;
  wedding_date: string;
  wedding_time: string;
  wedding_venue: string;
  wedding_address: string;
  bride_family: { 
    id: string; 
    name: string; 
    relation: string; 
    description: string;
  }[];
  groom_family: { 
    id: string; 
    name: string; 
    relation: string; 
    description: string;
  }[];
  events: EventType[];
  gallery_images: any[];
  custom_message: string;
  welcome_page_enabled?: boolean;
}

const CustomizeInvitation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreviewHint, setShowPreviewHint] = useState(true);
  const [invitationData, setInvitationData] = useState<InvitationData>(getDefaultInvitationTemplate() as InvitationData);
  const [coupleImageFile, setCoupleImageFile] = useState<File | null>(null);
  const [coupleImagePreview, setCoupleImagePreview] = useState<string | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [previewPage, setPreviewPage] = useState<'welcome' | 'invitation'>('welcome');
  const [showEditHints, setShowEditHints] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initial setup
    setIsLoading(true);
    loadTemplateData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  const loadTemplateData = () => {
    const templateData = getDefaultInvitationTemplate();
    
    // Ensure all dates are strings for consistency
    const formattedTemplateData = {
      ...templateData,
      events: templateData.events.map((event: any) => ({
        ...event,
        date: typeof event.date === 'string' 
          ? event.date 
          : (event.date instanceof Date 
              ? event.date.toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0])
      }))
    };
    
    setInvitationData(formattedTemplateData as InvitationData);
  };

  const handleInputChange = (field: string, value: any) => {
    setInvitationData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoupleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCoupleImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setCoupleImagePreview(reader.result as string);
      setInvitationData(prev => ({ ...prev, couple_image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setGalleryImageFiles(prev => [...prev, ...newFiles]);
    
    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryImagePreviews(prev => [...prev, reader.result as string]);
        setInvitationData(prev => ({ 
          ...prev, 
          gallery_images: [...prev.gallery_images, { image: reader.result as string, name: file.name }] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    const newGalleryFiles = [...galleryImageFiles];
    newGalleryFiles.splice(index, 1);
    setGalleryImageFiles(newGalleryFiles);
    
    const newGalleryPreviews = [...galleryImagePreviews];
    newGalleryPreviews.splice(index, 1);
    setGalleryImagePreviews(newGalleryPreviews);
    
    const newGalleryImages = [...invitationData.gallery_images];
    newGalleryImages.splice(index, 1);
    setInvitationData(prev => ({ ...prev, gallery_images: newGalleryImages }));
  };

  const handleEventChange = (index: number, field: string, value: any) => {
    const updatedEvents = [...invitationData.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setInvitationData(prev => ({ ...prev, events: updatedEvents }));
  };

  const addEvent = () => {
    const newEvent: EventType = {
      id: Math.random().toString(36).substring(2, 9),
      name: "New Event",
      date: new Date().toISOString().split('T')[0],
      time: "12:00 PM",
      venue: "Venue Name",
      address: "Venue Address"
    };
    
    setInvitationData(prev => ({ 
      ...prev, 
      events: [...prev.events, newEvent] 
    }));
  };

  const removeEvent = (index: number) => {
    const updatedEvents = [...invitationData.events];
    updatedEvents.splice(index, 1);
    setInvitationData(prev => ({ ...prev, events: updatedEvents }));
  };

  const handleFamilyMemberChange = (family: 'bride_family' | 'groom_family', index: number, field: string, value: any) => {
    const updatedFamily = [...invitationData[family]];
    updatedFamily[index] = { ...updatedFamily[index], [field]: value };
    setInvitationData(prev => ({ ...prev, [family]: updatedFamily }));
  };

  const addFamilyMember = (family: 'bride_family' | 'groom_family') => {
    const newMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: "Family Member Name",
      relation: "Relation",
      description: "Description"
    };
    
    setInvitationData(prev => ({ 
      ...prev, 
      [family]: [...prev[family], newMember] 
    }));
  };

  const removeFamilyMember = (family: 'bride_family' | 'groom_family', index: number) => {
    const updatedFamily = [...invitationData[family]];
    updatedFamily.splice(index, 1);
    setInvitationData(prev => ({ ...prev, [family]: updatedFamily }));
  };

  const handleSaveInvitation = async () => {
    try {
      setIsSaving(true);
      
      let finalInvitationData = { ...invitationData };
      
      // Upload couple image to Supabase if exists
      if (coupleImageFile) {
        const coupleImageUrl = await uploadImageToSupabase(coupleImageFile, 'couples');
        if (coupleImageUrl) {
          finalInvitationData.couple_image_url = coupleImageUrl;
        }
      }
      
      // Upload gallery images to Supabase if exists
      if (galleryImageFiles.length > 0) {
        const uploadPromises = galleryImageFiles.map(file => uploadImageToSupabase(file, 'gallery'));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const galleryImages = uploadedUrls
          .filter(url => url !== null)
          .map(url => ({ image: url as string }));
          
        finalInvitationData.gallery_images = galleryImages;
      }
      
      // Format events for database
      const formattedEvents = finalInvitationData.events.map(event => ({
        name: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        address: event.address
      }));

      // Save to Supabase
      const data = await createWeddingInvitation({
        ...finalInvitationData,
        events: formattedEvents
      });
      
      toast({
        title: "Success!",
        description: "Your invitation has been created!",
      });

      // Navigate to the new invitation
      navigate(`/invitation/${data.id}`);
      
    } catch (error) {
      console.error('Error saving invitation:', error);
      toast({
        title: "Error",
        description: "Failed to save your invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pattern-background flex items-center justify-center">
        <div className="loading-overlay">
          <div className="loading-spinner mb-4"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Creating your invitation...</p>
        </div>
      </div>
    );
  }

  // Handle updates from InvitationPreview component
  const handlePreviewUpdate = (field: string, value: any) => {
    if (field === 'showEditHints') {
      setShowEditHints(value);
    } else {
      handleInputChange(field, value);
    }
  };

  return (
    <div className="min-h-screen pattern-background">
      <div className="py-4 px-6 sticky top-0 z-50 bg-wedding-cream/80 backdrop-blur-sm border-b border-wedding-gold/20 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="outline"
            size="sm"
            className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          
          <h1 className="font-great-vibes text-xl sm:text-2xl text-center text-wedding-maroon">
            Create Your Invitation
          </h1>
          
          <Button 
            disabled={isSaving}
            className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
            size="sm"
            onClick={handleSaveInvitation}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving
              </>
            ) : (
              <>
                <Save size={16} className="mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview column */}
        <div className="order-2 lg:order-1">
          <div className="sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)] p-4">
            <div className="p-4 mb-6 bg-wedding-gold/10 rounded-lg border border-wedding-gold/20 text-center relative">
              <h2 className="font-dancing-script text-xl text-wedding-maroon mb-2">Preview</h2>
              {showPreviewHint && (
                <>
                  <p className="text-sm text-gray-600 mb-4">This is how your invitation will look to guests</p>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2"
                    onClick={() => setShowPreviewHint(false)}
                  >
                    <X size={16} />
                  </Button>
                </>
              )}
            </div>
            
            <div className="shadow-lg border border-wedding-gold/20 bg-white rounded-lg overflow-hidden">
              <InvitationPreview 
                invitationData={invitationData}
                editable={true}
                onUpdate={handlePreviewUpdate}
                showEditHints={showEditHints}
              />
            </div>
          </div>
        </div>
        
        {/* Editor column */}
        <div className="order-1 lg:order-2">
          <div className="p-4 bg-white rounded-lg shadow-lg border border-wedding-gold/20">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bride_name">Bride's Name</Label>
                      <Input 
                        id="bride_name"
                        value={invitationData.bride_name}
                        onChange={e => handleInputChange('bride_name', e.target.value)}
                        placeholder="Bride's Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groom_name">Groom's Name</Label>
                      <Input 
                        id="groom_name"
                        value={invitationData.groom_name}
                        onChange={e => handleInputChange('groom_name', e.target.value)}
                        placeholder="Groom's Name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="wedding_date">Wedding Date</Label>
                    <Input 
                      id="wedding_date"
                      type="date"
                      value={invitationData.wedding_date}
                      onChange={e => handleInputChange('wedding_date', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wedding_time">Wedding Time</Label>
                      <Input 
                        id="wedding_time"
                        value={invitationData.wedding_time}
                        onChange={e => handleInputChange('wedding_time', e.target.value)}
                        placeholder="Wedding Time"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wedding_venue">Wedding Venue</Label>
                      <Input 
                        id="wedding_venue"
                        value={invitationData.wedding_venue}
                        onChange={e => handleInputChange('wedding_venue', e.target.value)}
                        placeholder="Wedding Venue"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="wedding_address">Wedding Address</Label>
                    <Textarea 
                      id="wedding_address"
                      value={invitationData.wedding_address}
                      onChange={e => handleInputChange('wedding_address', e.target.value)}
                      placeholder="Wedding Address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Couple Image</Label>
                    {coupleImagePreview ? (
                      <div className="relative">
                        <img 
                          src={coupleImagePreview} 
                          alt="Couple Preview" 
                          className="w-full max-h-64 object-contain rounded-md border border-wedding-gold/20"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/70 border-wedding-gold/20"
                          onClick={() => {
                            setCoupleImageFile(null);
                            setCoupleImagePreview(null);
                            setInvitationData(prev => ({ ...prev, couple_image_url: "" }));
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center border-2 border-dashed border-wedding-gold/30 rounded-md h-32 bg-wedding-cream/20">
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <ImagePlus className="h-10 w-10 text-wedding-gold/50" />
                          <span className="mt-2 text-sm text-wedding-maroon">Upload Image</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleCoupleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="custom_message">Custom Message</Label>
                    <Textarea 
                      id="custom_message"
                      value={invitationData.custom_message}
                      onChange={e => handleInputChange('custom_message', e.target.value)}
                      placeholder="Add a personal message to your guests"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="events">
                <div className="space-y-4">
                  {invitationData.events.map((event, index) => (
                    <div 
                      key={event.id} 
                      className="border border-wedding-gold/20 rounded-md p-4 bg-wedding-cream/10 relative"
                    >
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="absolute top-2 right-2 h-7 w-7 bg-white/70 border-wedding-gold/20"
                        onClick={() => removeEvent(index)}
                      >
                        <X size={14} />
                      </Button>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`event-name-${index}`}>Event Name</Label>
                          <Input 
                            id={`event-name-${index}`}
                            value={event.name}
                            onChange={e => handleEventChange(index, 'name', e.target.value)}
                            placeholder="Event Name"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`event-date-${index}`}>Date</Label>
                            <Input 
                              id={`event-date-${index}`}
                              type="date"
                              value={event.date}
                              onChange={e => handleEventChange(index, 'date', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`event-time-${index}`}>Time</Label>
                            <Input 
                              id={`event-time-${index}`}
                              value={event.time}
                              onChange={e => handleEventChange(index, 'time', e.target.value)}
                              placeholder="Event Time"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`event-venue-${index}`}>Venue</Label>
                          <Input 
                            id={`event-venue-${index}`}
                            value={event.venue}
                            onChange={e => handleEventChange(index, 'venue', e.target.value)}
                            placeholder="Venue Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`event-address-${index}`}>Address</Label>
                          <Textarea 
                            id={`event-address-${index}`}
                            value={event.address}
                            onChange={e => handleEventChange(index, 'address', e.target.value)}
                            placeholder="Venue Address"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    className="w-full border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
                    onClick={addEvent}
                  >
                    Add Event
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="family">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg text-wedding-maroon mb-2">Bride's Family</h3>
                    <div className="space-y-4">
                      {invitationData.bride_family.map((member, index) => (
                        <div 
                          key={member.id} 
                          className="border border-wedding-gold/20 rounded-md p-4 bg-wedding-cream/10 relative"
                        >
                          <Button 
                            size="icon" 
                            variant="outline"
                            className="absolute top-2 right-2 h-7 w-7 bg-white/70 border-wedding-gold/20"
                            onClick={() => removeFamilyMember('bride_family', index)}
                          >
                            <X size={14} />
                          </Button>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`bride-family-name-${index}`}>Name</Label>
                              <Input 
                                id={`bride-family-name-${index}`}
                                value={member.name}
                                onChange={e => handleFamilyMemberChange('bride_family', index, 'name', e.target.value)}
                                placeholder="Family Member Name"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`bride-family-relation-${index}`}>Relation</Label>
                              <Input 
                                id={`bride-family-relation-${index}`}
                                value={member.relation}
                                onChange={e => handleFamilyMemberChange('bride_family', index, 'relation', e.target.value)}
                                placeholder="Relation to Bride"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`bride-family-description-${index}`}>Description (Optional)</Label>
                              <Textarea 
                                id={`bride-family-description-${index}`}
                                value={member.description}
                                onChange={e => handleFamilyMemberChange('bride_family', index, 'description', e.target.value)}
                                placeholder="Brief description"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="w-full border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
                        onClick={() => addFamilyMember('bride_family')}
                      >
                        Add Family Member
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg text-wedding-maroon mb-2">Groom's Family</h3>
                    <div className="space-y-4">
                      {invitationData.groom_family.map((member, index) => (
                        <div 
                          key={member.id} 
                          className="border border-wedding-gold/20 rounded-md p-4 bg-wedding-cream/10 relative"
                        >
                          <Button 
                            size="icon" 
                            variant="outline"
                            className="absolute top-2 right-2 h-7 w-7 bg-white/70 border-wedding-gold/20"
                            onClick={() => removeFamilyMember('groom_family', index)}
                          >
                            <X size={14} />
                          </Button>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`groom-family-name-${index}`}>Name</Label>
                              <Input 
                                id={`groom-family-name-${index}`}
                                value={member.name}
                                onChange={e => handleFamilyMemberChange('groom_family', index, 'name', e.target.value)}
                                placeholder="Family Member Name"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`groom-family-relation-${index}`}>Relation</Label>
                              <Input 
                                id={`groom-family-relation-${index}`}
                                value={member.relation}
                                onChange={e => handleFamilyMemberChange('groom_family', index, 'relation', e.target.value)}
                                placeholder="Relation to Groom"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`groom-family-description-${index}`}>Description (Optional)</Label>
                              <Textarea 
                                id={`groom-family-description-${index}`}
                                value={member.description}
                                onChange={e => handleFamilyMemberChange('groom_family', index, 'description', e.target.value)}
                                placeholder="Brief description"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="w-full border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
                        onClick={() => addFamilyMember('groom_family')}
                      >
                        Add Family Member
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImagePreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border border-wedding-gold/20 relative">
                        <img 
                          src={preview} 
                          alt={`Gallery image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute top-1 right-1 h-6 w-6 bg-white/70 border-wedding-gold/20"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="aspect-square border-2 border-dashed border-wedding-gold/30 rounded-md flex items-center justify-center bg-wedding-cream/20">
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="h-8 w-8 text-wedding-gold/50" />
                        <span className="mt-1 text-xs text-wedding-maroon">Add Photos</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          multiple 
                          onChange={handleGalleryImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Upload photos to showcase in your invitation's gallery section
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
