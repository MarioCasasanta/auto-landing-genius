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
      landing_pages: {
        Row: {
          additional_comments: string | null
          business_type: string
          client_name: string
          company_history: string | null
          company_name: string
          content: Json | null
          created_at: string
          domain: string | null
          has_photos: boolean | null
          id: string
          objective: Database["public"]["Enums"]["landing_page_objective"]
          objective_other: string | null
          offer_details: string | null
          pricing_details: string | null
          profile_id: string
          show_pricing: boolean | null
          status: string | null
          subdomain: string | null
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          additional_comments?: string | null
          business_type: string
          client_name: string
          company_history?: string | null
          company_name: string
          content?: Json | null
          created_at?: string
          domain?: string | null
          has_photos?: boolean | null
          id?: string
          objective: Database["public"]["Enums"]["landing_page_objective"]
          objective_other?: string | null
          offer_details?: string | null
          pricing_details?: string | null
          profile_id: string
          show_pricing?: boolean | null
          status?: string | null
          subdomain?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          additional_comments?: string | null
          business_type?: string
          client_name?: string
          company_history?: string | null
          company_name?: string
          content?: Json | null
          created_at?: string
          domain?: string | null
          has_photos?: boolean | null
          id?: string
          objective?: Database["public"]["Enums"]["landing_page_objective"]
          objective_other?: string | null
          offer_details?: string | null
          pricing_details?: string | null
          profile_id?: string
          show_pricing?: boolean | null
          status?: string | null
          subdomain?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_pages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          plan_type: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id: string
          plan_type?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          plan_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_type: string
          profile_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_type: string
          profile_id: string
          status: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_type?: string
          profile_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string | null
          profile_id: string
          responses: Json | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          profile_id: string
          responses?: Json | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          profile_id?: string
          responses?: Json | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_files: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          profile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_files_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string
          content: Json
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          content: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
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
      landing_page_objective:
        | "leads"
        | "appointment"
        | "sales"
        | "event"
        | "branding"
        | "other"
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
