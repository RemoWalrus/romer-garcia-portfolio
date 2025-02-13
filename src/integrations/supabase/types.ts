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
      gallery: {
        Row: {
          created_at: string
          id: number
          image_url: string
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
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
          category: string
          created_at: string
          description: string
          ext_url: string | null
          hero_image_url: string
          id: number
          image_url: string
          sort_order: number | null
          title: string
          youtube_url: string | null
        }
        Insert: {
          additional_images?: string[] | null
          category: string
          created_at?: string
          description: string
          ext_url?: string | null
          hero_image_url?: string
          id?: number
          image_url: string
          sort_order?: number | null
          title: string
          youtube_url?: string | null
        }
        Update: {
          additional_images?: string[] | null
          category?: string
          created_at?: string
          description?: string
          ext_url?: string | null
          hero_image_url?: string
          id?: number
          image_url?: string
          sort_order?: number | null
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
      sections: {
        Row: {
          author: string | null
          button_text: string
          created_at: string
          cta_section: string | null
          cta_text: string | null
          description: string | null
          facebook_url: string | null
          get_in_touch_text: string
          id: number
          instagram_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          quote: string | null
          section_name: string
          title: string
          twitter_url: string | null
          updated_at: string
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          author?: string | null
          button_text?: string
          created_at?: string
          cta_section?: string | null
          cta_text?: string | null
          description?: string | null
          facebook_url?: string | null
          get_in_touch_text?: string
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          quote?: string | null
          section_name: string
          title: string
          twitter_url?: string | null
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          author?: string | null
          button_text?: string
          created_at?: string
          cta_section?: string | null
          cta_text?: string | null
          description?: string | null
          facebook_url?: string | null
          get_in_touch_text?: string
          id?: number
          instagram_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          quote?: string | null
          section_name?: string
          title?: string
          twitter_url?: string | null
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
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
