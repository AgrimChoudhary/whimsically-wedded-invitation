
import { supabase } from "@/integrations/supabase/client";

// Types for our invitation system
export interface InvitationData {
  id?: string;
  bride_first_name: string;
  bride_last_name: string;
  groom_first_name: string;
  groom_last_name: string;
  wedding_date: string;
  wedding_time: string;
  venue_name: string;
  venue_address: string;
  venue_map_link?: string;
  phone_number: string;
  email: string;
  couple_photo_url?: string;
}

export interface FamilyMember {
  id?: string;
  invitation_id?: string;
  name: string;
  relation: string;
  description?: string;
  image_url?: string;
  family_type: 'bride' | 'groom';
  is_parent: boolean;
}

export interface EventData {
  id?: string;
  invitation_id?: string;
  name: string;
  date: string;
  time: string;
  venue_name: string;
  venue_address: string;
  venue_map_link?: string;
}

export interface GalleryPhoto {
  id?: string;
  invitation_id?: string;
  photo_url: string;
}

export interface Guest {
  id?: string;
  invitation_id?: string;
  name: string;
  mobile: string;
}

// Function to create a new invitation
export const createInvitation = async (
  invitationData: InvitationData,
  familyMembers: FamilyMember[],
  events: EventData[],
  galleryPhotos: GalleryPhoto[]
): Promise<string | null> => {
  try {
    // Insert the invitation data
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert(invitationData)
      .select('id')
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      return null;
    }

    const invitationId = invitation.id;

    // Add the invitation_id to each family member
    const familyMembersWithId = familyMembers.map(member => ({
      ...member,
      invitation_id: invitationId
    }));

    // Insert family members
    const { error: familyError } = await supabase
      .from('family_members')
      .insert(familyMembersWithId);

    if (familyError) {
      console.error('Error adding family members:', familyError);
    }

    // Add the invitation_id to each event
    const eventsWithId = events.map(event => ({
      ...event,
      invitation_id: invitationId
    }));

    // Insert events
    const { error: eventsError } = await supabase
      .from('events')
      .insert(eventsWithId);

    if (eventsError) {
      console.error('Error adding events:', eventsError);
    }

    // Add the invitation_id to each gallery photo
    const photosWithId = galleryPhotos.map(photo => ({
      ...photo,
      invitation_id: invitationId
    }));

    // Insert gallery photos
    if (photosWithId.length > 0) {
      const { error: photosError } = await supabase
        .from('gallery_photos')
        .insert(photosWithId);

      if (photosError) {
        console.error('Error adding gallery photos:', photosError);
      }
    }

    return invitationId;
  } catch (error) {
    console.error('Error in createInvitation:', error);
    return null;
  }
};

// Function to upload an image to Supabase storage
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('wedding_photos')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('wedding_photos')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// Function to get all invitations
export const getAllInvitations = async (): Promise<InvitationData[]> => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllInvitations:', error);
    return [];
  }
};

// Function to get invitation by ID
export const getInvitationById = async (id: string): Promise<{
  invitation: InvitationData | null;
  familyMembers: FamilyMember[];
  events: EventData[];
  galleryPhotos: GalleryPhoto[];
}> => {
  try {
    // Get invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (invitationError) {
      console.error('Error fetching invitation:', invitationError);
      return { invitation: null, familyMembers: [], events: [], galleryPhotos: [] };
    }
    
    // Get family members
    const { data: familyMembers, error: familyError } = await supabase
      .from('family_members')
      .select('*')
      .eq('invitation_id', id);
    
    if (familyError) {
      console.error('Error fetching family members:', familyError);
    }
    
    // Get events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('invitation_id', id)
      .order('date', { ascending: true });
    
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }
    
    // Get gallery photos
    const { data: galleryPhotos, error: photosError } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('invitation_id', id);
    
    if (photosError) {
      console.error('Error fetching gallery photos:', photosError);
    }
    
    return {
      invitation,
      familyMembers: familyMembers || [],
      events: events || [],
      galleryPhotos: galleryPhotos || []
    };
  } catch (error) {
    console.error('Error in getInvitationById:', error);
    return { invitation: null, familyMembers: [], events: [], galleryPhotos: [] };
  }
};

// Function to add a guest
export const addGuest = async (guest: Guest): Promise<Guest | null> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .insert(guest)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding guest:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addGuest:', error);
    return null;
  }
};

// Function to get guests by invitation ID
export const getGuestsByInvitationId = async (invitationId: string): Promise<Guest[]> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching guests:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getGuestsByInvitationId:', error);
    return [];
  }
};

// Function to get guest by ID
export const getGuestById = async (id: string): Promise<Guest | null> => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching guest:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGuestById:', error);
    return null;
  }
};
