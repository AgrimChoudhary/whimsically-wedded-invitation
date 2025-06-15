
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

  // Submit a new wish
  const submitWish = async (content: string, guestId: string, guestName: string) => {
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
      console.log('Submitting wish:', { content, guestId, guestName });
      
      const { data, error } = await supabase
        .from('wishes')
        .insert({
          guest_id: guestId,
          guest_name: guestName,
          content: content.trim(),
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
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('wish_likes')
          .delete()
          .eq('wish_id', wishId)
          .eq('guest_id', guestId);

        if (error) throw error;
        console.log('Like removed');
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

        toast({
          title: "❤️ Liked!",
          description: "You liked this wish",
          duration: 2000,
        });
      }

      // Refresh wishes to get updated counts
      fetchWishes();
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
