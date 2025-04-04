import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Save, Image, Users, Calendar, MapPin, Mail, Phone, Eye, Camera, Upload, PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { uploadImageToSupabase, createWeddingInvitation, generateUniqueInvitationLink, getDefaultInvitationTemplate } from '@/lib/supabase-helpers';
import { supabase } from "@/integrations/supabase/client";
import { useGuest } from '@/context/GuestContext';
import InvitationPreview from '@/components/InvitationPreview';

const CustomizeInvitation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { guestName } = useGuest();
  const [activeTab, setActiveTab] = useState("preview");
  const [uploading, setUploading] = useState(false);
  const [invitationData, setInvitationData] = useState(getDefaultInvitationTemplate());
  const [generatedLink, setGeneratedLink] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDirectUpdate = (field: string, value: any) => {
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
    } else if (field === 'event_update') {
      const { id, eventField, eventValue } = value;
      setInvitationData(prev => ({
        ...prev,
        events: prev.events.map(event => 
          event.id === id ? { ...event, [eventField]: eventValue } : event
        )
      }));
    } else if (field === 'add_event') {
      const newEvent = {
        id: `event_${Date.now()}`,
        name: "New Event",
        date: new Date(),
        time: "12:00 PM",
        venue: "Venue Name",
        address: "Venue Address"
      };
      
      setInvitationData(prev => ({
        ...prev,
        events: [...prev.events, newEvent]
      }));
      
      toast({
        title: "Event Added",
        description: "A new event has been added to your invitation."
      });
    } else if (field === 'remove_event') {
      setInvitationData(prev => ({
        ...prev,
        events: prev.events.filter(event => event.id !== value)
      }));
      
      toast({
        title: "Event Removed",
        description: "The event has been removed from your invitation."
      });
    } else if (field === 'family_member_update') {
      const { id, side, memberField, memberValue } = value;
      setInvitationData(prev => {
        const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
        return {
          ...prev,
          [familyKey]: prev[familyKey].map(member => 
            member.id === id ? { ...member, [memberField]: memberValue } : member
          )
        };
      });
    } else if (field === 'add_family_member') {
      const side = value;
      const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
      const newMember = {
        id: `member_${Date.now()}`,
        name: `New ${side === 'bride' ? 'Bride' : 'Groom'} Family Member`,
        relation: `Relation to ${side === 'bride' ? 'Bride' : 'Groom'}`,
        description: "Add a description here"
      };
      
      setInvitationData(prev => ({
        ...prev,
        [familyKey]: [...prev[familyKey], newMember]
      }));
      
      toast({
        title: "Family Member Added",
        description: `A new ${side === 'bride' ? 'bride' : 'groom'} family member has been added.`
      });
    } else if (field === 'remove_family_member') {
      const { id, side } = value;
      const familyKey = side === 'bride' ? 'bride_family' : 'groom_family';
      
      setInvitationData(prev => ({
        ...prev,
        [familyKey]: prev[familyKey].filter(member => member.id !== id)
      }));
      
      toast({
        title: "Family Member Removed",
        description: "The family member has been removed from your invitation."
      });
    } else if (field.startsWith('add_image_to_gallery')) {
      document.getElementById('gallery-image-upload')?.click();
    } else {
      setInvitationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'couple' | 'gallery') => {
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
        } else {
          const newImage = {
            id: `gallery_${Date.now()}`,
            image: imageUrl,
            name: '',
            description: ''
          };
          
          setInvitationData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, newImage]
          }));
        }
        
        setUploading(false);
        
        toast({
          title: "Image Uploaded",
          description: `Your ${type === 'couple' ? 'couple' : 'gallery'} image has been successfully uploaded.`
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

  return (
    <div className="min-h-screen pattern-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
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

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invitation Editor</CardTitle>
                  <CardDescription>
                    Click on any element to customize your invitation
                  </CardDescription>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="preview" className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Edit Invitation</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Advanced Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="preview" className="mt-0">
                <div className="border rounded-lg bg-white overflow-hidden">
                  <div className="max-h-[80vh] overflow-y-auto px-4 py-6">
                    <InvitationPreview 
                      invitationData={invitationData} 
                      editable={true}
                      onUpdate={handleDirectUpdate}
                      showEditHints={true}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Invitation Settings</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bride's Name</label>
                      <Input 
                        value={invitationData.bride_name} 
                        onChange={(e) => handleDirectUpdate('bride_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Groom's Name</label>
                      <Input 
                        value={invitationData.groom_name} 
                        onChange={(e) => handleDirectUpdate('groom_name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Wedding Date</label>
                      <Input 
                        type="date" 
                        value={invitationData.wedding_date} 
                        onChange={(e) => handleDirectUpdate('wedding_date', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Wedding Time</label>
                      <Input 
                        value={invitationData.wedding_time} 
                        onChange={(e) => handleDirectUpdate('wedding_time', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Venue Name</label>
                      <Input 
                        value={invitationData.wedding_venue} 
                        onChange={(e) => handleDirectUpdate('wedding_venue', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Venue Address</label>
                      <Input 
                        value={invitationData.wedding_address} 
                        onChange={(e) => handleDirectUpdate('wedding_address', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Image Settings</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Couple Image</label>
                      <div className="flex items-center space-x-4">
                        {invitationData.couple_image_url ? (
                          <div className="relative w-32 h-32">
                            <img src={invitationData.couple_image_url} alt="Couple" className="w-full h-full object-cover rounded-md" />
                            <button 
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                              onClick={() => handleDirectUpdate('couple_image_url', '')}
                            >
                              <ArrowLeft size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md">
                            <Upload size={24} className="text-gray-400" />
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => document.getElementById('couple-image-upload')?.click()}
                          disabled={uploading}
                          variant="outline"
                        >
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Gallery Images</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('gallery-image-upload')?.click()}
                          className="text-xs"
                        >
                          <PlusCircle size={14} className="mr-1" />
                          Add Image
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {invitationData.gallery_images.map((image, idx) => (
                          <div key={idx} className="relative aspect-square">
                            <img 
                              src={image.image} 
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button 
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
                              onClick={() => {
                                const updatedGallery = [...invitationData.gallery_images];
                                updatedGallery.splice(idx, 1);
                                handleDirectUpdate('gallery_images', updatedGallery);
                              }}
                            >
                              <ArrowLeft size={12} />
                            </button>
                          </div>
                        ))}
                        
                        {invitationData.gallery_images.length === 0 && (
                          <div className="col-span-3 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md">
                            <span className="text-gray-400 text-sm">No gallery images yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
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
