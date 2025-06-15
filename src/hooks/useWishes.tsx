
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

  // Fetch approved wishes
  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
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
    if (!content.trim() || content.length > 280) return false;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('wishes')
        .insert({
          guest_id: guestId,
          guest_name: guestName,
          content: content.trim(),
          is_approved: false // Requires host approval
        });

      if (error) throw error;

      toast({
        title: "Wish Submitted!",
        description: "Your wish has been submitted and is awaiting approval.",
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
      .channel('wishes-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'wishes',
          filter: 'is_approved=eq.true'
        },
        () => {
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
        () => {
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
