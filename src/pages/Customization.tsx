import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/context/WeddingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Plus, Trash2, Calendar, Clock, MapPin, Image, Users, Phone } from 'lucide-react';
import { WeddingEvent, PhotoGalleryItem, ContactPerson, FamilyMember } from '@/types/wedding';

const Customization = () => {
  const navigate = useNavigate();
  const { weddingData, updateCouple, addEvent, removeEvent, addPhoto, removePhoto, addContact, removeContact, addFamilyMember, removeFamilyMember } = useWedding();
  
  const [newEvent, setNewEvent] = useState<Omit<WeddingEvent, 'id'>>({
    name: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    description: ''
  });

  const [newPhoto, setNewPhoto] = useState<Omit<PhotoGalleryItem, 'id'>>({
    url: '',
    title: '',
    description: ''
  });

  const [newContact, setNewContact] = useState<Omit<ContactPerson, 'id'>>({
    name: '',
    relation: '',
    phone: ''
  });

  const [newFamilyMember, setNewFamilyMember] = useState<{
    type: 'groom' | 'bride';
    member: Omit<FamilyMember, 'id'>;
  }>({
    type: 'groom',
    member: {
      name: '',
      relation: '',
      description: '',
      image: ''
    }
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your wedding customization has been saved successfully.",
    });
  };

  const handlePreview = () => {
    navigate('/invitation');
  };

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in event name, date, and time.",
        variant: "destructive"
      });
      return;
    }
    
    addEvent(newEvent);
    setNewEvent({
      name: '',
      date: '',
      time: '',
      venue: '',
      address: '',
      description: ''
    });
    toast({
      title: "Event Added",
      description: "New event has been added successfully.",
    });
  };

  const handleAddPhoto = () => {
    if (!newPhoto.url || !newPhoto.title) {
      toast({
        title: "Missing Information",
        description: "Please provide photo URL and title.",
        variant: "destructive"
      });
      return;
    }
    
    addPhoto(newPhoto);
    setNewPhoto({
      url: '',
      title: '',
      description: ''
    });
    toast({
      title: "Photo Added",
      description: "New photo has been added to the gallery.",
    });
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide contact name and phone number.",
        variant: "destructive"
      });
      return;
    }
    
    addContact(newContact);
    setNewContact({
      name: '',
      relation: '',
      phone: ''
    });
    toast({
      title: "Contact Added",
      description: "New contact has been added.",
    });
  };

  const handleAddFamilyMember = () => {
    if (!newFamilyMember.member.name || !newFamilyMember.member.relation) {
      toast({
        title: "Missing Information",
        description: "Please provide family member name and relation.",
        variant: "destructive"
      });
      return;
    }
    
    addFamilyMember(newFamilyMember.type, newFamilyMember.member);
    setNewFamilyMember({
      type: 'groom',
      member: {
        name: '',
        relation: '',
        description: '',
        image: ''
      }
    });
    toast({
      title: "Family Member Added",
      description: "New family member has been added.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-wedding-blush/20 to-wedding-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-wedding-gold/30"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-great-vibes text-wedding-maroon">Wedding Customization</h1>
              <p className="text-gray-600">Personalize your wedding invitation</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-wedding-gold hover:bg-wedding-deep-gold">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
            <Button onClick={handlePreview} variant="outline" className="border-wedding-gold/30">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <Tabs defaultValue="couple" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50">
            <TabsTrigger value="couple">Couple</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Couple Tab */}
          <TabsContent value="couple">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-wedding-maroon">
                  <Users size={20} />
                  Couple Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="groomFirstName">Groom First Name</Label>
                      <Input
                        id="groomFirstName"
                        value={weddingData.couple.groomFirstName}
                        onChange={(e) => updateCouple({ groomFirstName: e.target.value })}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groomLastName">Groom Last Name</Label>
                      <Input
                        id="groomLastName"
                        value={weddingData.couple.groomLastName}
                        onChange={(e) => updateCouple({ groomLastName: e.target.value })}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groomAbout">About Groom</Label>
                      <Textarea
                        id="groomAbout"
                        value={weddingData.couple.groomAbout || ''}
                        onChange={(e) => updateCouple({ groomAbout: e.target.value })}
                        className="border-wedding-gold/30"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="brideFirstName">Bride First Name</Label>
                      <Input
                        id="brideFirstName"
                        value={weddingData.couple.brideFirstName}
                        onChange={(e) => updateCouple({ brideFirstName: e.target.value })}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brideLastName">Bride Last Name</Label>
                      <Input
                        id="brideLastName"
                        value={weddingData.couple.brideLastName}
                        onChange={(e) => updateCouple({ brideLastName: e.target.value })}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brideAbout">About Bride</Label>
                      <Textarea
                        id="brideAbout"
                        value={weddingData.couple.brideAbout || ''}
                        onChange={(e) => updateCouple({ brideAbout: e.target.value })}
                        className="border-wedding-gold/30"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coupleStory">Your Love Story</Label>
                    <Textarea
                      id="coupleStory"
                      value={weddingData.couple.coupleStory || ''}
                      onChange={(e) => updateCouple({ coupleStory: e.target.value })}
                      className="border-wedding-gold/30"
                      rows={4}
                      placeholder="Tell your love story..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="couplePhotoUrl">Couple Photo URL</Label>
                    <Input
                      id="couplePhotoUrl"
                      value={weddingData.couple.couplePhotoUrl || ''}
                      onChange={(e) => updateCouple({ couplePhotoUrl: e.target.value })}
                      className="border-wedding-gold/30"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-wedding-maroon">Add Family Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Family Type</Label>
                      <select
                        value={newFamilyMember.type}
                        onChange={(e) => setNewFamilyMember(prev => ({ ...prev, type: e.target.value as 'groom' | 'bride' }))}
                        className="w-full px-3 py-2 border border-wedding-gold/30 rounded-md"
                      >
                        <option value="groom">Groom's Family</option>
                        <option value="bride">Bride's Family</option>
                      </select>
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newFamilyMember.member.name}
                        onChange={(e) => setNewFamilyMember(prev => ({
                          ...prev,
                          member: { ...prev.member, name: e.target.value }
                        }))}
                        placeholder="Family member name"
                      />
                    </div>
                    <div>
                      <Label>Relation</Label>
                      <Input
                        value={newFamilyMember.member.relation}
                        onChange={(e) => setNewFamilyMember(prev => ({
                          ...prev,
                          member: { ...prev.member, relation: e.target.value }
                        }))}
                        placeholder="e.g., Father, Mother, Brother"
                      />
                    </div>
                    <div>
                      <Label>Photo URL</Label>
                      <Input
                        value={newFamilyMember.member.image}
                        onChange={(e) => setNewFamilyMember(prev => ({
                          ...prev,
                          member: { ...prev.member, image: e.target.value }
                        }))}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={newFamilyMember.member.description}
                      onChange={(e) => setNewFamilyMember(prev => ({
                        ...prev,
                        member: { ...prev.member, description: e.target.value }
                      }))}
                      placeholder="Brief description about this family member"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddFamilyMember} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Family Member
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Family Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Groom's Family</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weddingData.family.groomFamily.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-wedding-cream/30 rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.relation}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFamilyMember('groom', member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bride's Family</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weddingData.family.brideFamily.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-wedding-cream/30 rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.relation}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFamilyMember('bride', member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wedding-maroon">
                    <Calendar size={20} />
                    Add New Event
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Event Name</Label>
                      <Input
                        value={newEvent.name}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Mehendi Ceremony"
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="e.g., 4:00 PM"
                      />
                    </div>
                    <div>
                      <Label>Venue</Label>
                      <Input
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                        placeholder="Venue name"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Address</Label>
                    <Input
                      value={newEvent.address}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Full address"
                    />
                  </div>
                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the event"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddEvent} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Event
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weddingData.events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-wedding-cream/30 rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                          <p className="text-sm text-gray-600">{event.venue}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEvent(event.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wedding-maroon">
                    <Image size={20} />
                    Add New Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Photo URL</Label>
                      <Input
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Photo title"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={newPhoto.description}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Photo description"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddPhoto} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Photo
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Photo Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weddingData.photoGallery.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePhoto(photo.id)}
                            className="text-white hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div className="mt-2">
                          <p className="font-medium text-sm">{photo.title}</p>
                          <p className="text-xs text-gray-600">{photo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-wedding-maroon">
                    <Phone size={20} />
                    Add New Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label>Relation</Label>
                      <Input
                        value={newContact.relation}
                        onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
                        placeholder="e.g., Groom, Best Man"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddContact} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Contact
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weddingData.contacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-wedding-cream/30 rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.relation} • {contact.phone}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-wedding-maroon">Wedding Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Wedding Date</Label>
                    <Input
                      type="date"
                      value={weddingData.mainWedding.date.toISOString().split('T')[0]}
                      onChange={(e) => {
                        // This would need to be implemented in the context
                        console.log('Update wedding date:', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Wedding Time</Label>
                    <Input
                      value={weddingData.mainWedding.time}
                      onChange={(e) => {
                        // This would need to be implemented in the context
                        console.log('Update wedding time:', e.target.value);
                      }}
                      placeholder="e.g., 7:00 PM"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Venue Name</Label>
                  <Input
                    value={weddingData.mainWedding.venue.name}
                    onChange={(e) => {
                      // This would need to be implemented in the context
                      console.log('Update venue name:', e.target.value);
                    }}
                    placeholder="Wedding venue name"
                  />
                </div>
                
                <div>
                  <Label>Venue Address</Label>
                  <Textarea
                    value={weddingData.mainWedding.venue.address}
                    onChange={(e) => {
                      // This would need to be implemented in the context
                      console.log('Update venue address:', e.target.value);
                    }}
                    placeholder="Full venue address"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Map Link</Label>
                  <Input
                    value={weddingData.mainWedding.venue.mapLink || ''}
                    onChange={(e) => {
                      // This would need to be implemented in the context
                      console.log('Update map link:', e.target.value);
                    }}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Customization;
