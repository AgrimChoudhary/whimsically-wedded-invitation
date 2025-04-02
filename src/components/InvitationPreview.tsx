
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, Heart } from 'lucide-react';

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
}

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ invitationData }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="scale-[0.9] origin-top">
      <div className="max-w-3xl mx-auto bg-wedding-cream p-8 rounded-lg shadow-lg border-2 border-wedding-gold/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-great-vibes text-4xl text-wedding-maroon mb-2">
            {invitationData.bride_name} & {invitationData.groom_name}
          </h2>
          <p className="text-lg text-gray-700">We're getting married!</p>
        </div>

        {/* Couple Image */}
        {invitationData.couple_image_url && (
          <div className="mb-8 flex justify-center">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-wedding-gold/20">
              <img 
                src={invitationData.couple_image_url} 
                alt="Couple" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Date & Venue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/70 border-wedding-gold/20">
            <CardContent className="p-6 flex items-center">
              <div className="mr-4 bg-wedding-maroon/10 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-wedding-maroon" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Wedding Date</h3>
                <p className="text-gray-700">{formatDate(invitationData.wedding_date)}</p>
                <p className="text-gray-700">{invitationData.wedding_time}</p>
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
                <p className="text-gray-700">{invitationData.wedding_venue}</p>
                <p className="text-gray-700 text-sm">{invitationData.wedding_address}</p>
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
                    <h4 className="font-medium text-lg">{event.name || event.event_name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{event.relation || event.event_date}</span>
                      <span className="mx-2">•</span>
                      <span>{event.description || event.event_time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.image || event.event_venue}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Family Members */}
        {(invitationData.bride_family.length > 0 || invitationData.groom_family.length > 0) && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-wedding-maroon mb-4 text-center">
              Our Families
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invitationData.bride_family.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2 text-center">{invitationData.bride_name}'s Family</h4>
                  <div className="space-y-2">
                    {invitationData.bride_family.map((member, index) => (
                      <div key={index} className="flex items-center p-2 bg-white/70 rounded-lg">
                        <Users className="h-4 w-4 mr-2 text-wedding-maroon" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.relation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {invitationData.groom_family.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2 text-center">{invitationData.groom_name}'s Family</h4>
                  <div className="space-y-2">
                    {invitationData.groom_family.map((member, index) => (
                      <div key={index} className="flex items-center p-2 bg-white/70 rounded-lg">
                        <Users className="h-4 w-4 mr-2 text-wedding-maroon" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.relation}</p>
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
                <div key={index} className="aspect-square rounded-lg overflow-hidden border border-wedding-gold/20">
                  <img 
                    src={image.image} 
                    alt={image.name || `Memory ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Message */}
        {invitationData.custom_message && (
          <div className="text-center mt-8 mb-4">
            <div className="flex justify-center mb-2">
              <Heart className="text-wedding-maroon h-6 w-6" />
            </div>
            <p className="italic text-gray-700">{invitationData.custom_message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationPreview;
