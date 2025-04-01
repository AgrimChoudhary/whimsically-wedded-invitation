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
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          mobile: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_id?: string | null
          mobile?: string
          name?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
