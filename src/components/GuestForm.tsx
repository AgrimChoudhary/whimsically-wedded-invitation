
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import { useAuth } from '@/context/AuthContext';

interface GuestFormProps {
  onSuccess: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    countryCode: '+91'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      countryCode: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add guests",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = formatPhoneNumber(formData.mobile, formData.countryCode);
      
      if (!validatePhoneNumber(fullPhoneNumber)) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }

      // Generate a unique guest ID
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { error } = await supabase
        .from('guests')
        .insert({
          id: guestId,
          name: formData.name.trim(),
          mobile: fullPhoneNumber,
          user_id: user.id,
          status: null
        });

      if (error) {
        throw error;
      }

      // Reset form
      setFormData({
        name: '',
        mobile: '',
        countryCode: '+91'
      });

      toast({
        title: "Guest added successfully!",
        description: `${formData.name} has been added to your guest list`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add guest",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+971', country: 'UAE' },
    { code: '+65', country: 'Singapore' },
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-playfair text-xl text-wedding-maroon flex items-center justify-center gap-2">
          <UserPlus size={20} className="text-wedding-gold" />
          Add New Guest
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-wedding-maroon font-medium">
              Guest Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter guest's full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-wedding-maroon font-medium">
              Mobile Number *
            </Label>
            <div className="flex gap-2">
              <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                <SelectTrigger className="w-24 border-wedding-gold/30 focus:ring-wedding-gold/30 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                className="flex-1 border-wedding-gold/30 focus-visible:ring-wedding-gold/30 rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500">
              This number will be used to send WhatsApp invitations and identify the guest
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.name.trim() || !formData.mobile.trim()}
            className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white font-medium py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Adding Guest...' : 'Add Guest'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestForm;
