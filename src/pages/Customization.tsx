
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '@/context/WeddingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, Image, Phone, Heart, Settings, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FloatingPetals } from '@/components/AnimatedElements';

const Customization: React.FC = () => {
  const navigate = useNavigate();
  const { weddingData, updateCouple, addEvent, removeEvent, addPhoto, removePhoto, addContact, removeContact } = useWedding();
  
  const [coupleData, setCoupleData] = useState(weddingData.couple);
  const [mainWeddingData, setMainWeddingData] = useState({
    date: weddingData.mainWedding.date.toISOString().split('T')[0],
    time: weddingData.mainWedding.time,
    venueName: weddingData.mainWedding.venue.name,
    venueAddress: weddingData.mainWedding.venue.address,
    mapLink: weddingData.mainWedding.venue.mapLink || ''
  });
  const [customMessage, setCustomMessage] = useState(weddingData.customMessage || '');
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    description: ''
  });
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [newContact, setNewContact] = useState({
    name: '',
    relation: '',
    phone: ''
  });

  const handleSave = () => {
    updateCouple(coupleData);
    toast({
      title: "Success",
      description: "Wedding details have been saved successfully!",
    });
  };

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.time && newEvent.venue) {
      addEvent(newEvent);
      setNewEvent({ name: '', date: '', time: '', venue: '', address: '', description: '' });
      toast({
        title: "Event Added",
        description: `${newEvent.name} has been added to your wedding events.`,
      });
    }
  };

  const handleAddPhoto = () => {
    if (newPhoto.url && newPhoto.title) {
      addPhoto(newPhoto);
      setNewPhoto({ url: '', title: '', description: '' });
      toast({
        title: "Photo Added",
        description: "Photo has been added to your gallery.",
      });
    }
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      addContact(newContact);
      setNewContact({ name: '', relation: '', phone: '' });
      toast({
        title: "Contact Added",
        description: `${newContact.name} has been added to your contacts.`,
      });
    }
  };

  const handlePreview = () => {
    updateCouple(coupleData);
    navigate('/');
  };

  return (
    <div className="min-h-screen pattern-background">
      <FloatingPetals />
      
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-great-vibes text-3xl sm:text-4xl text-wedding-maroon mb-2">
              Customize Your Wedding
            </h1>
            <p className="text-gray-600">Personalize every detail of your special day</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
            >
              <Settings size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="couple" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="couple">Couple</TabsTrigger>
            <TabsTrigger value="wedding">Wedding</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="couple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-wedding-gold" size={20} />
                  Couple Information
                </CardTitle>
                <CardDescription>
                  Enter the bride and groom's details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-playfair text-lg text-wedding-maroon">Groom Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="groomFirstName">First Name</Label>
                      <Input
                        id="groomFirstName"
                        value={coupleData.groomFirstName}
                        onChange={(e) => setCoupleData({...coupleData, groomFirstName: e.target.value})}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groomLastName">Last Name</Label>
                      <Input
                        id="groomLastName"
                        value={coupleData.groomLastName}
                        onChange={(e) => setCoupleData({...coupleData, groomLastName: e.target.value})}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groomAbout">About Groom</Label>
                      <Textarea
                        id="groomAbout"
                        value={coupleData.groomAbout || ''}
                        onChange={(e) => setCoupleData({...coupleData, groomAbout: e.target.value})}
                        className="border-wedding-gold/30"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-playfair text-lg text-wedding-maroon">Bride Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="brideFirstName">First Name</Label>
                      <Input
                        id="brideFirstName"
                        value={coupleData.brideFirstName}
                        onChange={(e) => setCoupleData({...coupleData, brideFirstName: e.target.value})}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brideLastName">Last Name</Label>
                      <Input
                        id="brideLastName"
                        value={coupleData.brideLastName}
                        onChange={(e) => setCoupleData({...coupleData, brideLastName: e.target.value})}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brideAbout">About Bride</Label>
                      <Textarea
                        id="brideAbout"
                        value={coupleData.brideAbout || ''}
                        onChange={(e) => setCoupleData({...coupleData, brideAbout: e.target.value})}
                        className="border-wedding-gold/30"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coupleStory">Our Love Story</Label>
                    <Textarea
                      id="coupleStory"
                      value={coupleData.coupleStory || ''}
                      onChange={(e) => setCoupleData({...coupleData, coupleStory: e.target.value})}
                      className="border-wedding-gold/30"
                      rows={4}
                      placeholder="Tell your love story..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="couplePhotoUrl">Couple Photo URL</Label>
                    <Input
                      id="couplePhotoUrl"
                      value={coupleData.couplePhotoUrl || ''}
                      onChange={(e) => setCoupleData({...coupleData, couplePhotoUrl: e.target.value})}
                      className="border-wedding-gold/30"
                      placeholder="https://example.com/couple-photo.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customMessage">Custom Message</Label>
                    <Textarea
                      id="customMessage"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="border-wedding-gold/30"
                      rows={3}
                      placeholder="A special message for your guests..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wedding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-wedding-gold" size={20} />
                  Wedding Details
                </CardTitle>
                <CardDescription>
                  Set your main wedding ceremony details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={mainWeddingData.date}
                      onChange={(e) => setMainWeddingData({...mainWeddingData, date: e.target.value})}
                      className="border-wedding-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingTime">Wedding Time</Label>
                    <Input
                      id="weddingTime"
                      value={mainWeddingData.time}
                      onChange={(e) => setMainWeddingData({...mainWeddingData, time: e.target.value})}
                      className="border-wedding-gold/30"
                      placeholder="8:00 PM"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueName">Venue Name</Label>
                  <Input
                    id="venueName"
                    value={mainWeddingData.venueName}
                    onChange={(e) => setMainWeddingData({...mainWeddingData, venueName: e.target.value})}
                    className="border-wedding-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueAddress">Venue Address</Label>
                  <Textarea
                    id="venueAddress"
                    value={mainWeddingData.venueAddress}
                    onChange={(e) => setMainWeddingData({...mainWeddingData, venueAddress: e.target.value})}
                    className="border-wedding-gold/30"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapLink">Map Link</Label>
                  <Input
                    id="mapLink"
                    value={mainWeddingData.mapLink}
                    onChange={(e) => setMainWeddingData({...mainWeddingData, mapLink: e.target.value})}
                    className="border-wedding-gold/30"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-wedding-gold" size={20} />
                  Family Members
                </CardTitle>
                <CardDescription>
                  Add and manage family members for both sides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Family management functionality coming soon...</p>
                  <p className="text-sm">You can currently view family details in the preview</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-wedding-gold" size={20} />
                  Wedding Events
                </CardTitle>
                <CardDescription>
                  Manage all your wedding events and ceremonies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Add New Event</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        placeholder="e.g., Sangeet Night"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventVenue">Venue</Label>
                      <Input
                        id="eventVenue"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                        placeholder="Venue name"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Time</Label>
                      <Input
                        id="eventTime"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        placeholder="e.g., 7:00 PM"
                        className="border-wedding-gold/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventAddress">Address</Label>
                    <Input
                      id="eventAddress"
                      value={newEvent.address}
                      onChange={(e) => setNewEvent({...newEvent, address: e.target.value})}
                      placeholder="Full address"
                      className="border-wedding-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Event description..."
                      className="border-wedding-gold/30"
                    />
                  </div>
                  <Button onClick={handleAddEvent} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Event
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Current Events</h3>
                  {weddingData.events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-wedding-gold/20 rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                      </div>
                      <Button
                        variant="outline"
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
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="text-wedding-gold" size={20} />
                  Photo Gallery
                </CardTitle>
                <CardDescription>
                  Upload and manage your wedding photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Add New Photo</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl">Photo URL</Label>
                      <Input
                        id="photoUrl"
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                        placeholder="https://example.com/photo.jpg"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoTitle">Title</Label>
                      <Input
                        id="photoTitle"
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                        placeholder="Photo title"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoDescription">Description</Label>
                      <Textarea
                        id="photoDescription"
                        value={newPhoto.description}
                        onChange={(e) => setNewPhoto({...newPhoto, description: e.target.value})}
                        placeholder="Photo description..."
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <Button onClick={handleAddPhoto} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                      <Plus size={16} className="mr-2" />
                      Add Photo
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Current Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weddingData.photoGallery.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePhoto(photo.id)}
                            className="text-white border-white hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <p className="text-sm font-medium mt-2">{photo.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="text-wedding-gold" size={20} />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Add contact persons for your wedding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Add New Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Name</Label>
                      <Input
                        id="contactName"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Contact name"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactRelation">Relation</Label>
                      <Input
                        id="contactRelation"
                        value={newContact.relation}
                        onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                        placeholder="e.g., Father of Bride"
                        className="border-wedding-gold/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                        className="border-wedding-gold/30"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddContact} className="bg-wedding-gold hover:bg-wedding-deep-gold">
                    <Plus size={16} className="mr-2" />
                    Add Contact
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-wedding-maroon">Current Contacts</h3>
                  {weddingData.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border border-wedding-gold/20 rounded-lg">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relation}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                      <Button
                        variant="outline"
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Customization;
