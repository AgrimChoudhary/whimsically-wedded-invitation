
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Save, Image, Users, Calendar, MapPin, Mail, Phone, Eye, Camera, Upload } from 'lucide-react';
import InvitationEditor from '@/components/InvitationEditor';
import InvitationPreview from '@/components/InvitationPreview';
import { Input } from "@/components/ui/input";
import { uploadImageToSupabase, createWeddingInvitation, generateUniqueInvitationLink } from '@/lib/supabase-helpers';
import { supabase } from "@/integrations/supabase/client";

const CustomizeInvitation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [uploading, setUploading] = useState(false);
  const [invitationData, setInvitationData] = useState({
    bride_name: "Ananya",
    groom_name: "Arjun",
    couple_image_url: "",
    wedding_date: new Date().toISOString().split('T')[0],
    wedding_time: "11:00 AM",
    wedding_venue: "Royal Garden Palace",
    wedding_address: "123 Wedding Lane, Wedding City",
    bride_family: [],
    groom_family: [],
    events: [],
    gallery_images: [],
    custom_message: "We would be honored by your presence on our special day."
  });
  const [generatedLink, setGeneratedLink] = useState("");

  // Direct update handler for the InvitationPreview component
  const handleDirectUpdate = (field: string, value: any) => {
    if (field === 'names') {
      // Special case for the combined names field
      const names = value.split('&');
      if (names.length === 2) {
        setInvitationData(prev => ({
          ...prev,
          bride_name: names[0].trim(),
          groom_name: names[1].trim()
        }));
      }
    } else if (field === 'couple_image_upload') {
      // Open file upload dialog
      document.getElementById('couple-image-upload')?.click();
    } else {
      // Handle direct updates to standard fields
      setInvitationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Update invitation data from the editor components
  const updateInvitationData = (section: string, data: any) => {
    setInvitationData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Handle image upload
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
        setInvitationData(prev => ({
          ...prev,
          couple_image_url: imageUrl
        }));
        
        setUploading(false);
        
        toast({
          title: "Image Uploaded",
          description: "Your image has been successfully uploaded."
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

  // Save the invitation to Supabase
  const saveInvitation = async () => {
    try {
      const savedInvitation = await createWeddingInvitation(invitationData);
      
      if (savedInvitation) {
        const link = generateUniqueInvitationLink(savedInvitation.id);
        setGeneratedLink(link);
        
        toast({
          title: "Invitation Created!",
          description: "Your customized invitation has been successfully saved.",
        });
        
        // Copy link to clipboard
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

        {/* Hidden file input for couple image upload */}
        <input
          type="file"
          id="couple-image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
              <CardHeader>
                <CardTitle>Invitation Editor</CardTitle>
                <CardDescription>
                  Click on any element in the preview to customize your invitation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("couple")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Couple Details</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("date")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Date & Time</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("photos")}>
                      <Image className="mr-2 h-4 w-4" />
                      <span>Photos</span>
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("family")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Family Members</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("events")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Events</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("venue")}>
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Venue Details</span>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("contact")}>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Contact Information</span>
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="couple">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("basic")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="couple" 
                      initialData={{
                        brideName: invitationData.bride_name,
                        groomName: invitationData.groom_name,
                        coupleImageUrl: invitationData.couple_image_url
                      }}
                      onUpdate={(data) => updateInvitationData("couple", {
                        bride_name: data.brideName,
                        groom_name: data.groomName,
                        couple_image_url: data.coupleImageUrl
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="date">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("basic")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="date" 
                      initialData={{
                        weddingDate: new Date(invitationData.wedding_date),
                        weddingTime: invitationData.wedding_time
                      }}
                      onUpdate={(data) => updateInvitationData("date", {
                        wedding_date: data.weddingDate.toISOString().split('T')[0],
                        wedding_time: data.weddingTime
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="photos">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("basic")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="photos" 
                      initialData={{ galleryImages: invitationData.gallery_images }}
                      onUpdate={(data) => updateInvitationData("photos", {
                        gallery_images: data.galleryImages
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="family">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="family" 
                      initialData={{
                        brideFamily: invitationData.bride_family,
                        groomFamily: invitationData.groom_family
                      }}
                      onUpdate={(data) => updateInvitationData("family", {
                        bride_family: data.brideFamily,
                        groom_family: data.groomFamily
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="events">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="events" 
                      initialData={{ events: invitationData.events }}
                      onUpdate={(data) => updateInvitationData("events", {
                        events: data.events
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="venue">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="venue" 
                      initialData={{
                        venueName: invitationData.wedding_venue,
                        venueAddress: invitationData.wedding_address
                      }}
                      onUpdate={(data) => updateInvitationData("venue", {
                        wedding_venue: data.venueName,
                        wedding_address: data.venueAddress
                      })}
                    />
                  </TabsContent>
                  
                  <TabsContent value="contact">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor 
                      section="contact" 
                      initialData={{ customMessage: invitationData.custom_message }}
                      onUpdate={(data) => updateInvitationData("contact", {
                        custom_message: data.customMessage
                      })}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Button className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white" onClick={saveInvitation}>
                <Save className="mr-2 h-4 w-4" />
                Save Invitation
              </Button>
              
              {generatedLink && (
                <div className="mt-4 p-4 bg-white/90 rounded-lg shadow">
                  <p className="font-medium mb-2">Share your invitation:</p>
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      value={generatedLink} 
                      readOnly 
                      className="flex-1 p-2 text-sm border rounded-l-md"
                    />
                    <Button 
                      className="rounded-l-none"
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
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => window.open(generatedLink, "_blank")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Invitation
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Click on any text to edit it directly
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[500px] overflow-auto">
                <InvitationPreview 
                  invitationData={invitationData} 
                  editable={true}
                  onUpdate={handleDirectUpdate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
