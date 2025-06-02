
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, MapPin, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useGuest } from '@/context/GuestContext';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  mapLink?: string;
  icon: React.ReactNode;
  color: string;
}

const EventTimeline: React.FC = () => {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const { guestId } = useGuest();
  
  const defaultEvents: Event[] = [
    {
      id: "mehendi",
      name: "Mehendi Ceremony",
      date: "28th June 2025",
      time: "4:00 PM",
      venue: "Royal Gardens",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-red-100 text-red-600"><Heart size={14} /></div>,
      color: "bg-red-50 border-red-200"
    },
    {
      id: "sangeet",
      name: "Sangeet Night",
      date: "29th June 2025",
      time: "7:00 PM",
      venue: "Grand Ballroom",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"/>
                <path d="M19.5 9c0 3.5-3.5 6.5-7.5 11-4-4.5-7.5-7.5-7.5-11a7.5 7.5 0 1 1 15 0z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      id: "wedding",
      name: "Wedding Ceremony",
      date: "30th June 2025",
      time: "8:00 PM",
      venue: "Heritage Palace",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-purple-100 text-purple-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A8 8 0 1 0 4 16.2"/>
                <path d="M12 10v10"/>
                <path d="m8 14 4-4 4 4"/>
              </svg>
            </div>,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: "reception",
      name: "Reception",
      date: "1st July 2025",
      time: "6:00 PM",
      venue: "Crystal Hall",
      mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
      icon: <div className="p-1.5 rounded-full bg-green-100 text-green-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                <path d="M7 2v20"/>
                <path d="M21 15V2"/>
                <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                <path d="M18 21a6 6 0 0 0-6-6h-3"/>
              </svg>
            </div>,
      color: "bg-green-50 border-green-200"
    },
  ];

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!guestId) {
        setUserEvents(defaultEvents);
        setIsLoading(false);
        return;
      }

      try {
        // Fetch events that this guest has access to
        const { data: accessData, error: accessError } = await supabase
          .from('guest_event_access')
          .select(`
            event_id,
            wedding_events (
              id,
              event_name,
              event_date,
              event_time,
              event_venue,
              event_address
            )
          `)
          .eq('guest_id', guestId);

        if (accessError) throw accessError;

        if (accessData && accessData.length > 0) {
          // Map the database events to our display format
          const mappedEvents = accessData.map((access: any, index: number) => {
            const event = access.wedding_events;
            const colors = ["bg-red-50 border-red-200", "bg-yellow-50 border-yellow-200", "bg-purple-50 border-purple-200", "bg-green-50 border-green-200"];
            const iconColors = ["bg-red-100 text-red-600", "bg-yellow-100 text-yellow-600", "bg-purple-100 text-purple-600", "bg-green-100 text-green-600"];
            
            return {
              id: event.id,
              name: event.event_name,
              date: new Date(event.event_date).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              }),
              time: event.event_time,
              venue: event.event_venue,
              mapLink: "https://maps.app.goo.gl/TKKdMSCXfaV92cFJ8",
              icon: <div className={`p-1.5 rounded-full ${iconColors[index % iconColors.length]}`}><Heart size={14} /></div>,
              color: colors[index % colors.length]
            };
          });
          setUserEvents(mappedEvents);
        } else {
          // If no specific access, show all default events
          setUserEvents(defaultEvents);
        }
      } catch (error) {
        console.error('Error fetching user events:', error);
        setUserEvents(defaultEvents);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [guestId]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = eventRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1 && !visibleEvents.includes(index)) {
            setVisibleEvents(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    eventRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [visibleEvents, userEvents]);

  const handleEventHover = (index: number) => {
    setActiveEvent(index);
  };

  const handleEventLeave = () => {
    setActiveEvent(null);
  };

  if (isLoading) {
    return (
      <section className="w-full py-12 bg-wedding-cream bg-opacity-40">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="loading-spinner w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl mt-3">Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-wedding-cream bg-opacity-40">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1.5 px-4 bg-wedding-gold/10 rounded-full text-sm font-medium text-wedding-gold mb-3 tracking-wide">
            Join Us For
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl text-wedding-maroon mb-3">Wedding Ceremonies</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Celebrate these special moments with us as we begin our journey together
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-wedding-gold/10 via-wedding-gold/30 to-wedding-gold/10 transform -translate-x-1/2"></div>
          
          <div className="space-y-6">
            {userEvents.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center md:items-start gap-4 md:gap-6 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 transform translate-y-0 transition-all duration-700' 
                    : 'opacity-0 transform translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => handleEventHover(index)}
                onMouseLeave={handleEventLeave}
                onTouchStart={() => handleEventHover(index)}
                onTouchEnd={handleEventLeave}
              >
                <div className="hidden md:flex absolute left-1/2 w-8 h-8 bg-wedding-gold/80 rounded-full transform -translate-x-1/2 items-center justify-center z-10 transition-all duration-300 shadow-gold-soft">
                  <div className={`w-3 h-3 bg-wedding-cream rounded-full transition-all duration-300 ${activeEvent === index ? 'scale-75' : 'scale-100'}`}></div>
                </div>
                
                <div 
                  className={`glass-card border md:w-5/12 w-full p-4 sm:p-5 transition-all duration-300 ${
                    activeEvent === index ? 'shadow-gold-glow border-wedding-gold/40 transform scale-105' : 'shadow-gold-soft hover:shadow-gold-glow hover:scale-[1.02]'
                  } ${event.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 transition-all duration-300 ${activeEvent === index ? 'transform scale-110' : ''}`}>
                      {event.icon}
                    </div>
                    <div className="w-full">
                      <h3 className="font-playfair text-lg sm:text-xl text-wedding-maroon mb-2">{event.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar size={14} className="mr-2 text-wedding-gold" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm pl-6">{event.time}</p>
                        {event.venue && <p className="text-gray-700 font-medium text-sm pl-6">{event.venue}</p>}
                        
                        {event.mapLink && (
                          <div className="pl-6 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-7 px-3 text-xs bg-wedding-gold/5 hover:bg-wedding-gold/10 border-wedding-gold/30 text-wedding-maroon"
                            >
                              <a 
                                href={event.mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <MapPin size={12} />
                                <span>View Map</span>
                                <ExternalLink size={10} />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;
