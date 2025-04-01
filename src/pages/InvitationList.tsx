
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Users, Calendar, Copy, ChevronsRight, Loader2, LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvitationData, getAllInvitations } from '@/lib/invitation-helpers';

const InvitationList: React.FC = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      try {
        const data = await getAllInvitations();
        setInvitations(data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch invitations. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitations();
  }, []);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const copyToClipboard = (id: string) => {
    const link = `${window.location.origin}/invitation/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard."
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-wedding-cream/20 pattern-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-great-vibes text-wedding-maroon">Your Wedding Invitations</h1>
            <p className="text-gray-600">Manage your created invitations and guest lists</p>
          </div>
          
          <Button 
            onClick={() => navigate('/customize')}
            className="bg-wedding-maroon hover:bg-wedding-maroon/80"
          >
            <Plus size={16} className="mr-2" />
            Create New Invitation
          </Button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-wedding-gold mb-4" />
            <p className="text-gray-600">Loading your invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <Card className="border-wedding-gold/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-wedding-gold" />
              </div>
              <h2 className="text-xl font-medium text-wedding-maroon mb-2">No Invitations Yet</h2>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                You haven't created any wedding invitations yet. Create your first invitation to get started.
              </p>
              <Button 
                onClick={() => navigate('/customize')}
                className="bg-wedding-maroon hover:bg-wedding-maroon/80"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Invitation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {invitations.map((invitation) => (
              <Card 
                key={invitation.id}
                className="border-wedding-gold/20 overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40 bg-wedding-gold/10 overflow-hidden">
                  {invitation.couple_photo_url ? (
                    <img 
                      src={invitation.couple_photo_url} 
                      alt={`${invitation.bride_first_name} & ${invitation.groom_first_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users size={48} className="text-wedding-gold/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <Badge className="absolute top-3 right-3 bg-wedding-maroon/80">
                    Wedding
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-great-vibes text-wedding-maroon">
                    {invitation.bride_first_name} & {invitation.groom_first_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar size={14} className="text-wedding-gold" />
                    <span>{formatDate(invitation.wedding_date)}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong className="text-wedding-maroon">Venue:</strong> {invitation.venue_name}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10 flex-1"
                      onClick={() => copyToClipboard(invitation.id!)}
                    >
                      {copiedId === invitation.id ? (
                        <>
                          <Copy size={14} className="mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <LinkIcon size={14} className="mr-1" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10 flex-1"
                      onClick={() => window.open(`/invitation/${invitation.id}`, '_blank')}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-wedding-gold/10 pt-3 pb-3">
                  <Button 
                    variant="link" 
                    onClick={() => navigate(`/guests/${invitation.id}`)}
                    className="w-full justify-between text-wedding-maroon hover:text-wedding-maroon/80 p-0"
                  >
                    <span className="flex items-center">
                      <Users size={16} className="mr-2" />
                      Manage Guest List
                    </span>
                    <ChevronsRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-10 flex justify-center">
          <Link to="/" className="text-wedding-maroon hover:text-wedding-maroon/80 underline underline-offset-4">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvitationList;
