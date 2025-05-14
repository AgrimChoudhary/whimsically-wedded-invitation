
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Added for potential multi-line fields
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  GROOM_FIRST_NAME as DEFAULT_GROOM_FIRST_NAME,
  GROOM_LAST_NAME as DEFAULT_GROOM_LAST_NAME,
  BRIDE_FIRST_NAME as DEFAULT_BRIDE_FIRST_NAME,
  BRIDE_LAST_NAME as DEFAULT_BRIDE_LAST_NAME,
  WEDDING_DATE as DEFAULT_WEDDING_DATE,
  WEDDING_TIME as DEFAULT_WEDDING_TIME,
  VENUE_NAME as DEFAULT_VENUE_NAME,
  VENUE_ADDRESS as DEFAULT_VENUE_ADDRESS,
  VENUE_MAP_LINK as DEFAULT_VENUE_MAP_LINK,
  // COUPLE_PHOTO_URL is not in weddingConfig, handle separately
} from '@/config/weddingConfig';

const invitationSchema = z.object({
  bride_first_name: z.string().min(1, 'Bride first name is required'),
  bride_last_name: z.string().min(1, 'Bride last name is required'),
  groom_first_name: z.string().min(1, 'Groom first name is required'),
  groom_last_name: z.string().min(1, 'Groom last name is required'),
  wedding_date: z.string().min(1, 'Wedding date is required'), // Consider date picker if enhancing
  wedding_time: z.string().min(1, 'Wedding time is required'),
  couple_photo_url: z.string().url('Must be a valid URL').nullable().optional(),
  venue_name: z.string().min(1, 'Venue name is required'),
  venue_address: z.string().min(1, 'Venue address is required'),
  venue_map_link: z.string().url('Must be a valid URL').nullable().optional(),
  phone_number: z.string().min(1, 'Contact phone is required').nullable().optional(),
  email: z.string().email('Invalid email address').nullable().optional(),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

interface EditInvitationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void; // Callback to refresh data if needed
}

// Default values from weddingConfig.ts, ensure they match schema types
const DEFAULT_VALUES: InvitationFormData = {
  groom_first_name: DEFAULT_GROOM_FIRST_NAME,
  groom_last_name: DEFAULT_GROOM_LAST_NAME,
  bride_first_name: DEFAULT_BRIDE_FIRST_NAME,
  bride_last_name: DEFAULT_BRIDE_LAST_NAME,
  wedding_date: DEFAULT_WEDDING_DATE.replace(/,/g, ''), // Format to match input type
  wedding_time: DEFAULT_WEDDING_TIME,
  couple_photo_url: null, // Default to null or a placeholder URL string
  venue_name: DEFAULT_VENUE_NAME,
  venue_address: DEFAULT_VENUE_ADDRESS,
  venue_map_link: DEFAULT_VENUE_MAP_LINK,
  phone_number: '', // Default contact phone from config if available, else empty
  email: '', // Default contact email from config if available, else empty
};


export const EditInvitationDetailsDialog: React.FC<EditInvitationDetailsDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      fetchInvitationDetails();
    }
  }, [open]);

  const fetchInvitationDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        throw error;
      }

      if (data) {
        form.reset(data as InvitationFormData); // Type assertion
        setInvitationId(data.id);
      } else {
        form.reset(DEFAULT_VALUES);
        setInvitationId(null);
      }
    } catch (error) {
      console.error('Error fetching invitation details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invitation details. Using defaults.',
        variant: 'destructive',
      });
      form.reset(DEFAULT_VALUES);
      setInvitationId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: InvitationFormData) => {
    setIsLoading(true);
    try {
      let idToUse = invitationId;
      if (!idToUse) {
        // If no existing ID, means we are inserting a new record.
        // The `id` field in the `invitations` table is `uuid` and defaults to `gen_random_uuid()`.
        // So, we don't strictly need to generate it on the client if the table handles it.
        // However, if we want to be explicit or use it immediately:
        // idToUse = uuidv4(); 
        // For upsert, we can omit id if it's a new record and the PK is auto-generated,
        // or include it if we handle it client-side.
        // Let's assume the table's default `gen_random_uuid()` will handle it for new inserts if `id` is not provided
        // or if upsert is used correctly.
      }

      const payload = { ...values, id: invitationId || undefined };
      
      // Using upsert. If invitationId is null/undefined, it should insert.
      // If invitationId exists, it should update.
      // The `id` column must be the primary key or have a unique constraint for `onConflict` to work implicitly on `id`.
      const { error } = await supabase.from('invitations').upsert(payload, {
         onConflict: 'id', // Assumes 'id' is the primary key
      });


      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Invitation details saved successfully.',
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving invitation details:', error);
      toast({
        title: 'Error',
        description: `Failed to save invitation details: ${(error as Error).message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-wedding-maroon">Edit Invitation Details</DialogTitle>
          <DialogDescription>
            Update the core details for your wedding invitation template.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {isLoading && <p>Loading details...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groom_first_name">Groom's First Name</Label>
              <Input id="groom_first_name" {...form.register('groom_first_name')} />
              {form.formState.errors.groom_first_name && <p className="text-red-500 text-sm">{form.formState.errors.groom_first_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="groom_last_name">Groom's Last Name</Label>
              <Input id="groom_last_name" {...form.register('groom_last_name')} />
              {form.formState.errors.groom_last_name && <p className="text-red-500 text-sm">{form.formState.errors.groom_last_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="bride_first_name">Bride's First Name</Label>
              <Input id="bride_first_name" {...form.register('bride_first_name')} />
              {form.formState.errors.bride_first_name && <p className="text-red-500 text-sm">{form.formState.errors.bride_first_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="bride_last_name">Bride's Last Name</Label>
              <Input id="bride_last_name" {...form.register('bride_last_name')} />
              {form.formState.errors.bride_last_name && <p className="text-red-500 text-sm">{form.formState.errors.bride_last_name.message}</p>}
            </div>
          </div>
          
          <div>
            <Label htmlFor="couple_photo_url">Couple Photo URL</Label>
            <Input id="couple_photo_url" {...form.register('couple_photo_url')} placeholder="https://example.com/couple.jpg" />
            {form.formState.errors.couple_photo_url && <p className="text-red-500 text-sm">{form.formState.errors.couple_photo_url.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wedding_date">Wedding Date</Label>
              <Input id="wedding_date" type="date" {...form.register('wedding_date')} />
              {form.formState.errors.wedding_date && <p className="text-red-500 text-sm">{form.formState.errors.wedding_date.message}</p>}
            </div>
            <div>
              <Label htmlFor="wedding_time">Wedding Time</Label>
              <Input id="wedding_time" type="time" {...form.register('wedding_time')} />
              {form.formState.errors.wedding_time && <p className="text-red-500 text-sm">{form.formState.errors.wedding_time.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="venue_name">Venue Name</Label>
            <Input id="venue_name" {...form.register('venue_name')} />
            {form.formState.errors.venue_name && <p className="text-red-500 text-sm">{form.formState.errors.venue_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="venue_address">Venue Address</Label>
            <Textarea id="venue_address" {...form.register('venue_address')} />
            {form.formState.errors.venue_address && <p className="text-red-500 text-sm">{form.formState.errors.venue_address.message}</p>}
          </div>
          <div>
            <Label htmlFor="venue_map_link">Venue Map Link (URL)</Label>
            <Input id="venue_map_link" {...form.register('venue_map_link')} placeholder="https://maps.google.com/..." />
            {form.formState.errors.venue_map_link && <p className="text-red-500 text-sm">{form.formState.errors.venue_map_link.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Contact Phone</Label>
              <Input id="phone_number" {...form.register('phone_number')} />
              {form.formState.errors.phone_number && <p className="text-red-500 text-sm">{form.formState.errors.phone_number.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-wedding-gold hover:bg-wedding-deep-gold text-white" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

