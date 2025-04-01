
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
    console.error('Error uploading image to Supabase:', error);
    return null;
  }
};

export const createWeddingInvitation = async (invitationData: any) => {
  try {
    // Format the data for the invitations table
    const invitationFormData = {
      bride_first_name: invitationData.bride_name,
      bride_last_name: '',
      groom_first_name: invitationData.groom_name,
      groom_last_name: '',
      wedding_date: invitationData.wedding_date,
      wedding_time: invitationData.wedding_time,
      venue_name: invitationData.wedding_venue,
      venue_address: invitationData.wedding_address || '',
      venue_map_link: invitationData.map_url || '',
      phone_number: invitationData.contact_phone || '',
      email: invitationData.contact_email || '',
      couple_photo_url: invitationData.couple_image_url || '',
    };

    // Insert to invitations table
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitationFormData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const invitationId = data.id;

    // Process family members if provided
    if (invitationData.bride_family && Array.isArray(invitationData.bride_family) && invitationData.bride_family.length > 0) {
      const brideFamilyMembers = invitationData.bride_family.map((member: any) => ({
        invitation_id: invitationId,
        name: member.name,
        relation: member.relation,
        description: member.description || '',
        image_url: member.image_url || '',
        family_type: 'bride',
        is_parent: false
      }));

      const { error: brideFamilyError } = await supabase
        .from('family_members')
        .insert(brideFamilyMembers);

      if (brideFamilyError) {
        console.error('Error inserting bride family members:', brideFamilyError);
      }
    }

    if (invitationData.groom_family && Array.isArray(invitationData.groom_family) && invitationData.groom_family.length > 0) {
      const groomFamilyMembers = invitationData.groom_family.map((member: any) => ({
        invitation_id: invitationId,
        name: member.name,
        relation: member.relation,
        description: member.description || '',
        image_url: member.image_url || '',
        family_type: 'groom',
        is_parent: false
      }));

      const { error: groomFamilyError } = await supabase
        .from('family_members')
        .insert(groomFamilyMembers);

      if (groomFamilyError) {
        console.error('Error inserting groom family members:', groomFamilyError);
      }
    }

    // Process events if provided
    if (invitationData.events && Array.isArray(invitationData.events) && invitationData.events.length > 0) {
      const formattedEvents = invitationData.events.map((event: any) => ({
        invitation_id: invitationId,
        name: event.event_name || event.name,
        date: event.event_date || event.relation,
        time: event.event_time || event.description,
        venue_name: event.event_venue || event.image,
        venue_address: event.event_address || '',
        venue_map_link: ''
      }));

      const { error: eventsError } = await supabase
        .from('events')
        .insert(formattedEvents);

      if (eventsError) {
        console.error('Error inserting events:', eventsError);
      }
    }

    // Process gallery images if provided
    if (invitationData.gallery_images && Array.isArray(invitationData.gallery_images) && invitationData.gallery_images.length > 0) {
      const galleryPhotos = invitationData.gallery_images
        .filter((item: any) => item.image || item.photo_url)
        .map((item: any) => ({
          invitation_id: invitationId,
          photo_url: item.image || item.photo_url
        }));

      if (galleryPhotos.length > 0) {
        const { error: galleryError } = await supabase
          .from('gallery_photos')
          .insert(galleryPhotos);

        if (galleryError) {
          console.error('Error inserting gallery photos:', galleryError);
        }
      }
    }

    return data;
  } catch (error) {
    console.error('Error creating wedding invitation:', error);
    throw error;
  }
};

export const fetchInvitationById = async (id: string) => {
  try {
    // Fetch invitation details
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Fetch events associated with this invitation
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('invitation_id', id)
      .order('date', { ascending: true });

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
  if (!data) return null;
  
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

  return data;
};

export const generateUniqueInvitationLink = (id: string) => {
  // Generate a link that includes the invitation ID
  const baseUrl = window.location.origin;
  return `${baseUrl}/invitation/${id}`;
};
