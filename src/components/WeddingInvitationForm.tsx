
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const weddingFormSchema = z.object({
  // Couple Information
  bride_first_name: z.string().min(1, "Bride's first name is required"),
  bride_last_name: z.string().min(1, "Bride's last name is required"),
  groom_first_name: z.string().min(1, "Groom's first name is required"),
  groom_last_name: z.string().min(1, "Groom's last name is required"),
  bride_about: z.string().optional(),
  groom_about: z.string().optional(),
  love_story: z.string().optional(),
  
  // Wedding Details
  wedding_date: z.string().min(1, "Wedding date is required"),
  wedding_time: z.string().min(1, "Wedding time is required"),
  venue_name: z.string().min(1, "Venue name is required"),
  venue_address: z.string().min(1, "Venue address is required"),
  venue_map_url: z.string().url().optional(),
  
  // Bride's Family
  bride_family_name: z.string().min(1, "Bride's family name is required"),
  bride_father_name: z.string().min(1, "Bride's father's name is required"),
  bride_mother_name: z.string().min(1, "Bride's mother's name is required"),
  bride_family_description: z.string().optional(),
  
  // Groom's Family
  groom_family_name: z.string().min(1, "Groom's family name is required"),
  groom_father_name: z.string().min(1, "Groom's father's name is required"),
  groom_mother_name: z.string().min(1, "Groom's mother's name is required"),
  groom_family_description: z.string().optional(),
  
  // Contact Information
  contact_phone: z.string().min(1, "Contact phone is required"),
  contact_email: z.string().email("Invalid email address"),
});

const WeddingInvitationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(weddingFormSchema),
  });
  
  const [events, setEvents] = useState([{ name: '', date: '', time: '', venue: '', address: '', mapLink: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, you'd submit the data to your backend here
      console.log('Form data:', data);
      console.log('Events:', events);
      alert('Form submitted successfully! In a real application, the invitation would be created now.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addEvent = () => {
    setEvents([...events, { name: '', date: '', time: '', venue: '', address: '', mapLink: '' }]);
  };
  
  const removeEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };
  
  const updateEvent = (index: number, field: string, value: string) => {
    const updatedEvents = [...events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEvents(updatedEvents);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
      {/* Couple Information */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Couple Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="bride_first_name">Bride's First Name</Label>
              <Input
                id="bride_first_name"
                placeholder="Enter the bride's first name"
                {...register('bride_first_name')}
              />
              {errors.bride_first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bride_first_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bride_last_name">Bride's Last Name</Label>
              <Input
                id="bride_last_name"
                placeholder="Enter the bride's last name"
                {...register('bride_last_name')}
              />
              {errors.bride_last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bride_last_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bride_about">About the Bride</Label>
              <Textarea
                id="bride_about"
                placeholder="Short bio of the bride: education, job, hobbies"
                className="min-h-[100px]"
                {...register('bride_about')}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="groom_first_name">Groom's First Name</Label>
              <Input
                id="groom_first_name"
                placeholder="Enter the groom's first name"
                {...register('groom_first_name')}
              />
              {errors.groom_first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.groom_first_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="groom_last_name">Groom's Last Name</Label>
              <Input
                id="groom_last_name"
                placeholder="Enter the groom's last name"
                {...register('groom_last_name')}
              />
              {errors.groom_last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.groom_last_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="groom_about">About the Groom</Label>
              <Textarea
                id="groom_about"
                placeholder="Short bio of the groom: education, job, hobbies"
                className="min-h-[100px]"
                {...register('groom_about')}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="love_story">Love Story</Label>
          <Textarea
            id="love_story"
            placeholder="How the couple met and their journey (optional)"
            className="min-h-[150px]"
            {...register('love_story')}
          />
        </div>
        
        <div className="mt-4">
          <Label htmlFor="couple_photo">Couple Photo</Label>
          <Input
            id="couple_photo"
            type="file"
            accept="image/jpeg,image/png"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Upload a photo of the couple (max 5MB, JPG/PNG)</p>
        </div>
      </div>
      
      <Separator />
      
      {/* Wedding Details */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Wedding Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="wedding_date">Wedding Date</Label>
            <Input
              id="wedding_date"
              placeholder="DD Month YYYY, like '15 June 2025'"
              {...register('wedding_date')}
            />
            {errors.wedding_date && (
              <p className="text-red-500 text-sm mt-1">{errors.wedding_date.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="wedding_time">Wedding Time</Label>
            <Input
              id="wedding_time"
              placeholder="Enter time, like '2:00 PM'"
              {...register('wedding_time')}
            />
            {errors.wedding_time && (
              <p className="text-red-500 text-sm mt-1">{errors.wedding_time.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="venue_name">Wedding Venue Name</Label>
          <Input
            id="venue_name"
            placeholder="Enter venue name, like 'Rosewood Hall'"
            {...register('venue_name')}
          />
          {errors.venue_name && (
            <p className="text-red-500 text-sm mt-1">{errors.venue_name.message as string}</p>
          )}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="venue_address">Venue Address</Label>
          <Textarea
            id="venue_address"
            placeholder="Enter full address, like '456 Oak Street, Austin, TX'"
            {...register('venue_address')}
          />
          {errors.venue_address && (
            <p className="text-red-500 text-sm mt-1">{errors.venue_address.message as string}</p>
          )}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="venue_map_url">Google Maps URL</Label>
          <Input
            id="venue_map_url"
            placeholder="Paste map link, like 'https://maps.google.com/...'"
            {...register('venue_map_url')}
          />
          {errors.venue_map_url && (
            <p className="text-red-500 text-sm mt-1">{errors.venue_map_url.message as string}</p>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Family Details - Bride */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Bride's Family Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bride_family_name">Family Name</Label>
            <Input
              id="bride_family_name"
              placeholder="Enter family name, like 'Miller Family'"
              {...register('bride_family_name')}
            />
            {errors.bride_family_name && (
              <p className="text-red-500 text-sm mt-1">{errors.bride_family_name.message as string}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bride_father_name">Father's Name</Label>
              <Input
                id="bride_father_name"
                placeholder="Enter father's name, like 'Ramesh'"
                {...register('bride_father_name')}
              />
              {errors.bride_father_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bride_father_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bride_mother_name">Mother's Name</Label>
              <Input
                id="bride_mother_name"
                placeholder="Enter mother's name, like 'Rameshi'"
                {...register('bride_mother_name')}
              />
              {errors.bride_mother_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bride_mother_name.message as string}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="bride_family_description">Family Description</Label>
            <Textarea
              id="bride_family_description"
              placeholder="About the family, like 'John is a teacher...'"
              {...register('bride_family_description')}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Family Details - Groom */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Groom's Family Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="groom_family_name">Family Name</Label>
            <Input
              id="groom_family_name"
              placeholder="Enter family name, like 'Carter Family'"
              {...register('groom_family_name')}
            />
            {errors.groom_family_name && (
              <p className="text-red-500 text-sm mt-1">{errors.groom_family_name.message as string}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groom_father_name">Father's Name</Label>
              <Input
                id="groom_father_name"
                placeholder="Enter father's name, like 'Harkesh'"
                {...register('groom_father_name')}
              />
              {errors.groom_father_name && (
                <p className="text-red-500 text-sm mt-1">{errors.groom_father_name.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="groom_mother_name">Mother's Name</Label>
              <Input
                id="groom_mother_name"
                placeholder="Enter mother's name, like 'Harkeshi'"
                {...register('groom_mother_name')}
              />
              {errors.groom_mother_name && (
                <p className="text-red-500 text-sm mt-1">{errors.groom_mother_name.message as string}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="groom_family_description">Family Description</Label>
            <Textarea
              id="groom_family_description"
              placeholder="About the family, like 'David is a chef...'"
              {...register('groom_family_description')}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Wedding Events - Dynamic */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Wedding Events</h2>
        
        {events.map((event, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Event {index + 1}</h3>
              {events.length > 1 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeEvent(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Event Name</Label>
                <Input
                  placeholder="Enter event, like 'Reception'"
                  value={event.name}
                  onChange={(e) => updateEvent(index, 'name', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Date</Label>
                <Input
                  placeholder="Enter date, like '16 June 2025'"
                  value={event.date}
                  onChange={(e) => updateEvent(index, 'date', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Time</Label>
                <Input
                  placeholder="Enter time range, like '6:00 PM - 10:00 PM'"
                  value={event.time}
                  onChange={(e) => updateEvent(index, 'time', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Venue Name</Label>
                <Input
                  placeholder="Enter venue, like 'Crystal Pavilion'"
                  value={event.venue}
                  onChange={(e) => updateEvent(index, 'venue', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Venue Address</Label>
                <Textarea
                  placeholder="Enter address, like '789 Pine Road, Austin, TX'"
                  value={event.address}
                  onChange={(e) => updateEvent(index, 'address', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Venue Map Link</Label>
                <Input
                  placeholder="Paste map link, optional"
                  value={event.mapLink}
                  onChange={(e) => updateEvent(index, 'mapLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addEvent}
          className="w-full mt-2"
        >
          Add Another Event
        </Button>
      </div>
      
      <Separator />
      
      {/* Contact Information */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              placeholder="Enter phone, like '+1-512-555-1234'"
              {...register('contact_phone')}
            />
            {errors.contact_phone && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              placeholder="Enter email, like 'sophie.james@wedding.com'"
              {...register('contact_email')}
            />
            {errors.contact_email && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_email.message as string}</p>
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Photo Memories */}
      <div>
        <h2 className="text-2xl font-semibold text-wedding-maroon mb-4">Photo Memories</h2>
        <p className="text-sm text-gray-500 mb-4">Upload up to 6 photos to share your memories. (Not implemented in this demo)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border border-dashed border-gray-300 rounded-md p-4">
              <Label htmlFor={`photo_${index}`}>Photo {index + 1}</Label>
              <Input
                id={`photo_${index}`}
                type="file"
                accept="image/jpeg,image/png"
                className="mt-2"
              />
              <Input
                placeholder="Photo title (optional)"
                className="mt-2"
              />
              <Textarea
                placeholder="Photo description (optional)"
                className="mt-2"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button type="submit" className="bg-wedding-maroon hover:bg-wedding-maroon/90 text-white px-10 py-2" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Invitation...' : 'Create Wedding Invitation'}
        </Button>
      </div>
    </form>
  );
};

export default WeddingInvitationForm;
