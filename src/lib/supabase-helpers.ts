
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
    
    // Create the bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.getBucket('wedding_images');
    if (bucketError && bucketError.message.includes('does not exist')) {
      await supabase.storage.createBucket('wedding_images', {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE
      });
    }
    
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

export const createWeddingInvitation = async (invitationData: any) => {
  try {
    // Convert arrays to JSON strings if needed
    const formattedData = {
      ...invitationData,
      bride_family: Array.isArray(invitationData.bride_family) 
        ? JSON.stringify(invitationData.bride_family) 
        : invitationData.bride_family,
      groom_family: Array.isArray(invitationData.groom_family) 
        ? JSON.stringify(invitationData.groom_family) 
        : invitationData.groom_family,
      gallery_images: Array.isArray(invitationData.gallery_images) 
        ? JSON.stringify(invitationData.gallery_images) 
        : invitationData.gallery_images,
      // Add welcome_page_enabled flag to ensure both pages are preserved
      welcome_page_enabled: true
    };

    // Ensure dates are properly formatted as strings
    if (formattedData.wedding_date && formattedData.wedding_date instanceof Date) {
      formattedData.wedding_date = formattedData.wedding_date.toISOString().split('T')[0];
    }

    // Remove events from the data to be inserted into the main table
    const { events, ...dataWithoutEvents } = formattedData;

    const { data, error } = await supabase
      .from('wedding_invitations')
      .insert(dataWithoutEvents)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // If events are provided, insert them
    if (events && Array.isArray(events) && events.length > 0) {
      const eventsWithInvitationId = events.map((event: any) => {
        // Ensure dates are properly formatted as strings
        let eventDate = event.date;
        if (eventDate && eventDate instanceof Date) {
          eventDate = eventDate.toISOString().split('T')[0];
        }

        return {
          invitation_id: data.id,
          event_name: event.name,
          event_date: eventDate,
          event_time: event.time,
          event_venue: event.venue,
          event_address: event.address
        };
      });

      const { error: eventsError } = await supabase
        .from('wedding_events')
        .insert(eventsWithInvitationId);

      if (eventsError) {
        console.error('Error inserting events:', eventsError);
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
      .from('wedding_invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching invitation:', error);
      throw error;
    }

    // Fetch events associated with this invitation
    const { data: events, error: eventsError } = await supabase
      .from('wedding_events')
      .select('*')
      .eq('invitation_id', id)
      .order('event_date', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
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

  // Format dates - ensure all dates are strings for consistency
  if (data.wedding_date) {
    if (data.wedding_date instanceof Date) {
      data.wedding_date = data.wedding_date.toISOString().split('T')[0];
    }
  }

  return data;
};

export const generateUniqueInvitationLink = (id: string) => {
  // Generate a link that includes the invitation ID
  const baseUrl = window.location.origin;
  return `${baseUrl}/invitation/${id}`;
};

// New helper function to get default invitation data with consistent types
export const getDefaultInvitationTemplate = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Get dates as strings
  const todayDate = new Date();
  const twoDaysBeforeDate = new Date(todayDate);
  twoDaysBeforeDate.setDate(todayDate.getDate() - 2);
  const oneDayBeforeDate = new Date(todayDate);
  oneDayBeforeDate.setDate(todayDate.getDate() - 1);
  
  const todayStr2 = todayDate.toISOString().split('T')[0];
  const twoDaysBeforeStr = twoDaysBeforeDate.toISOString().split('T')[0];
  const oneDayBeforeStr = oneDayBeforeDate.toISOString().split('T')[0];
  
  return {
    bride_name: "Ananya",
    groom_name: "Arjun",
    couple_image_url: "",
    wedding_date: todayStr2,
    wedding_time: "11:00 AM",
    wedding_venue: "Royal Garden Palace",
    wedding_address: "123 Wedding Lane, Wedding City",
    bride_family: [
      { 
        id: "1", 
        name: "Rajesh & Priya Sharma", 
        relation: "Parents of the Bride",
        description: "Rajesh is a successful businessman who loves cricket and traveling. Priya is a dedicated homemaker with a passion for classical music and cooking traditional dishes."
      },
      { 
        id: "2", 
        name: "Ishaan Sharma", 
        relation: "Brother of the Bride",
        description: "Ishaan is a software engineer working in Bangalore. He enjoys gaming and photography in his free time."
      },
      { 
        id: "3", 
        name: "Meera Sharma", 
        relation: "Sister of the Bride",
        description: "Meera is pursuing her Masters in Psychology. She is an avid reader and loves to paint."
      }
    ],
    groom_family: [
      { 
        id: "4", 
        name: "Vikram & Nisha Patel", 
        relation: "Parents of the Groom",
        description: "Vikram is a retired professor who now mentors students. Nisha is a doctor specializing in pediatrics and loves gardening."
      },
      { 
        id: "5", 
        name: "Aditya Patel", 
        relation: "Brother of the Groom",
        description: "Aditya is an entrepreneur who runs a successful startup. He's passionate about fitness and hiking."
      },
      { 
        id: "6", 
        name: "Riya Patel", 
        relation: "Sister of the Groom",
        description: "Riya is an architect with a love for sustainable design. She enjoys playing the violin and experimenting with fusion cooking."
      }
    ],
    events: [
      {
        id: "1",
        name: "Mehndi Ceremony",
        date: twoDaysBeforeStr, // Using string format for consistency
        time: "3:00 PM",
        venue: "Family Residence",
        address: "123 Wedding Lane, Wedding City"
      },
      {
        id: "2",
        name: "Sangeet Ceremony",
        date: oneDayBeforeStr, // Using string format for consistency
        time: "7:00 PM",
        venue: "Golden Ballroom",
        address: "456 Celebration Blvd, Wedding City"
      },
      {
        id: "3",
        name: "Wedding Ceremony",
        date: todayStr2, // Using string format for consistency
        time: "11:00 AM",
        venue: "Royal Garden Palace",
        address: "789 Royal Avenue, Wedding City"
      },
      {
        id: "4",
        name: "Reception",
        date: todayStr2, // Using string format for consistency
        time: "7:00 PM",
        venue: "Grand Luxury Hotel",
        address: "101 Luxury Drive, Wedding City"
      }
    ],
    gallery_images: [],
    custom_message: "We would be honored by your presence on our special day.",
    welcome_page_enabled: true // Ensure both welcome page and invitation are shown
  };
};
