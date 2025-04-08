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
      gallery: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
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
      get_random_quote: {
        Args: Record<PropertyKey, never>
        Returns: {
          author: string
          created_at: string
          id: number
          quote: string
          updated_at: string
        }[]
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
