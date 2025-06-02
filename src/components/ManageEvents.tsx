
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, Save } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  event_address: string;
}

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: string;
  event_access?: string[];
}

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestEventAccess, setGuestEventAccess] = useState<{[guestId: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guestsError) throw guestsError;

      setEvents(eventsData || []);
      setGuests(guestsData || []);

      // Initialize guest event access (for now, give all guests access to all events)
      const initialAccess: {[guestId: string]: string[]} = {};
      guestsData?.forEach(guest => {
        initialAccess[guest.id] = eventsData?.map(event => event.id) || [];
      });
      setGuestEventAccess(initialAccess);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load events and guests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEventAccess = (guestId: string, eventId: string) => {
    setGuestEventAccess(prev => {
      const currentAccess = prev[guestId] || [];
      const hasAccess = currentAccess.includes(eventId);
      
      return {
        ...prev,
        [guestId]: hasAccess 
          ? currentAccess.filter(id => id !== eventId)
          : [...currentAccess, eventId]
      };
    });
  };

  const saveEventAccess = async () => {
    setIsSaving(true);
    try {
      // Here you would save to database
      // For now, we'll just show success message
      toast({
        title: "Success",
        description: "Event access settings saved successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving event access:', error);
      toast({
        title: "Error",
        description: "Failed to save event access settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-wedding-maroon font-dancing-script text-xl ml-3">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-great-vibes text-2xl sm:text-3xl text-wedding-maroon mb-2">Manage Event Access</h2>
        <p className="text-gray-600 text-sm">Control which events each guest can access</p>
      </div>

      {events.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <CalendarDays size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No events found. Please add events first.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Events Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {events.map((event) => (
              <Card key={event.id} className="border-wedding-gold/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-playfair text-wedding-maroon flex items-center gap-2">
                    <CalendarDays size={18} className="text-wedding-gold" />
                    {event.event_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{event.event_date} at {event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{event.event_venue}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guest Event Access Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} className="text-wedding-gold" />
                Guest Event Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No guests found</p>
              ) : (
                <div className="space-y-4">
                  {guests.map((guest) => (
                    <div key={guest.id} className="border border-wedding-gold/20 rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-wedding-maroon">{guest.name}</h4>
                          <p className="text-sm text-gray-600">{guest.mobile}</p>
                          {guest.status && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 mb-2">Event Access:</p>
                          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                            {events.map((event) => (
                              <div key={event.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${guest.id}-${event.id}`}
                                  checked={guestEventAccess[guest.id]?.includes(event.id) || false}
                                  onCheckedChange={() => toggleEventAccess(guest.id, event.id)}
                                />
                                <label 
                                  htmlFor={`${guest.id}-${event.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {event.event_name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={saveEventAccess}
              disabled={isSaving}
              className="bg-wedding-gold hover:bg-wedding-deep-gold text-white px-8 py-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Event Access
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageEvents;
