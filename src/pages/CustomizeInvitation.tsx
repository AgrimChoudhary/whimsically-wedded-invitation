
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Save, Image, Users, Calendar, MapPin, Mail, Phone, Eye, Camera, Upload, PlusCircle, Settings, Paintbrush, LayoutGrid } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageToSupabase, createWeddingInvitation, generateUniqueInvitationLink, getDefaultInvitationTemplate } from '@/lib/supabase-helpers';
import { supabase } from "@/integrations/supabase/client";
import { useGuest } from '@/context/GuestContext';

// Import components that will be editable
import InvitationHeader from '@/components/InvitationHeader';
import WelcomeForm from '@/components/WelcomeForm';
import CountdownTimer from '@/components/CountdownTimer';
import { FloatingPetals } from '@/components/AnimatedElements';
import { format } from 'date-fns';

const CustomizeInvitation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { guestName } = useGuest();
  const [activeTab, setActiveTab] = useState("welcome-page");
  const [activeSectionTab, setActiveSectionTab] = useState("design");
  const [uploading, setUploading] = useState(false);
  const [invitationData, setInvitationData] = useState(getDefaultInvitationTemplate());
  const [generatedLink, setGeneratedLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingElement, setEditingElement] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  // Handle direct updates to data
  const handleDirectUpdate = (field, value) => {
    console.log("Updating field:", field, "with value:", value);
    
    if (field === 'names') {
      const names = value.split('&');
      if (names.length === 2) {
        setInvitationData(prev => ({
          ...prev,
          bride_name: names[0].trim(),
          groom_name: names[1].trim()
        }));
      }
    } else if (field === 'couple_image_upload') {
      document.getElementById('couple-image-upload')?.click();
    } else if (field === 'wedding_date') {
      setInvitationData(prev => ({
        ...prev,
        wedding_date: new Date(value).toISOString().split('T')[0]
      }));
    } else {
      setInvitationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle image uploads
  const handleImageUpload = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    setUploading(true);
    try {
      const imageUrl = await uploadImageToSupabase(files[0], type === 'couple' ? 'couple_photos' : 'gallery_images');
      
      if (imageUrl) {
        if (type === 'couple') {
          setInvitationData(prev => ({
            ...prev,
            couple_image_url: imageUrl
          }));
        } else if (type === 'gallery') {
          setInvitationData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, { id: `gallery_${Date.now()}`, image: imageUrl }]
          }));
        } else if (type === 'background') {
          setInvitationData(prev => ({
            ...prev,
            background_image: imageUrl
          }));
        }
        
        setUploading(false);
        
        toast({
          title: "Image Uploaded",
          description: `Your ${type} image has been successfully uploaded.`
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

  // Handle events management
  const handleAddEvent = () => {
    const newEvent = {
      id: `event_${Date.now()}`,
      event_name: "New Event",
      event_date: new Date().toISOString().split('T')[0],
      event_time: "12:00 PM",
      event_venue: "Event Venue",
      event_address: "Event Address"
    };
    
    setInvitationData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
    
    toast({
      title: "Event Added",
      description: "A new event has been added to your invitation."
    });
  };
  
  const handleRemoveEvent = (id) => {
    setInvitationData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== id)
    }));
    
    toast({
      title: "Event Removed",
      description: "The event has been removed from your invitation."
    });
  };
  
  const handleUpdateEvent = (id, field, value) => {
    setInvitationData(prev => ({
      ...prev,
      events: prev.events.map(event => 
        event.id === id ? { ...event, [field]: value } : event
      )
    }));
  };

  // Handle family members
  const handleAddFamilyMember = (side) => {
    const newMember = {
      id: `member_${Date.now()}`,
      name: `New ${side === 'bride' ? 'Bride' : 'Groom'} Family Member`,
      relation: `Relation to ${side === 'bride' ? 'Bride' : 'Groom'}`,
      description: "Add a description here"
    };
    
    const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
    
    setInvitationData(prev => {
      const currentFamily = Array.isArray(prev[familyKey]) ? prev[familyKey] : [];
      return {
        ...prev,
        [familyKey]: [...currentFamily, newMember]
      };
    });
    
    toast({
      title: "Family Member Added",
      description: `A new ${side === 'bride' ? 'bride' : 'groom'} family member has been added.`
    });
  };
  
  const handleRemoveFamilyMember = (id, side) => {
    const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
    
    setInvitationData(prev => {
      const currentFamily = Array.isArray(prev[familyKey]) ? prev[familyKey] : [];
      return {
        ...prev,
        [familyKey]: currentFamily.filter(member => member.id !== id)
      };
    });
    
    toast({
      title: "Family Member Removed",
      description: "The family member has been removed from your invitation."
    });
  };
  
  const handleUpdateFamilyMember = (id, side, field, value) => {
    const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
    
    setInvitationData(prev => {
      const currentFamily = Array.isArray(prev[familyKey]) ? prev[familyKey] : [];
      return {
        ...prev,
        [familyKey]: currentFamily.map(member => 
          member.id === id ? { ...member, [field]: value } : member
        )
      };
    });
  };

  // Save the invitation
  const saveInvitation = async () => {
    setSaving(true);
    try {
      const savedInvitation = await createWeddingInvitation(invitationData);
      
      if (savedInvitation) {
        const link = generateUniqueInvitationLink(savedInvitation.id);
        setGeneratedLink(link);
        
        toast({
          title: "Invitation Created!",
          description: "Your customized invitation has been successfully saved.",
        });
        
        navigator.clipboard.writeText(link);
        toast({
          title: "Link Copied!",
          description: "Share this link with your guests.",
        });
      }
    } catch (error) {
      console.error("Error saving invitation:", error);
      toast({
        title: "Error",
        description: "Failed to save your invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : format(date, "MMMM d, yyyy");
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="min-h-screen pattern-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="font-great-vibes text-3xl text-wedding-maroon">
              Customize Your Wedding Invitation
            </h1>
          </div>
          
          <Button 
            variant={isPreview ? "default" : "outline"}
            onClick={togglePreview}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            {isPreview ? "Exit Preview" : "Preview"}
          </Button>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          id="couple-image-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'couple')}
          disabled={uploading}
        />
        
        <input
          type="file"
          id="gallery-image-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'gallery')}
          disabled={uploading}
        />
        
        <input
          type="file"
          id="background-image-upload"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'background')}
          disabled={uploading}
        />

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invitation Designer</CardTitle>
                  <CardDescription>
                    Customize every aspect of your wedding invitation
                  </CardDescription>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[500px]">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="welcome-page" className="flex items-center justify-center">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>Welcome Page</span>
                    </TabsTrigger>
                    <TabsTrigger value="invitation-page" className="flex items-center justify-center">
                      <Paintbrush className="mr-2 h-4 w-4" />
                      <span>Invitation Details</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab}>
                {/* Welcome Page Editor */}
                <TabsContent value="welcome-page" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview Panel */}
                    <div className="w-full md:w-2/3 border rounded-lg bg-white overflow-hidden">
                      <div className="max-h-[70vh] overflow-y-auto">
                        {isPreview ? (
                          <div className="min-h-screen pattern-background">
                            <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                              <div className="absolute inset-0 bg-wedding-cream bg-opacity-50 z-0"></div>
                              <FloatingPetals />
                              <div className="relative z-10 text-center mb-8">
                                <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4 opacity-0 animate-fade-in-up relative inline-block">
                                  {invitationData.bride_name} & {invitationData.groom_name}
                                </h1>
                                <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                  <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold mb-2">
                                    Wedding Invitation
                                  </h2>
                                </div>
                              </div>
                              <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
                                <div className="glass-card w-full p-8 flex flex-col items-center space-y-6 relative overflow-hidden border-wedding-gold/30">
                                  <div className="text-center mb-4">
                                    <h2 className="text-2xl font-playfair text-wedding-maroon mb-1">Welcome, Guest</h2>
                                    <p className="text-sm text-gray-600">Your special invitation awaits</p>
                                  </div>
                                  <div className="text-center relative">
                                    <p className="text-wedding-gold font-dancing-script text-xl md:text-2xl mb-4 px-4 relative z-10">
                                      {invitationData.bride_name} & {invitationData.groom_name} cordially invite you to celebrate their wedding
                                    </p>
                                  </div>
                                  <Button className="relative overflow-hidden bg-wedding-blush text-wedding-maroon hover:bg-wedding-blush/90 px-8 py-6 rounded-full">
                                    <span className="flex items-center font-medium text-base">Open Invitation</span>
                                  </Button>
                                </div>
                                <div className="mt-8 text-center">
                                  <p className="text-sm text-gray-500 font-dancing-script mb-3">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-wedding-cream/50 text-wedding-maroon border border-wedding-gold/20">
                                      Save the Date: {formatDate(invitationData.wedding_date)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 relative">
                            <div className="min-h-[70vh] pattern-background">
                              <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                                <div className="absolute inset-0 bg-wedding-cream bg-opacity-50 z-0"></div>
                                <FloatingPetals />
                                
                                <div className="relative z-10 text-center mb-8 border-2 border-dashed border-wedding-gold/40 p-4 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('couple_names')}>
                                  {editingElement === 'couple_names' ? (
                                    <div className="flex flex-col gap-2 p-2 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Couple Names:</label>
                                      <Input
                                        value={`${invitationData.bride_name} & ${invitationData.groom_name}`}
                                        onChange={(e) => handleDirectUpdate('names', e.target.value)}
                                        placeholder="Bride & Groom"
                                        className="mb-2"
                                      />
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4 relative inline-block">
                                        {invitationData.bride_name} & {invitationData.groom_name}
                                      </h1>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="relative z-10 text-center border-2 border-dashed border-wedding-gold/40 p-4 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('wedding_title')}>
                                  {editingElement === 'wedding_title' ? (
                                    <div className="flex flex-col gap-2 p-2 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Invitation Title:</label>
                                      <Input
                                        value={invitationData.invitation_title || "Wedding Invitation"}
                                        onChange={(e) => handleDirectUpdate('invitation_title', e.target.value)}
                                        placeholder="Wedding Invitation"
                                        className="mb-2"
                                      />
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold mb-2">
                                        {invitationData.invitation_title || "Wedding Invitation"}
                                      </h2>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="relative z-10 border-2 border-dashed border-wedding-gold/40 p-4 mt-8 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('welcome_card')}>
                                  {editingElement === 'welcome_card' ? (
                                    <div className="flex flex-col gap-2 p-2 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Welcome Message:</label>
                                      <Input
                                        value={invitationData.welcome_title || "Welcome, Guest"}
                                        onChange={(e) => handleDirectUpdate('welcome_title', e.target.value)}
                                        placeholder="Welcome, Guest"
                                        className="mb-2"
                                      />
                                      <label className="text-sm font-medium">Welcome Subtitle:</label>
                                      <Input
                                        value={invitationData.welcome_subtitle || "Your special invitation awaits"}
                                        onChange={(e) => handleDirectUpdate('welcome_subtitle', e.target.value)}
                                        placeholder="Your special invitation awaits"
                                        className="mb-2"
                                      />
                                      <label className="text-sm font-medium">Main Message:</label>
                                      <Textarea
                                        value={invitationData.welcome_message || `${invitationData.bride_name} & ${invitationData.groom_name} cordially invite you to celebrate their wedding`}
                                        onChange={(e) => handleDirectUpdate('welcome_message', e.target.value)}
                                        placeholder="Invitation message"
                                        className="mb-2"
                                      />
                                      <label className="text-sm font-medium">Button Text:</label>
                                      <Input
                                        value={invitationData.welcome_button_text || "Open Invitation"}
                                        onChange={(e) => handleDirectUpdate('welcome_button_text', e.target.value)}
                                        placeholder="Open Invitation"
                                        className="mb-2"
                                      />
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="glass-card w-full p-8 flex flex-col items-center space-y-6 relative overflow-hidden border-wedding-gold/30">
                                        <div className="text-center mb-4">
                                          <h2 className="text-2xl font-playfair text-wedding-maroon mb-1">{invitationData.welcome_title || "Welcome, Guest"}</h2>
                                          <p className="text-sm text-gray-600">{invitationData.welcome_subtitle || "Your special invitation awaits"}</p>
                                        </div>
                                        <div className="text-center relative">
                                          <p className="text-wedding-gold font-dancing-script text-xl md:text-2xl mb-4 px-4 relative z-10">
                                            {invitationData.welcome_message || `${invitationData.bride_name} & ${invitationData.groom_name} cordially invite you to celebrate their wedding`}
                                          </p>
                                        </div>
                                        <Button className="relative overflow-hidden bg-wedding-blush text-wedding-maroon hover:bg-wedding-blush/90 px-8 py-6 rounded-full">
                                          <span className="flex items-center font-medium text-base">{invitationData.welcome_button_text || "Open Invitation"}</span>
                                        </Button>
                                      </div>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="relative z-10 border-2 border-dashed border-wedding-gold/40 p-4 mt-8 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('save_date')}>
                                  {editingElement === 'save_date' ? (
                                    <div className="flex flex-col gap-2 p-2 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Wedding Date:</label>
                                      <Input
                                        type="date"
                                        value={invitationData.wedding_date}
                                        onChange={(e) => handleDirectUpdate('wedding_date', e.target.value)}
                                        className="mb-2"
                                      />
                                      <label className="text-sm font-medium">Save the Date Text:</label>
                                      <Input
                                        value={invitationData.save_date_text || "Save the Date"}
                                        onChange={(e) => handleDirectUpdate('save_date_text', e.target.value)}
                                        placeholder="Save the Date"
                                        className="mb-2"
                                      />
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500 font-dancing-script mb-3">
                                          <span className="inline-block px-2 py-0.5 rounded-full bg-wedding-cream/50 text-wedding-maroon border border-wedding-gold/20">
                                            {invitationData.save_date_text || "Save the Date"}: {formatDate(invitationData.wedding_date)}
                                          </span>
                                        </p>
                                      </div>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Control Panel */}
                    <div className="w-full md:w-1/3">
                      <Tabs defaultValue="design" value={activeSectionTab} onValueChange={setActiveSectionTab}>
                        <TabsList className="grid grid-cols-2 w-full mb-4">
                          <TabsTrigger value="design">Design</TabsTrigger>
                          <TabsTrigger value="content">Content</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="design" className="mt-0 space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Color Theme</h3>
                            <div className="grid grid-cols-5 gap-2">
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-maroon border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'maroon')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-gold border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'gold')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-blush border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'blush')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-emerald-600 border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'emerald')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-sky-600 border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'blue')}
                              ></button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Background Style</h3>
                            <div className="grid grid-cols-3 gap-2">
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'pattern')}
                              >
                                <div className="h-12 rounded pattern-background mb-2"></div>
                                <span className="text-sm">Pattern</span>
                              </button>
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'solid')}
                              >
                                <div className="h-12 rounded bg-wedding-cream mb-2"></div>
                                <span className="text-sm">Solid</span>
                              </button>
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'gradient')}
                              >
                                <div className="h-12 rounded bg-gradient-to-br from-wedding-cream to-wedding-blush mb-2"></div>
                                <span className="text-sm">Gradient</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Animations</h3>
                            <div className="flex space-x-2">
                              <Button 
                                variant={invitationData.animations?.includes('petals') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('petals') 
                                    ? current.filter(a => a !== 'petals') 
                                    : [...current, 'petals'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Petals
                              </Button>
                              <Button 
                                variant={invitationData.animations?.includes('confetti') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('confetti') 
                                    ? current.filter(a => a !== 'confetti') 
                                    : [...current, 'confetti'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Confetti
                              </Button>
                              <Button 
                                variant={invitationData.animations?.includes('hearts') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('hearts') 
                                    ? current.filter(a => a !== 'hearts') 
                                    : [...current, 'hearts'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Hearts
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Font Style</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                variant={invitationData.font_style === 'elegant' ? "default" : "outline"}
                                onClick={() => handleDirectUpdate('font_style', 'elegant')}
                                className="flex-1"
                                size="sm"
                              >
                                <span className="font-great-vibes">Elegant</span>
                              </Button>
                              <Button 
                                variant={invitationData.font_style === 'modern' ? "default" : "outline"}
                                onClick={() => handleDirectUpdate('font_style', 'modern')}
                                className="flex-1"
                                size="sm"
                              >
                                <span className="font-sans">Modern</span>
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="content" className="mt-0 space-y-4">
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Couple Information</h3>
                            <div>
                              <label className="text-sm font-medium">Bride's Name</label>
                              <Input 
                                value={invitationData.bride_name} 
                                onChange={(e) => handleDirectUpdate('bride_name', e.target.value)}
                                placeholder="Enter bride's name"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Groom's Name</label>
                              <Input 
                                value={invitationData.groom_name} 
                                onChange={(e) => handleDirectUpdate('groom_name', e.target.value)}
                                placeholder="Enter groom's name"
                              />
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Welcome Card</h3>
                            <div>
                              <label className="text-sm font-medium">Welcome Title</label>
                              <Input 
                                value={invitationData.welcome_title || "Welcome, Guest"} 
                                onChange={(e) => handleDirectUpdate('welcome_title', e.target.value)}
                                placeholder="Welcome title"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Welcome Subtitle</label>
                              <Input 
                                value={invitationData.welcome_subtitle || "Your special invitation awaits"} 
                                onChange={(e) => handleDirectUpdate('welcome_subtitle', e.target.value)}
                                placeholder="Welcome subtitle"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Welcome Message</label>
                              <Textarea 
                                value={invitationData.welcome_message || `${invitationData.bride_name} & ${invitationData.groom_name} cordially invite you to celebrate their wedding`} 
                                onChange={(e) => handleDirectUpdate('welcome_message', e.target.value)}
                                placeholder="Welcome message"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Button Text</label>
                              <Input 
                                value={invitationData.welcome_button_text || "Open Invitation"} 
                                onChange={(e) => handleDirectUpdate('welcome_button_text', e.target.value)}
                                placeholder="Button text"
                              />
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Wedding Date</h3>
                            <div>
                              <label className="text-sm font-medium">Wedding Date</label>
                              <Input 
                                type="date"
                                value={invitationData.wedding_date} 
                                onChange={(e) => handleDirectUpdate('wedding_date', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Save the Date Text</label>
                              <Input 
                                value={invitationData.save_date_text || "Save the Date"} 
                                onChange={(e) => handleDirectUpdate('save_date_text', e.target.value)}
                                placeholder="Save the Date"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Invitation Page Editor */}
                <TabsContent value="invitation-page" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview Panel */}
                    <div className="w-full md:w-2/3 border rounded-lg bg-white overflow-hidden">
                      <div className="max-h-[70vh] overflow-y-auto">
                        {isPreview ? (
                          <div className="min-h-screen pattern-background">
                            <div className="min-h-full flex flex-col relative overflow-hidden">
                              <FloatingPetals />
                              
                              <div className="w-full py-8 px-4 text-center bg-floral-pattern">
                                <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon">
                                  {invitationData.bride_name} & {invitationData.groom_name}
                                </h1>
                                <p className="font-dancing-script text-xl text-wedding-gold mt-2">Wedding Invitation</p>
                                <p className="text-sm text-gray-600 mt-4">
                                  {formatDate(invitationData.wedding_date)}
                                  {invitationData.wedding_time && ` at ${invitationData.wedding_time}`}
                                </p>
                              </div>
                              
                              <CountdownTimer 
                                weddingDate={new Date(invitationData.wedding_date)}
                                weddingTime={invitationData.wedding_time || undefined}
                              />
                              
                              <InvitationHeader 
                                brideName={invitationData.bride_name}
                                groomName={invitationData.groom_name}
                                coupleImageUrl={invitationData.couple_image_url || undefined}
                              />
                              
                              <div className="w-full py-6">
                                <div className="max-w-4xl mx-auto px-4">
                                  <div className="glass-card p-6 border border-wedding-gold/30">
                                    <div className="text-center mb-6">
                                      <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-2">Our Story</h2>
                                      <p className="text-gray-600">{invitationData.couple_story}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                        <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                          {invitationData.bride_name}
                                        </h3>
                                        <p className="text-gray-600 text-center">{invitationData.bride_about}</p>
                                        <p className="text-sm text-gray-500 mt-4 text-center italic">
                                          {invitationData.bride_parents}
                                        </p>
                                      </div>
                                      
                                      <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                        <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                          {invitationData.groom_name}
                                        </h3>
                                        <p className="text-gray-600 text-center">{invitationData.groom_about}</p>
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
                                      <h2 className="font-dancing-script text-2xl text-wedding-maroon">Wedding Events</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      {invitationData.events.map((event) => (
                                        <div key={event.id} className="glass-card p-4 border border-wedding-gold/30">
                                          <h3 className="font-playfair text-lg text-wedding-maroon">{event.event_name}</h3>
                                          {event.event_date && (
                                            <p className="text-gray-600">
                                              <span className="font-medium">Date:</span> {formatDate(event.event_date)}
                                            </p>
                                          )}
                                          {event.event_time && (
                                            <p className="text-gray-600">
                                              <span className="font-medium">Time:</span> {event.event_time}
                                            </p>
                                          )}
                                          {event.event_venue && (
                                            <p className="text-gray-600">
                                              <span className="font-medium">Venue:</span> {event.event_venue}
                                            </p>
                                          )}
                                          {event.event_address && (
                                            <p className="text-gray-600">
                                              <span className="font-medium">Address:</span> {event.event_address}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="w-full py-8 bg-floral-pattern">
                                <div className="max-w-4xl mx-auto px-4 text-center">
                                  <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">Wedding Venue</h2>
                                  <div className="glass-card p-6 border border-wedding-gold/30">
                                    <h3 className="font-playfair text-xl text-wedding-maroon mb-2">{invitationData.wedding_venue}</h3>
                                    <p className="text-gray-600 mb-4">{invitationData.wedding_address}</p>
                                    
                                    {invitationData.map_url && (
                                      <div className="mt-4">
                                        <a 
                                          href={invitationData.map_url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 bg-wedding-gold/90 text-white px-4 py-2 rounded-full hover:bg-wedding-gold transition-colors"
                                        >
                                          <MapPin size={16} />
                                          View on Google Maps
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {(invitationData.rsvp_email || invitationData.rsvp_phone) && (
                                <div className="w-full py-8">
                                  <div className="max-w-4xl mx-auto px-4 text-center">
                                    <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">RSVP</h2>
                                    <div className="glass-card p-6 border border-wedding-gold/30">
                                      <p className="text-gray-600 mb-4">We would be honored by your presence. Please let us know if you can attend.</p>
                                      
                                      {invitationData.rsvp_email && (
                                        <p className="text-gray-600">
                                          <span className="font-medium">Email:</span>{" "}
                                          <a href={`mailto:${invitationData.rsvp_email}`} className="text-wedding-maroon hover:underline">
                                            {invitationData.rsvp_email}
                                          </a>
                                        </p>
                                      )}
                                      
                                      {invitationData.rsvp_phone && (
                                        <p className="text-gray-600">
                                          <span className="font-medium">Phone:</span>{" "}
                                          <a href={`tel:${invitationData.rsvp_phone}`} className="text-wedding-maroon hover:underline">
                                            {invitationData.rsvp_phone}
                                          </a>
                                        </p>
                                      )}
                                      
                                      <div className="mt-6">
                                        <Button className="bg-wedding-gold hover:bg-wedding-deep-gold text-white">
                                          Accept Invitation
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 relative">
                            <div className="min-h-[70vh] pattern-background">
                              <div className="min-h-full flex flex-col relative overflow-hidden">
                                <FloatingPetals />
                                
                                <div className="w-full py-8 px-4 text-center bg-floral-pattern border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('header')}>
                                  {editingElement === 'header' ? (
                                    <div className="flex flex-col gap-2 p-2 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Header Title:</label>
                                      <Input
                                        value={`${invitationData.bride_name} & ${invitationData.groom_name}`}
                                        onChange={(e) => handleDirectUpdate('names', e.target.value)}
                                        placeholder="Bride & Groom"
                                        className="mb-2"
                                      />
                                      <label className="text-sm font-medium">Header Subtitle:</label>
                                      <Input
                                        value={invitationData.header_subtitle || "Wedding Invitation"}
                                        onChange={(e) => handleDirectUpdate('header_subtitle', e.target.value)}
                                        placeholder="Wedding Invitation"
                                        className="mb-2"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-sm font-medium">Date:</label>
                                          <Input
                                            type="date"
                                            value={invitationData.wedding_date}
                                            onChange={(e) => handleDirectUpdate('wedding_date', e.target.value)}
                                            className="mb-2"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Time:</label>
                                          <Input
                                            value={invitationData.wedding_time || ""}
                                            onChange={(e) => handleDirectUpdate('wedding_time', e.target.value)}
                                            placeholder="e.g. 3:00 PM"
                                            className="mb-2"
                                          />
                                        </div>
                                      </div>
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <h1 className="font-great-vibes text-4xl sm:text-5xl text-wedding-maroon">
                                        {invitationData.bride_name} & {invitationData.groom_name}
                                      </h1>
                                      <p className="font-dancing-script text-xl text-wedding-gold mt-2">{invitationData.header_subtitle || "Wedding Invitation"}</p>
                                      <p className="text-sm text-gray-600 mt-4">
                                        {formatDate(invitationData.wedding_date)}
                                        {invitationData.wedding_time && ` at ${invitationData.wedding_time}`}
                                      </p>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="my-4 border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('couple_image')}>
                                  {editingElement === 'couple_image' ? (
                                    <div className="flex flex-col gap-2 p-4 bg-white/90 rounded-lg">
                                      <label className="text-sm font-medium">Couple Image:</label>
                                      {invitationData.couple_image_url ? (
                                        <div className="relative w-32 h-32 mx-auto">
                                          <img 
                                            src={invitationData.couple_image_url} 
                                            alt="Couple" 
                                            className="w-full h-full object-cover rounded-md" 
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md">
                                          <Upload size={24} className="text-gray-400" />
                                        </div>
                                      )}
                                      <div className="flex justify-center mt-2">
                                        <Button
                                          onClick={() => document.getElementById("couple-image-upload")?.click()}
                                          disabled={uploading}
                                          variant="outline"
                                          size="sm"
                                        >
                                          {uploading ? "Uploading..." : "Upload Photo"}
                                        </Button>
                                      </div>
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <InvitationHeader 
                                        brideName={invitationData.bride_name}
                                        groomName={invitationData.groom_name}
                                        coupleImageUrl={invitationData.couple_image_url}
                                      />
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="w-full py-6 border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('couple_story')}>
                                  {editingElement === 'couple_story' ? (
                                    <div className="flex flex-col gap-2 p-4 bg-white/90 rounded-lg max-w-4xl mx-auto">
                                      <label className="text-sm font-medium">Couple Story:</label>
                                      <Textarea
                                        value={invitationData.couple_story || ""}
                                        onChange={(e) => handleDirectUpdate('couple_story', e.target.value)}
                                        placeholder="Share your story..."
                                        className="mb-2"
                                        rows={5}
                                      />
                                      
                                      <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">About Bride:</label>
                                          <Textarea
                                            value={invitationData.bride_about || ""}
                                            onChange={(e) => handleDirectUpdate('bride_about', e.target.value)}
                                            placeholder="About the bride..."
                                            rows={3}
                                          />
                                          <label className="text-sm font-medium">Bride's Parents:</label>
                                          <Input
                                            value={invitationData.bride_parents || ""}
                                            onChange={(e) => handleDirectUpdate('bride_parents', e.target.value)}
                                            placeholder="Bride's parents names"
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <label className="text-sm font-medium">About Groom:</label>
                                          <Textarea
                                            value={invitationData.groom_about || ""}
                                            onChange={(e) => handleDirectUpdate('groom_about', e.target.value)}
                                            placeholder="About the groom..."
                                            rows={3}
                                          />
                                          <label className="text-sm font-medium">Groom's Parents:</label>
                                          <Input
                                            value={invitationData.groom_parents || ""}
                                            onChange={(e) => handleDirectUpdate('groom_parents', e.target.value)}
                                            placeholder="Groom's parents names"
                                          />
                                        </div>
                                      </div>
                                      
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <div className="max-w-4xl mx-auto px-4 relative">
                                      <div className="glass-card p-6 border border-wedding-gold/30">
                                        <div className="text-center mb-6">
                                          <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-2">Our Story</h2>
                                          <p className="text-gray-600">{invitationData.couple_story || "Add your story here..."}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                            <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                              {invitationData.bride_name}
                                            </h3>
                                            <p className="text-gray-600 text-center">{invitationData.bride_about || "About the bride..."}</p>
                                            <p className="text-sm text-gray-500 mt-4 text-center italic">
                                              {invitationData.bride_parents || "Parents of the bride..."}
                                            </p>
                                          </div>
                                          
                                          <div className="p-4 border border-wedding-gold/20 rounded-lg">
                                            <h3 className="font-playfair text-xl text-wedding-maroon text-center mb-3">
                                              {invitationData.groom_name}
                                            </h3>
                                            <p className="text-gray-600 text-center">{invitationData.groom_about || "About the groom..."}</p>
                                            <p className="text-sm text-gray-500 mt-4 text-center italic">
                                              {invitationData.groom_parents || "Parents of the groom..."}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="w-full py-6 bg-wedding-cream/20 border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('events')}>
                                  {editingElement === 'events' ? (
                                    <div className="flex flex-col gap-2 p-4 bg-white/90 rounded-lg max-w-4xl mx-auto">
                                      <div className="flex justify-between items-center mb-4">
                                        <label className="text-lg font-medium">Wedding Events:</label>
                                        <Button
                                          onClick={handleAddEvent}
                                          size="sm"
                                          variant="outline"
                                        >
                                          <PlusCircle size={14} className="mr-1" /> Add Event
                                        </Button>
                                      </div>
                                      
                                      {invitationData.events && invitationData.events.map((event, index) => (
                                        <div key={event.id} className="border rounded-lg p-3 mb-3">
                                          <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">Event {index + 1}</h4>
                                            <Button
                                              variant="destructive" 
                                              size="sm" 
                                              onClick={() => handleRemoveEvent(event.id)}
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-3">
                                            <div>
                                              <label className="text-xs font-medium">Event Name:</label>
                                              <Input
                                                value={event.event_name || ""}
                                                onChange={(e) => handleUpdateEvent(event.id, 'event_name', e.target.value)}
                                                placeholder="Event name"
                                                className="mb-2"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs font-medium">Date:</label>
                                              <Input
                                                type="date"
                                                value={event.event_date || ""}
                                                onChange={(e) => handleUpdateEvent(event.id, 'event_date', e.target.value)}
                                                className="mb-2"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs font-medium">Time:</label>
                                              <Input
                                                value={event.event_time || ""}
                                                onChange={(e) => handleUpdateEvent(event.id, 'event_time', e.target.value)}
                                                placeholder="e.g. 3:00 PM"
                                                className="mb-2"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-xs font-medium">Venue:</label>
                                              <Input
                                                value={event.event_venue || ""}
                                                onChange={(e) => handleUpdateEvent(event.id, 'event_venue', e.target.value)}
                                                placeholder="Venue name"
                                                className="mb-2"
                                              />
                                            </div>
                                            <div className="col-span-2">
                                              <label className="text-xs font-medium">Address:</label>
                                              <Input
                                                value={event.event_address || ""}
                                                onChange={(e) => handleUpdateEvent(event.id, 'event_address', e.target.value)}
                                                placeholder="Full address"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {(!invitationData.events || invitationData.events.length === 0) && (
                                        <div className="text-center p-4 border border-dashed">
                                          <p className="text-sm text-gray-500 mb-2">No events added yet</p>
                                          <Button onClick={handleAddEvent} size="sm" variant="outline">
                                            <PlusCircle size={14} className="mr-1" /> Add Your First Event
                                          </Button>
                                        </div>
                                      )}
                                      
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <div className="max-w-4xl mx-auto px-4 relative">
                                      <div className="text-center mb-6">
                                        <h2 className="font-dancing-script text-2xl text-wedding-maroon">Wedding Events</h2>
                                      </div>
                                      
                                      <div className="space-y-4">
                                        {invitationData.events && invitationData.events.length > 0 ? (
                                          invitationData.events.map((event) => (
                                            <div key={event.id} className="glass-card p-4 border border-wedding-gold/30">
                                              <h3 className="font-playfair text-lg text-wedding-maroon">{event.event_name}</h3>
                                              {event.event_date && (
                                                <p className="text-gray-600">
                                                  <span className="font-medium">Date:</span> {formatDate(event.event_date)}
                                                </p>
                                              )}
                                              {event.event_time && (
                                                <p className="text-gray-600">
                                                  <span className="font-medium">Time:</span> {event.event_time}
                                                </p>
                                              )}
                                              {event.event_venue && (
                                                <p className="text-gray-600">
                                                  <span className="font-medium">Venue:</span> {event.event_venue}
                                                </p>
                                              )}
                                              {event.event_address && (
                                                <p className="text-gray-600">
                                                  <span className="font-medium">Address:</span> {event.event_address}
                                                </p>
                                              )}
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center p-4 glass-card border border-wedding-gold/30">
                                            <p className="text-gray-500">No events added yet. Click to add events.</p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="w-full py-8 bg-floral-pattern border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('venue')}>
                                  {editingElement === 'venue' ? (
                                    <div className="flex flex-col gap-2 p-4 bg-white/90 rounded-lg max-w-4xl mx-auto">
                                      <label className="text-sm font-medium">Venue Name:</label>
                                      <Input
                                        value={invitationData.wedding_venue || ""}
                                        onChange={(e) => handleDirectUpdate('wedding_venue', e.target.value)}
                                        placeholder="Venue name"
                                        className="mb-2"
                                      />
                                      
                                      <label className="text-sm font-medium">Venue Address:</label>
                                      <Textarea
                                        value={invitationData.wedding_address || ""}
                                        onChange={(e) => handleDirectUpdate('wedding_address', e.target.value)}
                                        placeholder="Full address"
                                        className="mb-2"
                                      />
                                      
                                      <label className="text-sm font-medium">Google Maps URL (optional):</label>
                                      <Input
                                        value={invitationData.map_url || ""}
                                        onChange={(e) => handleDirectUpdate('map_url', e.target.value)}
                                        placeholder="e.g. https://goo.gl/maps/..."
                                        className="mb-2"
                                      />
                                      
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <div className="max-w-4xl mx-auto px-4 text-center relative">
                                      <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">Wedding Venue</h2>
                                      <div className="glass-card p-6 border border-wedding-gold/30">
                                        <h3 className="font-playfair text-xl text-wedding-maroon mb-2">
                                          {invitationData.wedding_venue || "Venue Name"}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                          {invitationData.wedding_address || "Venue Address"}
                                        </p>
                                        
                                        {invitationData.map_url && (
                                          <div className="mt-4">
                                            <a 
                                              href={invitationData.map_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-2 bg-wedding-gold/90 text-white px-4 py-2 rounded-full hover:bg-wedding-gold transition-colors"
                                            >
                                              <MapPin size={16} />
                                              View on Google Maps
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="w-full py-8 border-2 border-dashed border-wedding-gold/40 hover:bg-wedding-gold/5 cursor-pointer" onClick={() => setEditingElement('rsvp')}>
                                  {editingElement === 'rsvp' ? (
                                    <div className="flex flex-col gap-2 p-4 bg-white/90 rounded-lg max-w-4xl mx-auto">
                                      <label className="text-sm font-medium">RSVP Email (optional):</label>
                                      <Input
                                        value={invitationData.rsvp_email || ""}
                                        onChange={(e) => handleDirectUpdate('rsvp_email', e.target.value)}
                                        placeholder="Email address for RSVPs"
                                        className="mb-2"
                                      />
                                      
                                      <label className="text-sm font-medium">RSVP Phone (optional):</label>
                                      <Input
                                        value={invitationData.rsvp_phone || ""}
                                        onChange={(e) => handleDirectUpdate('rsvp_phone', e.target.value)}
                                        placeholder="Phone number for RSVPs"
                                        className="mb-2"
                                      />
                                      
                                      <label className="text-sm font-medium">Custom RSVP Message:</label>
                                      <Textarea
                                        value={invitationData.rsvp_message || "We would be honored by your presence. Please let us know if you can attend."}
                                        onChange={(e) => handleDirectUpdate('rsvp_message', e.target.value)}
                                        placeholder="Custom message for RSVPs"
                                        className="mb-2"
                                      />
                                      
                                      <Button size="sm" onClick={() => setEditingElement(null)}>Done</Button>
                                    </div>
                                  ) : (
                                    <div className="max-w-4xl mx-auto px-4 text-center relative">
                                      <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-4">RSVP</h2>
                                      <div className="glass-card p-6 border border-wedding-gold/30">
                                        <p className="text-gray-600 mb-4">
                                          {invitationData.rsvp_message || "We would be honored by your presence. Please let us know if you can attend."}
                                        </p>
                                        
                                        {invitationData.rsvp_email && (
                                          <p className="text-gray-600">
                                            <span className="font-medium">Email:</span>{" "}
                                            <a href={`mailto:${invitationData.rsvp_email}`} className="text-wedding-maroon hover:underline">
                                              {invitationData.rsvp_email}
                                            </a>
                                          </p>
                                        )}
                                        
                                        {invitationData.rsvp_phone && (
                                          <p className="text-gray-600">
                                            <span className="font-medium">Phone:</span>{" "}
                                            <a href={`tel:${invitationData.rsvp_phone}`} className="text-wedding-maroon hover:underline">
                                              {invitationData.rsvp_phone}
                                            </a>
                                          </p>
                                        )}
                                        
                                        <div className="mt-6">
                                          <Button className="bg-wedding-gold hover:bg-wedding-deep-gold text-white">
                                            Accept Invitation
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="absolute right-2 top-2">
                                        <Button size="icon" variant="ghost">
                                          <Edit size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Control Panel */}
                    <div className="w-full md:w-1/3">
                      <Tabs defaultValue="design" value={activeSectionTab} onValueChange={setActiveSectionTab}>
                        <TabsList className="grid grid-cols-2 w-full mb-4">
                          <TabsTrigger value="design">Design</TabsTrigger>
                          <TabsTrigger value="content">Content</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="design" className="mt-0 space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Color Theme</h3>
                            <div className="grid grid-cols-5 gap-2">
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-maroon border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'maroon')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-gold border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'gold')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-wedding-blush border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'blush')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-emerald-600 border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'emerald')}
                              ></button>
                              <button 
                                className="w-full aspect-square rounded-full bg-sky-600 border-2 border-white hover:scale-110 transition-transform"
                                onClick={() => handleDirectUpdate('theme_color', 'blue')}
                              ></button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Background Style</h3>
                            <div className="grid grid-cols-3 gap-2">
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'pattern')}
                              >
                                <div className="h-12 rounded pattern-background mb-2"></div>
                                <span className="text-sm">Pattern</span>
                              </button>
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'solid')}
                              >
                                <div className="h-12 rounded bg-wedding-cream mb-2"></div>
                                <span className="text-sm">Solid</span>
                              </button>
                              <button 
                                className="p-4 border rounded-lg text-center hover:bg-gray-50"
                                onClick={() => handleDirectUpdate('background_style', 'gradient')}
                              >
                                <div className="h-12 rounded bg-gradient-to-br from-wedding-cream to-wedding-blush mb-2"></div>
                                <span className="text-sm">Gradient</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Animations</h3>
                            <div className="flex space-x-2">
                              <Button 
                                variant={invitationData.animations?.includes('petals') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('petals') 
                                    ? current.filter(a => a !== 'petals') 
                                    : [...current, 'petals'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Petals
                              </Button>
                              <Button 
                                variant={invitationData.animations?.includes('confetti') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('confetti') 
                                    ? current.filter(a => a !== 'confetti') 
                                    : [...current, 'confetti'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Confetti
                              </Button>
                              <Button 
                                variant={invitationData.animations?.includes('hearts') ? "default" : "outline"}
                                onClick={() => {
                                  const current = invitationData.animations || [];
                                  const updated = current.includes('hearts') 
                                    ? current.filter(a => a !== 'hearts') 
                                    : [...current, 'hearts'];
                                  handleDirectUpdate('animations', updated);
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Hearts
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">Font Style</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                variant={invitationData.font_style === 'elegant' ? "default" : "outline"}
                                onClick={() => handleDirectUpdate('font_style', 'elegant')}
                                className="flex-1"
                                size="sm"
                              >
                                <span className="font-great-vibes">Elegant</span>
                              </Button>
                              <Button 
                                variant={invitationData.font_style === 'modern' ? "default" : "outline"}
                                onClick={() => handleDirectUpdate('font_style', 'modern')}
                                className="flex-1"
                                size="sm"
                              >
                                <span className="font-sans">Modern</span>
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="content" className="mt-0 space-y-4">
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Couple Information</h3>
                            <div>
                              <label className="text-sm font-medium">Couple Image</label>
                              <div className="flex items-center mt-2">
                                {invitationData.couple_image_url ? (
                                  <div className="relative w-20 h-20">
                                    <img src={invitationData.couple_image_url} alt="Couple" className="w-full h-full object-cover rounded-md" />
                                    <button 
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                      onClick={() => handleDirectUpdate('couple_image_url', '')}
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md">
                                    <Upload size={18} className="text-gray-400" />
                                  </div>
                                )}
                                <Button 
                                  className="ml-3"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('couple-image-upload')?.click()}
                                  disabled={uploading}
                                >
                                  {uploading ? "Uploading..." : "Upload"}
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Couple Details</h3>
                            <div>
                              <label className="text-sm font-medium">Couple Story</label>
                              <Textarea 
                                value={invitationData.couple_story || ""} 
                                onChange={(e) => handleDirectUpdate('couple_story', e.target.value)}
                                placeholder="Share your journey together..."
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-sm font-medium">About Bride</label>
                                <Textarea 
                                  value={invitationData.bride_about || ""} 
                                  onChange={(e) => handleDirectUpdate('bride_about', e.target.value)}
                                  placeholder="About the bride..."
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">About Groom</label>
                                <Textarea 
                                  value={invitationData.groom_about || ""} 
                                  onChange={(e) => handleDirectUpdate('groom_about', e.target.value)}
                                  placeholder="About the groom..."
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-sm font-medium">Bride's Parents</label>
                                <Input 
                                  value={invitationData.bride_parents || ""} 
                                  onChange={(e) => handleDirectUpdate('bride_parents', e.target.value)}
                                  placeholder="Parents of the bride"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Groom's Parents</label>
                                <Input 
                                  value={invitationData.groom_parents || ""} 
                                  onChange={(e) => handleDirectUpdate('groom_parents', e.target.value)}
                                  placeholder="Parents of the groom"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">Wedding Events</h3>
                              <Button
                                onClick={handleAddEvent}
                                size="sm"
                                variant="outline"
                              >
                                <PlusCircle size={14} className="mr-1" /> Add
                              </Button>
                            </div>
                            
                            {invitationData.events && invitationData.events.length > 0 ? (
                              invitationData.events.map((event, index) => (
                                <div key={event.id} className="p-2 border rounded flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{event.event_name || `Event ${index + 1}`}</p>
                                    <p className="text-xs text-gray-500">
                                      {event.event_date ? formatDate(event.event_date) : "No date"} {event.event_time ? `at ${event.event_time}` : ""}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setEditingElement(`event_${event.id}`)}
                                  >
                                    <Edit size={14} />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-2">No events added yet</p>
                            )}
                          </div>
                          
                          <div className="p-4 border rounded-lg space-y-3">
                            <h3 className="font-medium">Venue & RSVP</h3>
                            <div>
                              <label className="text-sm font-medium">Wedding Venue</label>
                              <Input 
                                value={invitationData.wedding_venue || ""} 
                                onChange={(e) => handleDirectUpdate('wedding_venue', e.target.value)}
                                placeholder="Venue name"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Venue Address</label>
                              <Textarea 
                                value={invitationData.wedding_address || ""} 
                                onChange={(e) => handleDirectUpdate('wedding_address', e.target.value)}
                                placeholder="Full venue address"
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Google Maps URL (optional)</label>
                              <Input 
                                value={invitationData.map_url || ""} 
                                onChange={(e) => handleDirectUpdate('map_url', e.target.value)}
                                placeholder="e.g. https://goo.gl/maps/..."
                                className="mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-sm font-medium">RSVP Email</label>
                                <Input 
                                  value={invitationData.rsvp_email || ""} 
                                  onChange={(e) => handleDirectUpdate('rsvp_email', e.target.value)}
                                  placeholder="Email address for RSVPs"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">RSVP Phone</label>
                                <Input 
                                  value={invitationData.rsvp_phone || ""} 
                                  onChange={(e) => handleDirectUpdate('rsvp_phone', e.target.value)}
                                  placeholder="Phone number for RSVPs"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-6">
            <Button 
              className="w-full max-w-md bg-wedding-gold hover:bg-wedding-deep-gold text-white" 
              onClick={saveInvitation}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Invitation
                </>
              )}
            </Button>
          </div>
          
          {generatedLink && (
            <div className="mt-4 p-4 max-w-lg mx-auto bg-white/90 rounded-lg shadow">
              <p className="font-medium mb-2">Share your invitation:</p>
              <div className="flex items-center">
                <Input 
                  type="text" 
                  value={generatedLink} 
                  readOnly 
                  className="flex-1 text-sm"
                />
                <Button 
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    toast({
                      title: "Link Copied!",
                      description: "Share this link with your guests.",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="flex mt-4 space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(generatedLink, "_blank")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                
                <Button
                  variant="default"
                  className="flex-1 bg-wedding-maroon hover:bg-wedding-maroon/90"
                  onClick={() => navigate('/')}
                >
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
