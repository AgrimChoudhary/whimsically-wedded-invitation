
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Save, Image, Users, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import InvitationEditor from '@/components/InvitationEditor';

const CustomizeInvitation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
              <CardHeader>
                <CardTitle>Invitation Editor</CardTitle>
                <CardDescription>
                  Customize all aspects of your wedding invitation
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
                    <InvitationEditor section="couple" />
                  </TabsContent>
                  
                  <TabsContent value="date">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("basic")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="date" />
                  </TabsContent>
                  
                  <TabsContent value="photos">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("basic")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="photos" />
                  </TabsContent>
                  
                  <TabsContent value="family">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="family" />
                  </TabsContent>
                  
                  <TabsContent value="events">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="events" />
                  </TabsContent>
                  
                  <TabsContent value="venue">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="venue" />
                  </TabsContent>
                  
                  <TabsContent value="contact">
                    <Button variant="outline" size="sm" className="mb-4" onClick={() => setActiveTab("details")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <InvitationEditor section="contact" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Button className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white" onClick={() => {
                toast({
                  title: "Invitation Created!",
                  description: "Your customized invitation has been successfully saved.",
                })
              }}>
                <Save className="mr-2 h-4 w-4" />
                Save Invitation
              </Button>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-wedding-gold/30">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your invitation will look
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Your invitation preview will appear here as you make changes.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/invitation')}>
                    <Edit className="mr-2 h-4 w-4" />
                    View Sample Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeInvitation;
