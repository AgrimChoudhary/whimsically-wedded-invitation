
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Wish {
  id: string;
  guest_id: string;
  guest_name: string;
  content: string;
  image_url?: string;
  likes_count: number;
  replies_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishLike {
  id: string;
  wish_id: string;
  guest_id: string;
  guest_name: string;
  created_at: string;
}

export const useWishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch approved wishes for public display
  const fetchWishes = async () => {
    try {
      console.log('Fetching approved wishes for public display...');
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching approved wishes:', error);
        throw error;
      }
      
      console.log('Fetched approved wishes:', data);
      setWishes(data || []);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      toast({
        title: "Error",
        description: "Failed to load wishes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload image to storage
  const uploadImage = async (file: File, guestId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${guestId}-${Date.now()}.${fileExt}`;
      const filePath = `wish-images/${fileName}`;

      console.log('Uploading image:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('wishes')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('wishes')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in image upload:', error);
      return null;
    }
  };

  // Submit a new wish with optional image
  const submitWish = async (content: string, guestId: string, guestName: string, imageFile?: File) => {
    if (!content.trim() || content.length > 280) {
      toast({
        title: "Invalid wish",
        description: "Please enter a wish between 1 and 280 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting wish:', { content, guestId, guestName, hasImage: !!imageFile });
      
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, guestId);
        if (!imageUrl) {
          toast({
            title: "Image upload failed",
            description: "Could not upload image, but wish will be submitted without it.",
            variant: "destructive",
          });
        }
      }

      const { data, error } = await supabase
        .from('wishes')
        .insert({
          guest_id: guestId,
          guest_name: guestName,
          content: content.trim(),
          image_url: imageUrl,
          is_approved: false // Requires host approval
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting wish:', error);
        throw error;
      }

      console.log('Wish submitted successfully:', data);

      toast({
        title: "✨ Wish Submitted!",
        description: "Your heartfelt wish has been submitted and is awaiting approval.",
        duration: 4000,
      });

      return true;
    } catch (error) {
      console.error('Error submitting wish:', error);
      toast({
        title: "Error",
        description: "Failed to submit wish. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle like on a wish
  const toggleLike = async (wishId: string, guestId: string, guestName: string) => {
    try {
      console.log('Toggling like for wish:', wishId, 'by guest:', guestId);
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('wish_likes')
        .select('id')
        .eq('wish_id', wishId)
        .eq('guest_id', guestId)
        .maybeSingle();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('wish_likes')
          .delete()
          .eq('wish_id', wishId)
          .eq('guest_id', guestId);

        if (error) throw error;
        console.log('Like removed');
        
        // Update local state immediately
        setWishes(wishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, likes_count: Math.max(0, wish.likes_count - 1) }
            : wish
        ));
      } else {
        // Add like
        const { error } = await supabase
          .from('wish_likes')
          .insert({
            wish_id: wishId,
            guest_id: guestId,
            guest_name: guestName
          });

        if (error) throw error;
        console.log('Like added');

        // Update local state immediately
        setWishes(wishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, likes_count: wish.likes_count + 1 }
            : wish
        ));

        toast({
          title: "❤️ Liked!",
          description: "You liked this wish",
          duration: 2000,
        });
      }

      // Also refresh wishes to get updated counts from server
      setTimeout(() => fetchWishes(), 500);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchWishes();

    const channel = supabase
      .channel('public-wishes-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'wishes',
          filter: 'is_approved=eq.true'
        },
        (payload) => {
          console.log('Real-time approved wish change:', payload);
          fetchWishes();
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'wish_likes'
        },
        (payload) => {
          console.log('Real-time like change:', payload);
          fetchWishes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    wishes,
    isLoading,
    isSubmitting,
    submitWish,
    toggleLike,
    refreshWishes: fetchWishes
  };
};
