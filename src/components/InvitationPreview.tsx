
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, Heart, Edit, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FloatingPetals, Confetti } from '@/components/AnimatedElements';

interface InvitationPreviewProps {
  invitationData: {
    bride_name: string;
    groom_name: string;
    couple_image_url?: string;
    wedding_date: string;
    wedding_time: string;
    wedding_venue: string;
    wedding_address: string;
    bride_family: any[];
    groom_family: any[];
    events: any[];
    gallery_images: any[];
    custom_message: string;
  };
  editable?: boolean;
  onUpdate?: (field: string, value: any) => void;
  showEditHints?: boolean;
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ 
  invitationData, 
  editable = false,
  onUpdate = () => {},
  showEditHints = false
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{[key: string]: any}>({});
  const [activePage, setActivePage] = useState<'welcome' | 'invitation'>('welcome');
  const [showHearts, setShowHearts] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const formatDate = (dateString: string | Date) => {
    try {
      // If it's already a Date object, use it directly
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      // If formatting fails, convert to string as a fallback
      return String(dateString);
    }
  };

  const handleEditStart = (field: string, value: any) => {
    if (!editable) return;
    setEditingField(field);
    setTempValues({...tempValues, [field]: value});
  };

  const handleEditChange = (field: string, value: any) => {
    setTempValues({...tempValues, [field]: value});
  };

  const handleEditSave = (field: string) => {
    if (onUpdate) {
      onUpdate(field, tempValues[field]);
    }
    setEditingField(null);
  };

  const handleEditCancel = () => {
    setEditingField(null);
  };

  const handleImageUpload = (field: string) => {
    // This would trigger an upload dialog in the actual app
    if (!editable) return;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Just for preview demonstration, we'd actually upload to storage
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (onUpdate) {
            onUpdate(field, imageUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const triggerHearts = () => {
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 3000);
  };

  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  };

  const renderEditableText = (field: string, value: string | Date, isHeader: boolean = false) => {
    // Ensure value is a string before rendering
    const displayValue = value instanceof Date ? formatDate(value) : String(value || '');
    
    if (editingField === field) {
      return (
        <div className="flex items-center">
          <Input
            value={tempValues[field]}
            onChange={(e) => handleEditChange(field, e.target.value)}
            className="border-wedding-gold/30 bg-white/90"
            autoFocus
          />
          <button 
            onClick={() => handleEditSave(field)}
            className="ml-2 p-1 bg-wedding-gold/20 rounded-full"
            title="Save"
          >
            <Check size={16} className="text-wedding-maroon" />
          </button>
          <button 
            onClick={handleEditCancel}
            className="ml-1 p-1 bg-red-100 rounded-full"
            title="Cancel"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      );
    }

    if (isHeader) {
      return (
        <h2 
          className={`font-great-vibes text-4xl text-wedding-maroon mb-2 ${editable ? 'cursor-pointer group relative' : ''}`}
          onClick={() => handleEditStart(field, displayValue)}
        >
          {displayValue}
          {editable && (
            <Edit size={16} className="invisible group-hover:visible absolute -right-6 top-2 text-wedding-gold/70" />
          )}
        </h2>
      );
    }

    return (
      <p 
        className={`${editable ? 'cursor-pointer group relative' : ''}`}
        onClick={() => handleEditStart(field, displayValue)}
      >
        {displayValue}
        {editable && (
          <Edit size={14} className="invisible group-hover:visible absolute -right-5 top-1 text-wedding-gold/70" />
        )}
      </p>
    );
  };

  const renderEditableContent = (field: string, value: string) => {
    // Ensure value is a string
    const displayValue = String(value || '');
    
    if (editingField === field) {
      return (
        <div className="flex items-center">
          <Textarea
            value={tempValues[field]}
            onChange={(e) => handleEditChange(field, e.target.value)}
            className="border-wedding-gold/30 bg-white/90"
            autoFocus
          />
          <button 
            onClick={() => handleEditSave(field)}
            className="ml-2 p-1 bg-wedding-gold/20 rounded-full self-start mt-1"
            title="Save"
          >
            <Check size={16} className="text-wedding-maroon" />
          </button>
          <button 
            onClick={handleEditCancel}
            className="ml-1 p-1 bg-red-100 rounded-full self-start mt-1"
            title="Cancel"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      );
    }

    return (
      <p 
        className={`italic text-gray-700 ${editable ? 'cursor-pointer group relative' : ''}`}
        onClick={() => handleEditStart(field, displayValue)}
      >
        {displayValue}
        {editable && (
          <Edit size={14} className="invisible group-hover:visible absolute -right-5 top-1 text-wedding-gold/70" />
        )}
      </p>
    );
  };

  const renderWelcomePage = () => {
    return (
      <div className="min-h-[600px] pattern-background">
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-wedding-cream bg-opacity-50 z-0"></div>
          <FloatingPetals />
          
          <div className="relative z-10 text-center mb-8">
            <h1 
              className={`font-great-vibes text-4xl sm:text-5xl text-wedding-maroon mb-4 opacity-0 animate-fade-in-up relative ${editable ? 'cursor-pointer group' : ''}`}
              onClick={() => editable && handleEditStart('names', `${invitationData.bride_name} & ${invitationData.groom_name}`)}
            >
              {invitationData.bride_name} & {invitationData.groom_name}
              {editable && (
                <Edit size={18} className="invisible group-hover:visible absolute -right-8 top-4 text-wedding-gold/70" />
              )}
            </h1>
            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-dancing-script text-2xl text-wedding-gold mb-2">
                Wedding Invitation
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
                <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
              </div>
            </div>
          </div>
          
          <div className="relative glass-card p-8 rounded-lg border border-wedding-gold/30 w-full max-w-md backdrop-blur-sm text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <p className="mb-6 text-wedding-maroon">Join us in celebrating our special day</p>
            
            <div className="mb-4">
              <p className="font-medium text-gray-700">Date</p>
              <p className="text-lg text-wedding-maroon" onClick={() => editable && handleEditStart('wedding_date', invitationData.wedding_date)}>
                {formatDate(invitationData.wedding_date)}
                {editable && <Edit size={14} className="ml-2 inline-block text-wedding-gold/70" />}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="font-medium text-gray-700">Time</p>
              <p className="text-lg text-wedding-maroon" onClick={() => editable && handleEditStart('wedding_time', invitationData.wedding_time)}>
                {invitationData.wedding_time}
                {editable && <Edit size={14} className="ml-2 inline-block text-wedding-gold/70" />}
              </p>
            </div>
            
            <div className="mb-6">
              <p className="font-medium text-gray-700">Venue</p>
              <p className="text-lg text-wedding-maroon" onClick={() => editable && handleEditStart('wedding_venue', invitationData.wedding_venue)}>
                {invitationData.wedding_venue}
                {editable && <Edit size={14} className="ml-2 inline-block text-wedding-gold/70" />}
              </p>
              <p className="text-sm text-gray-600" onClick={() => editable && handleEditStart('wedding_address', invitationData.wedding_address)}>
                {invitationData.wedding_address}
                {editable && <Edit size={14} className="ml-1 inline-block text-wedding-gold/70" />}
              </p>
            </div>
            
            <Button 
              className="bg-wedding-gold text-white hover:bg-wedding-deep-gold"
              onClick={() => {
                triggerConfetti();
                setActivePage('invitation');
              }}
            >
              View Invitation Details
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderInvitationPage = () => {
    return (
      <div className="scale-[0.9] origin-top">
        <div className="max-w-3xl mx-auto bg-wedding-cream p-8 rounded-lg shadow-lg border-2 border-wedding-gold/30">
          {showEditHints && editable && (
            <div className="mb-4 p-2 bg-wedding-gold/10 rounded text-sm text-wedding-maroon text-center">
              Click on any text or element to edit it directly
            </div>
          )}
          
          {/* Header */}
          <div className="text-center mb-8">
            {renderEditableText('names', `${invitationData.bride_name} & ${invitationData.groom_name}`, true)}
            <p className="text-lg text-gray-700">We're getting married!</p>
          </div>

          {/* Couple Image */}
          <div className="mb-8 flex justify-center">
            <div 
              className="w-64 h-64 rounded-full overflow-hidden border-4 border-wedding-gold/20 relative group"
              onClick={() => editable && handleImageUpload('couple_image_url')}
            >
              {invitationData.couple_image_url ? (
                <img 
                  src={invitationData.couple_image_url} 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Add Couple Photo</p>
                </div>
              )}
              {editable && (
                <div 
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                >
                  <Edit size={24} className="text-white" />
                  <span className="text-white text-sm ml-2">{invitationData.couple_image_url ? 'Change' : 'Add'} Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Date & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/70 border-wedding-gold/20">
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-wedding-maroon/10 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-wedding-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Wedding Date</h3>
                  {renderEditableText('wedding_date', formatDate(invitationData.wedding_date))}
                  {renderEditableText('wedding_time', invitationData.wedding_time)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 border-wedding-gold/20">
              <CardContent className="p-6 flex items-center">
                <div className="mr-4 bg-wedding-maroon/10 p-3 rounded-full">
                  <MapPin className="h-8 w-8 text-wedding-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Venue</h3>
                  {renderEditableText('wedding_venue', invitationData.wedding_venue)}
                  {renderEditableText('wedding_address', invitationData.wedding_address)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events */}
          {invitationData.events && invitationData.events.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-wedding-maroon mb-4 text-center">
                Wedding Events
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {invitationData.events.map((event, index) => (
                  <Card key={index} className="bg-white/70 border-wedding-gold/20">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-lg">
                        {renderEditableText(`event_${index}_name`, event.name || event.event_name || '')}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {renderEditableText(`event_${index}_date`, 
                            event.date ? (typeof event.date === 'string' ? event.date : formatDate(event.date)) : 
                            (event.event_date || ''))}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{renderEditableText(`event_${index}_time`, event.time || event.event_time || '')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{renderEditableText(`event_${index}_venue`, event.venue || event.event_venue || '')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Family Members */}
          {(invitationData.bride_family?.length > 0 || invitationData.groom_family?.length > 0) && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-wedding-maroon mb-4 text-center">
                Our Families
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invitationData.bride_family?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-2 text-center">{invitationData.bride_name}'s Family</h4>
                    <div className="space-y-2">
                      {invitationData.bride_family.map((member, index) => (
                        <div key={index} className="flex items-center p-2 bg-white/70 rounded-lg">
                          <Users className="h-4 w-4 mr-2 text-wedding-maroon" />
                          <div>
                            {renderEditableText(`bride_family_${index}_name`, member.name || '')}
                            {renderEditableText(`bride_family_${index}_relation`, member.relation || '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {invitationData.groom_family?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-lg mb-2 text-center">{invitationData.groom_name}'s Family</h4>
                    <div className="space-y-2">
                      {invitationData.groom_family.map((member, index) => (
                        <div key={index} className="flex items-center p-2 bg-white/70 rounded-lg">
                          <Users className="h-4 w-4 mr-2 text-wedding-maroon" />
                          <div>
                            {renderEditableText(`groom_family_${index}_name`, member.name || '')}
                            {renderEditableText(`groom_family_${index}_relation`, member.relation || '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery */}
          {invitationData.gallery_images && invitationData.gallery_images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-wedding-maroon mb-4 text-center">
                Our Memories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {invitationData.gallery_images.map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-lg overflow-hidden border border-wedding-gold/20 relative group"
                    onClick={() => editable && handleImageUpload(`gallery_image_${index}`)}
                  >
                    <img 
                      src={image.image} 
                      alt={image.name || `Memory ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {editable && (
                      <div 
                        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <Edit size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {editable && (
                  <div 
                    className="aspect-square rounded-lg border-2 border-dashed border-wedding-gold/20 flex items-center justify-center cursor-pointer hover:bg-wedding-gold/5"
                    onClick={() => handleImageUpload('add_gallery_image')}
                  >
                    <div className="text-center">
                      <Edit size={24} className="mx-auto text-wedding-gold/50 mb-2" />
                      <p className="text-sm text-wedding-gold/50">Add Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Message */}
          {invitationData.custom_message && (
            <div className="text-center mt-8 mb-4">
              <div className="flex justify-center mb-2">
                <Heart className="text-wedding-maroon h-6 w-6" />
              </div>
              {renderEditableContent('custom_message', invitationData.custom_message)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <Confetti isActive={confetti} />
      <FloatingPetals />
      
      {/* Page switcher for preview */}
      {editable && (
        <div className="flex items-center justify-center mb-4 gap-2">
          <Button
            variant="outline"
            className={`${activePage === 'welcome' ? 'bg-wedding-gold/10' : ''}`}
            onClick={() => setActivePage('welcome')}
          >
            Welcome Page
          </Button>
          <Button
            variant="outline"
            className={`${activePage === 'invitation' ? 'bg-wedding-gold/10' : ''}`}
            onClick={() => setActivePage('invitation')}
          >
            Invitation Details
          </Button>
        </div>
      )}
      
      {activePage === 'welcome' ? renderWelcomePage() : renderInvitationPage()}
      
      {/* Navigation arrows */}
      {editable && (
        <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 px-4">
          {activePage === 'invitation' && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-wedding-gold/10"
              onClick={() => setActivePage('welcome')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="flex-1"></div>
          {activePage === 'welcome' && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-wedding-gold/10"
              onClick={() => setActivePage('invitation')}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default InvitationPreview;
