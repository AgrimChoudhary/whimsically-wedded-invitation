
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Copy, Loader2, Plus, Trash2, User, UserPlus, Users, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  InvitationData, 
  Guest, 
  getInvitationById, 
  addGuest, 
  getGuestsByInvitationId 
} from '@/lib/invitation-helpers';

// Form validation schema
const guestFormSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

const GuestManagement: React.FC = () => {
  const navigate = useNavigate();
  const { invitationId } = useParams<{ invitationId: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingGuest, setAddingGuest] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: '',
      mobile: '',
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!invitationId) {
        navigate('/invitations');
        return;
      }
      
      setLoading(true);
      try {
        const { invitation: invitationData } = await getInvitationById(invitationId);
        if (!invitationData) {
          toast({
            title: "Error",
            description: "Invitation not found",
            variant: "destructive"
          });
          navigate('/invitations');
          return;
        }
        
        setInvitation(invitationData);
        
        // Fetch guests
        const guestData = await getGuestsByInvitationId(invitationId);
        setGuests(guestData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch invitation data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [invitationId, navigate]);
  
  const handleAddGuest: SubmitHandler<GuestFormData> = async (data) => {
    if (!invitationId) return;
    
    setAddingGuest(true);
    try {
      const guestData: Guest = {
        name: data.name,
        mobile: data.mobile,
        invitation_id: invitationId,
      };
      
      const newGuest = await addGuest(guestData);
      
      if (newGuest) {
        setGuests(prev => [newGuest, ...prev]);
        form.reset();
        setDialogOpen(false);
        toast({
          title: "Success",
          description: "Guest added successfully",
        });
      } else {
        throw new Error("Failed to add guest");
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingGuest(false);
    }
  };
  
  const copyGuestLink = (guestId: string) => {
    const link = `${window.location.origin}/invitation/${invitationId}?guest=${guestId}`;
    navigator.clipboard.writeText(link);
    setCopiedGuestId(guestId);
    toast({
      title: "Link Copied",
      description: "Guest invitation link copied to clipboard",
    });
    setTimeout(() => setCopiedGuestId(null), 2000);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream/20 pattern-background flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-wedding-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading guest management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wedding-cream/20 pattern-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/invitations" 
            className="text-wedding-maroon hover:text-wedding-maroon/80 flex items-center mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Invitations
          </Link>
          
          {invitation && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-great-vibes text-wedding-maroon">
                  {invitation.bride_first_name} & {invitation.groom_first_name}'s Wedding
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Heart size={14} className="text-wedding-gold mr-2" />
                  {formatDate(invitation.wedding_date)} at {invitation.wedding_time}
                </p>
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-wedding-maroon hover:bg-wedding-maroon/80">
                    <UserPlus size={16} className="mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Guest</DialogTitle>
                    <DialogDescription>
                      Enter the guest details to generate a personalized invitation link.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddGuest)} className="space-y-4 py-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter guest name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter className="pt-4">
                        <Button type="submit" disabled={addingGuest}>
                          {addingGuest ? (
                            <>
                              <Loader2 size={16} className="animate-spin mr-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus size={16} className="mr-2" />
                              Add Guest
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        
        <Card className="border-wedding-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-wedding-maroon">
              <Users size={20} className="text-wedding-gold" />
              Guest Management
            </CardTitle>
            <CardDescription>
              Add and manage guests for this wedding invitation
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {guests.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={24} className="text-wedding-gold" />
                </div>
                <h3 className="text-xl font-medium text-wedding-maroon mb-2">No Guests Added Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Add your first guest to generate a personalized invitation link
                </p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="bg-wedding-maroon hover:bg-wedding-maroon/80"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Your First Guest
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Personalized Link</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>{guest.mobile}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
                            onClick={() => copyGuestLink(guest.id!)}
                          >
                            {copiedGuestId === guest.id ? (
                              <>
                                <Copy size={14} className="mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} className="mr-1" />
                                Copy Link
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-wedding-gold/10 pt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/invitations')}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Invitations
            </Button>
            
            {guests.length > 0 && (
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-wedding-maroon hover:bg-wedding-maroon/80"
              >
                <UserPlus size={16} className="mr-2" />
                Add Guest
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GuestManagement;
