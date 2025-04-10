
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, User, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GuestTable from "@/components/GuestTable";
import { useToast } from "@/components/ui/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  invitationId?: string;
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userInvitations, setUserInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's invitations
  useEffect(() => {
    async function fetchUserInvitations() {
      try {
        setIsLoading(true);
        
        // For now, we'll fetch all invitations since we don't have user auth yet
        const { data, error } = await supabase
          .from('wedding_invitations')
          .select('*');
          
        if (error) throw error;
        
        setUserInvitations(data || []);

        // Create template from the invitations
        const defaultTemplates: Template[] = [
          {
            id: "wedding-classic",
            title: "Classic Wedding",
            description: "An elegant wedding invitation with traditional styling",
            thumbnail: "https://images.unsplash.com/photo-1501901609772-df0848060b33?q=80&w=500&auto=format&fit=crop",
            invitationId: data && data[0]?.id
          }
        ];
        
        setTemplates(defaultTemplates);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        toast({
          title: "Error",
          description: "Failed to load your invitations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserInvitations();
  }, [toast]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && template.invitationId) {
      navigate(`/invitation/${template.invitationId}`);
    }
  };

  const handleCreateNewInvitation = () => {
    navigate('/customize');
  };

  return (
    <div className="min-h-screen bg-wedding-cream/30 pattern-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-playfair text-wedding-maroon">My Wedding Dashboard</h1>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="text-wedding-maroon border-wedding-gold/30"
          >
            Back to Home
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-wedding-gold/20">
            <TabsTrigger value="templates" className="data-[state=active]:bg-wedding-gold/10">
              <Calendar size={16} className="mr-2" />
              Invitation Templates
            </TabsTrigger>
            <TabsTrigger value="guests" className="data-[state=active]:bg-wedding-gold/10">
              <Users size={16} className="mr-2" />
              Guest Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <Card className="col-span-full flex justify-center items-center py-12">
                  <Loader2 size={32} className="animate-spin text-wedding-gold" />
                </Card>
              ) : (
                <>
                  {templates.map(template => (
                    <Card key={template.id} className="overflow-hidden border-wedding-gold/20 hover:shadow-gold-soft transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={template.thumbnail} 
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button onClick={() => handleTemplateSelect(template.id)} variant="secondary" className="bg-white text-wedding-maroon">
                            Select Template
                          </Button>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-wedding-maroon">{template.title}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed border-wedding-gold/30 bg-transparent hover:bg-wedding-cream/30 transition-all cursor-pointer flex flex-col items-center justify-center py-8"
                        onClick={handleCreateNewInvitation}>
                    <Plus size={40} className="text-wedding-gold/50 mb-2" />
                    <p className="text-wedding-maroon font-medium">Create New Invitation</p>
                    <p className="text-sm text-gray-500">Design your custom invitation</p>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="guests" className="space-y-4">
            <Card className="border-wedding-gold/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-wedding-maroon">Guest Management</CardTitle>
                    <CardDescription>Manage your guest list and invitations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {userInvitations.length > 0 ? (
                  <GuestTable invitationId={userInvitations[0]?.id || ''} />
                ) : (
                  <div className="text-center py-8">
                    <User size={48} className="mx-auto text-wedding-gold/40 mb-3" />
                    <h3 className="text-lg font-medium text-wedding-maroon mb-2">No Invitations Created</h3>
                    <p className="text-gray-500 mb-4">Create an invitation to manage your guests</p>
                    <Button onClick={handleCreateNewInvitation} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                      Create Invitation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
