
import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, PartyPopper } from 'lucide-react';

interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  icon: React.ReactNode;
  color: string;
}

const EventTimeline: React.FC = () => {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const events: Event[] = [
    {
      name: "Mehndi Ceremony",
      date: "12th February 2025",
      time: "10:00 AM - 3:00 PM",
      venue: "Sharma Residence, 123 Lotus Lane",
      icon: <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="currentColor" />
              </svg>
            </div>,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      name: "Sangeet Night",
      date: "13th February 2025",
      time: "6:00 PM - 11:00 PM",
      venue: "Grand Pavilion, 456 Harmony Road",
      icon: <div className="p-2 rounded-full bg-purple-100 text-purple-600"><Music size={18} /></div>,
      color: "bg-purple-50 border-purple-200"
    },
    {
      name: "Wedding Ceremony",
      date: "14th February 2025",
      time: "11:00 AM - 3:00 PM",
      venue: "Divine Gardens, 789 Blessing Avenue",
      icon: <div className="p-2 rounded-full bg-red-100 text-red-600"><Heart size={18} /></div>,
      color: "bg-red-50 border-red-200"
    },
    {
      name: "Reception",
      date: "14th February 2025",
      time: "7:00 PM - 12:00 AM",
      venue: "Royal Banquet Hall, 101 Celebration Street",
      icon: <div className="p-2 rounded-full bg-blue-100 text-blue-600"><PartyPopper size={18} /></div>,
      color: "bg-blue-50 border-blue-200"
    }
  ];
  
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
  }, [visibleEvents]);

  return (
    <section className="w-full py-12 bg-wedding-cream bg-opacity-40">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-wedding-gold/10 rounded-full text-xs text-wedding-gold mb-2">
            Join Us For
          </span>
          <h2 className="font-playfair text-3xl text-wedding-maroon">Wedding Events</h2>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-wedding-gold/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center md:items-start gap-6 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 transform translate-y-0 transition-all duration-700' 
                    : 'opacity-0 transform translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot - visible on md+ screens */}
                <div className="hidden md:flex absolute left-1/2 w-6 h-6 bg-wedding-gold rounded-full transform -translate-x-1/2 items-center justify-center z-10">
                  <div className="w-3 h-3 bg-wedding-cream rounded-full"></div>
                </div>
                
                {/* Event card */}
                <div className={`glass-card border md:w-5/12 p-5 ${event.color}`}>
                  <div className="flex items-start space-x-4">
                    {event.icon}
                    <div>
                      <h3 className="font-playfair text-xl text-wedding-maroon">{event.name}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <p className="text-gray-600 pl-5">{event.time}</p>
                        <p className="text-gray-700 font-medium pl-5">{event.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Empty space for alignment on opposite side */}
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
