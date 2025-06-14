
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, Heart, Gift, Building, PartyPopper, Eye, Edit, Share2, LogOut, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGuestInvitationSync } from '@/hooks/useGuestInvitationSync';
import { displayPhoneNumber } from '@/utils/phoneUtils';

interface Invitation {
  id: string;
  title: string;
  wedding_date: string;
  is_published: boolean;
  created_at: string;
  template_name?: string;
  guest_count?: number;
}

interface GuestInvitation {
  id: string;
  invitation_title: string;
  hosts_names: string;
  invitation_date: string;
  status: string;
  invitation_id: string;
  guest_id: string;
}

const Dashboard = () => {
  const { user, userPhone, signOut } = useAuth();
  const navigate = useNavigate();
  const [hostedInvitations, setHostedInvitations] = useState<Invitation[]>([]);
  const [guestInvitations, setGuestInvitations] = useState<GuestInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync guest invitations when user logs in
  useGuestInvitationSync();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch hosted invitations
      const { data: hosted, error: hostedError } = await supabase
        .from('wedding_invitations')
        .select(`
          id,
          title,
          wedding_date,
          is_published,
          created_at,
          invitation_templates(name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (hostedError) throw hostedError;

      // Fetch guest invitations
      const { data: invited, error: invitedError } = await supabase
        .from('user_guest_invitations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (invitedError) throw invitedError;

      setHostedInvitations(hosted || []);
      setGuestInvitations(invited || []);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wedding': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'birthday': return <Gift className="w-5 h-5 text-blue-500" />;
      case 'corporate': return <Building className="w-5 h-5 text-gray-500" />;
      case 'party': return <PartyPopper className="w-5 h-5 text-purple-500" />;
      default: return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                InviteWave
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-gray-600">
                  Welcome back, <span className="font-semibold text-purple-600">{user?.user_metadata?.full_name || user?.email}</span>!
                </div>
                {userPhone && (
                  <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <Phone size={12} />
                    {displayPhoneNumber(userPhone)}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="hosted" className="w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <TabsList className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
              <TabsTrigger value="hosted" className="rounded-lg font-medium px-6 py-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Hosted Events ({hostedInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="invited" className="rounded-lg font-medium px-6 py-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Invited Events ({guestInvitations.length})
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={() => navigate('/templates')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Invitation
            </Button>
          </div>

          <TabsContent value="hosted" className="space-y-6">
            {hostedInvitations.length === 0 ? (
              <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent>
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No invitations yet</h3>
                  <p className="text-gray-500 mb-6">Create your first stunning invitation to get started!</p>
                  <Button
                    onClick={() => navigate('/templates')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Invitation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostedInvitations.map((invitation) => (
                  <Card key={invitation.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getEventIcon('wedding')}
                          <CardTitle className="text-lg">{invitation.title}</CardTitle>
                        </div>
                        <Badge variant={invitation.is_published ? "default" : "secondary"} className="rounded-full">
                          {invitation.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {invitation.wedding_date && new Date(invitation.wedding_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 rounded-lg"
                          onClick={() => navigate(`/i/${invitation.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 rounded-lg"
                          onClick={() => navigate(`/customize/${invitation.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-lg"
                          onClick={() => navigate(`/guest-management/${invitation.id}`)}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invited" className="space-y-6">
            {guestInvitations.length === 0 ? (
              <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No invitations received</h3>
                  <p className="text-gray-500 mb-4">When someone invites you to their event, it will appear here automatically.</p>
                  {userPhone && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Your phone number: {displayPhoneNumber(userPhone)}
                      <br />
                      <span className="text-xs">Invitations are automatically linked when hosts add this number to their guest list.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guestInvitations.map((invitation) => (
                  <Card key={invitation.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{invitation.invitation_title}</CardTitle>
                        <Badge variant={invitation.status === 'accepted' ? "default" : "secondary"} className="rounded-full">
                          {invitation.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        By {invitation.hosts_names}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">
                        {invitation.invitation_date && new Date(invitation.invitation_date).toLocaleDateString()}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg"
                        onClick={() => navigate(`/i/${invitation.invitation_id}/${invitation.guest_id}`)}
                      >
                        View Invitation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
