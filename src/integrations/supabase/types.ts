export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      collective_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          referrer: string | null
          source_page: string | null
          status: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          referrer?: string | null
          source_page?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          referrer?: string | null
          source_page?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      config: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      daily_memes: {
        Row: {
          attribution: string | null
          coding_tip: string | null
          created_at: string
          fun_fact: string | null
          id: number
          is_active: boolean | null
          meme_text: string
          update_info: string | null
          updated_at: string
        }
        Insert: {
          attribution?: string | null
          coding_tip?: string | null
          created_at?: string
          fun_fact?: string | null
          id?: number
          is_active?: boolean | null
          meme_text: string
          update_info?: string | null
          updated_at?: string
        }
        Update: {
          attribution?: string | null
          coding_tip?: string | null
          created_at?: string
          fun_fact?: string | null
          id?: number
          is_active?: boolean | null
          meme_text?: string
          update_info?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string | null
          id: number
          image_url: string
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_titles: {
        Row: {
          created_at: string
          id: number
          sort_order: number | null
          text: string
          updated_at: string
          weights: string[]
        }
        Insert: {
          created_at?: string
          id?: number
          sort_order?: number | null
          text: string
          updated_at?: string
          weights: string[]
        }
        Update: {
          created_at?: string
          id?: number
          sort_order?: number | null
          text?: string
          updated_at?: string
          weights?: string[]
        }
        Relationships: []
      }
      metadata: {
        Row: {
          created_at: string
          id: number
          meta_key: string
          meta_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          meta_key: string
          meta_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          meta_key?: string
          meta_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      paradoxxia_carousel: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string
          link_url: string | null
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url: string
          link_url?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string
          link_url?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          bio: string | null
          contact_email: string | null
          created_at: string
          display_name: string | null
          id: string
          image_url: string | null
          link_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          additional_images: string[] | null
          alt_text: string | null
          category: string
          created_at: string
          description: string
          ext_url: string | null
          github_url: string | null
          hero_image_url: string
          id: number
          image_url: string
          project_url: string | null
          sort_order: number | null
          tech_stack: string[] | null
          title: string
          youtube_url: string | null
        }
        Insert: {
          additional_images?: string[] | null
          alt_text?: string | null
          category: string
          created_at?: string
          description: string
          ext_url?: string | null
          github_url?: string | null
          hero_image_url?: string
          id?: number
          image_url: string
          project_url?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          title: string
          youtube_url?: string | null
        }
        Update: {
          additional_images?: string[] | null
          alt_text?: string | null
          category?: string
          created_at?: string
          description?: string
          ext_url?: string | null
          github_url?: string | null
          hero_image_url?: string
          id?: number
          image_url?: string
          project_url?: string | null
          sort_order?: number | null
          tech_stack?: string[] | null
          title?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          author: string
          created_at: string
          id: number
          quote: string
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: number
          quote: string
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: number
          quote?: string
          updated_at?: string
        }
        Relationships: []
      }
      reverb_archive_slots: {
        Row: {
          character_slug: string | null
          created_at: string
          display_order: number
          id: string
          label: string | null
          linked_transmission_id: string | null
          release_status: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          character_slug?: string | null
          created_at?: string
          display_order?: number
          id?: string
          label?: string | null
          linked_transmission_id?: string | null
          release_status?: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          character_slug?: string | null
          created_at?: string
          display_order?: number
          id?: string
          label?: string | null
          linked_transmission_id?: string | null
          release_status?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reverb_archive_slots_character_slug_fkey"
            columns: ["character_slug"]
            isOneToOne: false
            referencedRelation: "reverb_characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reverb_archive_slots_linked_transmission_id_fkey"
            columns: ["linked_transmission_id"]
            isOneToOne: false
            referencedRelation: "reverb_transmissions"
            referencedColumns: ["id"]
          },
        ]
      }
      reverb_characters: {
        Row: {
          accent: string
          base_id: string | null
          caption: string
          color_name: string | null
          created_at: string
          discipline: string | null
          figure_file: string | null
          gallery: Json | null
          gear: string[]
          glow: string
          has_profile: boolean
          id: string
          identity: Json
          image_file: string
          is_hidden: boolean
          is_locked: boolean
          kanji: string | null
          name: string
          notes: string[]
          overview: string[]
          palette: string[]
          quote: string
          role: string
          sign_off: string | null
          sort_order: number
          specialties: string[]
          tagline: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          accent?: string
          base_id?: string | null
          caption?: string
          color_name?: string | null
          created_at?: string
          discipline?: string | null
          figure_file?: string | null
          gallery?: Json | null
          gear?: string[]
          glow?: string
          has_profile?: boolean
          id: string
          identity?: Json
          image_file?: string
          is_hidden?: boolean
          is_locked?: boolean
          kanji?: string | null
          name: string
          notes?: string[]
          overview?: string[]
          palette?: string[]
          quote?: string
          role?: string
          sign_off?: string | null
          sort_order?: number
          specialties?: string[]
          tagline?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          accent?: string
          base_id?: string | null
          caption?: string
          color_name?: string | null
          created_at?: string
          discipline?: string | null
          figure_file?: string | null
          gallery?: Json | null
          gear?: string[]
          glow?: string
          has_profile?: boolean
          id?: string
          identity?: Json
          image_file?: string
          is_hidden?: boolean
          is_locked?: boolean
          kanji?: string | null
          name?: string
          notes?: string[]
          overview?: string[]
          palette?: string[]
          quote?: string
          role?: string
          sign_off?: string | null
          sort_order?: number
          specialties?: string[]
          tagline?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reverb_gallery: {
        Row: {
          alt_text: string | null
          caption: string | null
          character_ids: string[]
          created_at: string
          id: string
          image_file: string
          media_type: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          character_ids?: string[]
          created_at?: string
          id?: string
          image_file: string
          media_type?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          character_ids?: string[]
          created_at?: string
          id?: string
          image_file?: string
          media_type?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      reverb_transmissions: {
        Row: {
          body: string | null
          category: string
          character_slug: string | null
          cover_image_url: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          excerpt: string | null
          external_url: string | null
          featured: boolean
          id: string
          is_anomaly: boolean
          is_collective_only: boolean
          media_url: string | null
          published_at: string | null
          slug: string
          sort_order: number | null
          status: string
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          transmission_number: number
          updated_at: string
        }
        Insert: {
          body?: string | null
          category?: string
          character_slug?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          excerpt?: string | null
          external_url?: string | null
          featured?: boolean
          id?: string
          is_anomaly?: boolean
          is_collective_only?: boolean
          media_url?: string | null
          published_at?: string | null
          slug: string
          sort_order?: number | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          transmission_number?: number
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: string
          character_slug?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          excerpt?: string | null
          external_url?: string | null
          featured?: boolean
          id?: string
          is_anomaly?: boolean
          is_collective_only?: boolean
          media_url?: string | null
          published_at?: string | null
          slug?: string
          sort_order?: number | null
          status?: string
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          transmission_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reverb_transmissions_character_slug_fkey"
            columns: ["character_slug"]
            isOneToOne: false
            referencedRelation: "reverb_characters"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          button_text: string
          created_at: string
          description: string | null
          facebook_url: string | null
          get_in_touch_text: string
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          section_name: string
          title: string
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          button_text?: string
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          get_in_touch_text?: string
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          section_name: string
          title: string
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          button_text?: string
          created_at?: string
          description?: string | null
          facebook_url?: string | null
          get_in_touch_text?: string
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          section_name?: string
          title?: string
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_meme: {
        Args: never
        Returns: {
          attribution: string | null
          coding_tip: string | null
          created_at: string
          fun_fact: string | null
          id: number
          is_active: boolean | null
          meme_text: string
          update_info: string | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "daily_memes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_random_quote: {
        Args: never
        Returns: {
          author: string
          created_at: string
          id: number
          quote: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "quotes"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
