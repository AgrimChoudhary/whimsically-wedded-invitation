
import { supabase } from "@/integrations/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const uploadImageToSupabase = async (
  file: File, 
  path: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('wedding_images')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    const { data } = supabase.storage
      .from('wedding_images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    return null;
  }
};

export const fetchInvitationById = async (id: string) => {
  try {
    // Fetch invitation details
    const { data: invitation, error } = await supabase
      .from('wedding_invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Fetch events associated with this invitation
    const { data: events, error: eventsError } = await supabase
      .from('wedding_events')
      .select('*')
      .eq('invitation_id', id)
      .order('event_date', { ascending: true });

    if (eventsError) {
      throw eventsError;
    }

    return {
      invitation,
      events: events || []
    };
  } catch (error) {
    console.error('Error fetching invitation data:', error);
    throw error;
  }
};

export const formatInvitationData = (data: any) => {
  // Parse JSON strings to objects if needed
  if (data.bride_family && typeof data.bride_family === 'string') {
    try {
      data.bride_family = JSON.parse(data.bride_family);
    } catch (e) {
      data.bride_family = [];
    }
  }

  if (data.groom_family && typeof data.groom_family === 'string') {
    try {
      data.groom_family = JSON.parse(data.groom_family);
    } catch (e) {
      data.groom_family = [];
    }
  }

  // Format gallery images
  if (data.gallery_images) {
    // Ensure it's an array
    if (!Array.isArray(data.gallery_images)) {
      try {
        data.gallery_images = JSON.parse(data.gallery_images);
      } catch (e) {
        data.gallery_images = [];
      }
    }
  } else {
    data.gallery_images = [];
  }

  // Format dates
  if (data.wedding_date) {
    data.wedding_date = new Date(data.wedding_date);
  }

  return data;
};
