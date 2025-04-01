import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { getInvitationById, getGuestById } from '@/lib/invitation-helpers';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Music, 
  Music2Off, 
  Phone, 
  Mail, 
  Users, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatInvitationData } from '@/lib/supabase-helpers';

const Invitation = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const guestId = searchParams.get('guest');
  const { guestName, setGuestName } = useGuest();
  const { isPlaying, toggleMusic } = useAudio();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // If we have both invitation ID and guest ID
        if (id && guestId) {
          // Fetch guest information
          const guest = await getGuestById(guestId);
          
          if (guest) {
            // Set the guest name in context
            setGuestName(guest.name);
          } else {
            // If guest not found, use default
            setGuestName('Guest Name');
          }
        } else {
          // No guest ID, use default
          setGuestName('Guest Name');
        }
        
        // Fetch invitation details
        if (id) {
          const data = await getInvitationById(id);
          if (data.invitation) {
            setInvitation(formatInvitationData(data.invitation));
            setEvents(data.events || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use default in case of error
        setGuestName('Guest Name');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, guestId, setGuestName]);
  
  const nextImage = () => {
    if (invitation?.gallery_images?.length) {
      setActiveImageIndex((prev) => 
        prev === invitation.gallery_images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (invitation?.gallery_images?.length) {
      setActiveImageIndex((prev) => 
        prev === 0 ? invitation.gallery_images.length - 1 : prev - 1
      );
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wedding-cream pattern-background">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Loading invitation...</p>
        </div>
      </div>
    );
  }
  
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wedding-cream pattern-background">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <Heart className="text-red-400" size={32} />
          </div>
          <h1 className="text-2xl font-medium text-wedding-maroon mb-2">Invitation Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the wedding invitation you're looking for. It may have been removed or the link is incorrect.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-wedding-maroon hover:bg-wedding-maroon/80"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wedding-cream pattern-background relative overflow-hidden">
      {/* Audio Control */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 rounded-full bg-white/80 backdrop-blur-sm border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10"
        onClick={toggleMusic}
      >
        {isPlaying ? <Music size={18} /> : <Music2Off size={18} />}
      </Button>
      
      <FloatingPetals />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4">
            {invitation.bride_name} & {invitation.groom_name}
          </h1>
          <div>
            <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold mb-2">
              Wedding Invitation
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
              <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
            </div>
          </div>
        </motion.div>
        
        {/* Guest Welcome */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-lg text-wedding-maroon font-dancing-script">
            Dear <span className="font-semibold">{guestName}</span>,
          </p>
          <p className="mt-2 text-gray-700">
            We are delighted to invite you to celebrate our wedding day with us.
          </p>
        </motion.div>
        
        {/* Couple Image */}
        {invitation.couple_image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="max-w-md mx-auto rounded-lg overflow-hidden shadow-lg border-4 border-white">
              <img 
                src={invitation.couple_image_url} 
                alt="Couple" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}
        
        {/* Couple Story */}
        {invitation.couple_story && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12 max-w-2xl mx-auto text-center"
          >
            <h3 className="font-dancing-script text-2xl text-wedding-gold mb-4">Our Story</h3>
            <p className="text-gray-700 italic">
              {invitation.couple_story}
            </p>
          </motion.div>
        )}
        
        {/* Wedding Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-wedding-gold/10">
            <h3 className="font-dancing-script text-2xl text-wedding-gold mb-6 text-center">
              Wedding Ceremony
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-wedding-gold/10 p-2 rounded-full">
                  <Calendar className="text-wedding-gold" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-wedding-maroon mb-1">Date</h4>
                  <p className="text-gray-700">
                    {new Date(invitation.wedding_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-wedding-gold/10 p-2 rounded-full">
                  <Clock className="text-wedding-gold" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-wedding-maroon mb-1">Time</h4>
                  <p className="text-gray-700">{invitation.wedding_time}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-start gap-4">
              <div className="bg-wedding-gold/10 p-2 rounded-full">
                <MapPin className="text-wedding-gold" size={24} />
              </div>
              <div>
                <h4 className="font-medium text-wedding-maroon mb-1">Venue</h4>
                <p className="text-gray-700 font-medium">{invitation.wedding_venue}</p>
                <p className="text-gray-600 mt-1">{invitation.wedding_address}</p>
                
                {invitation.map_url && (
                  <a 
                    href={invitation.map_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-wedding-maroon hover:text-wedding-gold underline underline-offset-4"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Additional Events */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-12"
          >
            <h3 className="font-dancing-script text-2xl text-wedding-gold mb-6 text-center">
              Wedding Events
            </h3>
            
            <div className="space-y-4">
              {events.map((event, index) => (
                <div 
                  key={event.id || index}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-md border border-wedding-gold/10"
                >
                  <h4 className="font-medium text-wedding-maroon text-lg mb-3">
                    {event.event_name}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-wedding-gold" size={18} />
                      <span className="text-gray-700">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="text-wedding-gold" size={18} />
                      <span className="text-gray-700">{event.event_time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="text-wedding-gold mt-1" size={18} />
                    <div>
                      <p className="text-gray-700 font-medium">{event.event_venue}</p>
                      {event.event_address && (
                        <p className="text-gray-600 text-sm mt-1">{event.event_address}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Gallery */}
        {invitation.gallery_images && invitation.gallery_images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="font-dancing-script text-2xl text-wedding-gold mb-6 text-center">
              Our Gallery
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {invitation.gallery_images.map((image: any, index: number) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md border-2 border-white hover:border-wedding-gold/30 transition-all"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setShowGallery(true);
                  }}
                >
                  <img 
                    src={typeof image === 'string' ? image : image.url} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Fullscreen Gallery */}
            <AnimatePresence>
              {showGallery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowGallery(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGallery(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 z-10 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 z-10 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight size={24} />
                  </Button>
                  
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative max-w-3xl max-h-[80vh]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img 
                      src={typeof invitation.gallery_images[activeImageIndex] === 'string' 
                        ? invitation.gallery_images[activeImageIndex] 
                        : invitation.gallery_images[activeImageIndex].url
                      } 
                      alt={`Gallery ${activeImageIndex + 1}`}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                    
                    {typeof invitation.gallery_images[activeImageIndex] !== 'string' && 
                     invitation.gallery_images[activeImageIndex].title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                        <h4 className="font-medium text-lg">
                          {invitation.gallery_images[activeImageIndex].title}
                        </h4>
                        {invitation.gallery_images[activeImageIndex].description && (
                          <p className="text-sm text-gray-200 mt-1">
                            {invitation.gallery_images[activeImageIndex].description}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {invitation.gallery_images.map((_: any, index: number) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === activeImageIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(index);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Family */}
        {(invitation.bride_family?.length > 0 || invitation.groom_family?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-12"
          >
            <h3 className="font-dancing-script text-2xl text-wedding-gold mb-6 text-center">
              Our Families
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {invitation.bride_family?.length > 0 && (
                <div>
                  <h4 className="font-medium text-wedding-maroon text-lg mb-4 text-center">
                    Bride's Family
                  </h4>
                  
                  <div className="space-y-4">
                    {invitation.bride_family.map((member: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-wedding-gold/10"
                      >
                        {member.image_url ? (
                          <img 
                            src={member.image_url} 
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-wedding-gold/20"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center border-2 border-wedding-gold/20">
                            <Users className="text-wedding-gold/50" size={24} />
                          </div>
                        )}
                        
                        <div>
                          <h5 className="font-medium text-wedding-maroon">{member.name}</h5>
                          <p className="text-sm text-gray-600">{member.relation}</p>
                          {member.description && (
                            <p className="text-xs text-gray-500 mt-1">{member.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {invitation.groom_family?.length > 0 && (
                <div>
                  <h4 className="font-medium text-wedding-maroon text-lg mb-4 text-center">
                    Groom's Family
                  </h4>
                  
                  <div className="space-y-4">
                    {invitation.groom_family.map((member: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-wedding-gold/10"
                      >
                        {member.image_url ? (
                          <img 
                            src={member.image_url} 
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-wedding-gold/20"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-wedding-gold/10 flex items-center justify-center border-2 border-wedding-gold/20">
                            <Users className="text-wedding-gold/50" size={24} />
                          </div>
                        )}
                        
                        <div>
                          <h5 className="font-medium text-wedding-maroon">{member.name}</h5>
                          <p className="text-sm text-gray-600">{member.relation}</p>
                          {member.description && (
                            <p className="text-xs text-gray-500 mt-1">{member.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Custom Message */}
        {invitation.custom_message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-12 max-w-2xl mx-auto text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-wedding-gold/10">
              <h3 className="font-dancing-script text-2xl text-wedding-gold mb-4">
                Message from the Couple
              </h3>
              <p className="text-gray-700 italic">
                {invitation.custom_message}
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mb-12"
        >
          <h3 className="font-dancing-script text-2xl text-wedding-gold mb-6 text-center">
            Contact Us
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {invitation.contact_phone && (
              <a 
                href={`tel:${invitation.contact_phone}`}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-5 py-3 shadow-sm border border-wedding-gold/10 hover:bg-white transition-colors"
              >
                <Phone className="text-wedding-gold" size={20} />
                <span className="text-wedding-maroon">{invitation.contact_phone}</span>
              </a>
            )}
            
            {invitation.contact_email && (
              <a 
                href={`mailto:${invitation.contact_email}`}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-5 py-3 shadow-sm border border-wedding-gold/10 hover:bg-white transition-colors"
              >
                <Mail className="text-wedding-gold" size={20} />
                <span className="text-wedding-maroon">{invitation.contact_email}</span>
              </a>
            )}
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <p className="text-gray-600 text-sm">
            We look forward to celebrating with you!
          </p>
          <div className="mt-4 flex justify-center">
            <Heart className="text-wedding-gold animate-pulse" size={24} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Invitation;
