export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string | null
          date: string
          id: string
          invitation_id: string | null
          name: string
          time: string
          venue_address: string
          venue_map_link: string | null
          venue_name: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          invitation_id?: string | null
          name: string
          time: string
          venue_address: string
          venue_map_link?: string | null
          venue_name: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          invitation_id?: string | null
          name?: string
          time?: string
          venue_address?: string
          venue_map_link?: string | null
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string | null
          description: string | null
          family_type: string
          id: string
          image_url: string | null
          invitation_id: string | null
          is_parent: boolean | null
          name: string
          relation: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          family_type: string
          id?: string
          image_url?: string | null
          invitation_id?: string | null
          is_parent?: boolean | null
          name: string
          relation: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          family_type?: string
          id?: string
          image_url?: string | null
          invitation_id?: string | null
          is_parent?: boolean | null
          name?: string
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          created_at: string | null
          id: string
          invitation_id: string | null
          photo_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          photo_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string | null
          id: string
          invitation_id: string | null
          mobile: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          invitation_id?: string | null
          mobile: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          mobile?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          bride_first_name: string
          bride_last_name: string
          couple_photo_url: string | null
          created_at: string | null
          email: string
          groom_first_name: string
          groom_last_name: string
          id: string
          phone_number: string
          updated_at: string | null
          venue_address: string
          venue_map_link: string | null
          venue_name: string
          wedding_date: string
          wedding_time: string
        }
        Insert: {
          bride_first_name: string
          bride_last_name: string
          couple_photo_url?: string | null
          created_at?: string | null
          email: string
          groom_first_name: string
          groom_last_name: string
          id?: string
          phone_number: string
          updated_at?: string | null
          venue_address: string
          venue_map_link?: string | null
          venue_name: string
          wedding_date: string
          wedding_time: string
        }
        Update: {
          bride_first_name?: string
          bride_last_name?: string
          couple_photo_url?: string | null
          created_at?: string | null
          email?: string
          groom_first_name?: string
          groom_last_name?: string
          id?: string
          phone_number?: string
          updated_at?: string | null
          venue_address?: string
          venue_map_link?: string | null
          venue_name?: string
          wedding_date?: string
          wedding_time?: string
        }
        Relationships: []
      }
      wedding_events: {
        Row: {
          created_at: string | null
          event_address: string | null
          event_date: string | null
          event_name: string
          event_time: string | null
          event_venue: string | null
          id: string
          invitation_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_address?: string | null
          event_date?: string | null
          event_name: string
          event_time?: string | null
          event_venue?: string | null
          id?: string
          invitation_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_address?: string | null
          event_date?: string | null
          event_name?: string
          event_time?: string | null
          event_venue?: string | null
          id?: string
          invitation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wedding_events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "wedding_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_invitations: {
        Row: {
          bride_about: string | null
          bride_family: string | null
          bride_name: string
          bride_parents: string | null
          contact_email: string | null
          contact_phone: string | null
          couple_image_url: string | null
          couple_story: string | null
          created_at: string | null
          custom_message: string | null
          gallery_images: Json | null
          groom_about: string | null
          groom_family: string | null
          groom_name: string
          groom_parents: string | null
          id: string
          map_url: string | null
          rsvp_email: string | null
          rsvp_phone: string | null
          wedding_address: string | null
          wedding_date: string
          wedding_time: string | null
          wedding_venue: string | null
        }
        Insert: {
          bride_about?: string | null
          bride_family?: string | null
          bride_name: string
          bride_parents?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_image_url?: string | null
          couple_story?: string | null
          created_at?: string | null
          custom_message?: string | null
          gallery_images?: Json | null
          groom_about?: string | null
          groom_family?: string | null
          groom_name: string
          groom_parents?: string | null
          id?: string
          map_url?: string | null
          rsvp_email?: string | null
          rsvp_phone?: string | null
          wedding_address?: string | null
          wedding_date: string
          wedding_time?: string | null
          wedding_venue?: string | null
        }
        Update: {
          bride_about?: string | null
          bride_family?: string | null
          bride_name?: string
          bride_parents?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          couple_image_url?: string | null
          couple_story?: string | null
          created_at?: string | null
          custom_message?: string | null
          gallery_images?: Json | null
          groom_about?: string | null
          groom_family?: string | null
          groom_name?: string
          groom_parents?: string | null
          id?: string
          map_url?: string | null
          rsvp_email?: string | null
          rsvp_phone?: string | null
          wedding_address?: string | null
          wedding_date?: string
          wedding_time?: string | null
          wedding_venue?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
