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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_allowed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          allow_testimonial_public: boolean | null
          anything_else: string | null
          app_built_description: string | null
          best_part: string | null
          created_at: string
          email: string | null
          id: string
          improve_part: string | null
          nps_score: number | null
          overall_rating: number | null
          participant_name: string | null
          rating_future: number | null
          rating_intro: number | null
          rating_lunch: number | null
          rating_next_level: number | null
          rating_presentations: number | null
          rating_qa_beer: number | null
          rating_workshop_session_1: number | null
          rating_workshop_session_2: number | null
          recommend_to_others: string | null
          testimonial: string | null
          token_id: string
          will_continue_building: string | null
        }
        Insert: {
          allow_testimonial_public?: boolean | null
          anything_else?: string | null
          app_built_description?: string | null
          best_part?: string | null
          created_at?: string
          email?: string | null
          id?: string
          improve_part?: string | null
          nps_score?: number | null
          overall_rating?: number | null
          participant_name?: string | null
          rating_future?: number | null
          rating_intro?: number | null
          rating_lunch?: number | null
          rating_next_level?: number | null
          rating_presentations?: number | null
          rating_qa_beer?: number | null
          rating_workshop_session_1?: number | null
          rating_workshop_session_2?: number | null
          recommend_to_others?: string | null
          testimonial?: string | null
          token_id: string
          will_continue_building?: string | null
        }
        Update: {
          allow_testimonial_public?: boolean | null
          anything_else?: string | null
          app_built_description?: string | null
          best_part?: string | null
          created_at?: string
          email?: string | null
          id?: string
          improve_part?: string | null
          nps_score?: number | null
          overall_rating?: number | null
          participant_name?: string | null
          rating_future?: number | null
          rating_intro?: number | null
          rating_lunch?: number | null
          rating_next_level?: number | null
          rating_presentations?: number | null
          rating_qa_beer?: number | null
          rating_workshop_session_1?: number | null
          rating_workshop_session_2?: number | null
          recommend_to_others?: string | null
          testimonial?: string | null
          token_id?: string
          will_continue_building?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "survey_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_signups: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          preferred_dates: string[] | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          preferred_dates?: string[] | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          preferred_dates?: string[] | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_total: number
          contact_name: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_name: string | null
          free_vcf_ticket: string
          id: string
          status: string
          stripe_session_id: string
          tier: string | null
        }
        Insert: {
          amount_total: number
          contact_name?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_name?: string | null
          free_vcf_ticket?: string
          id?: string
          status?: string
          stripe_session_id: string
          tier?: string | null
        }
        Update: {
          amount_total?: number
          contact_name?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string | null
          free_vcf_ticket?: string
          id?: string
          status?: string
          stripe_session_id?: string
          tier?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          ai_coding_experience: string
          anything_else: string | null
          app_audience: string | null
          app_idea_description: string | null
          building_blocks: string
          created_at: string
          dietary: string
          drink_preference: string
          email: string | null
          has_app_idea: boolean
          id: string
          lovable_experience: string
          moderation_language: string | null
          participant_name: string | null
          success_criteria: string
          token_id: string
          workshop_goals: string
        }
        Insert: {
          ai_coding_experience: string
          anything_else?: string | null
          app_audience?: string | null
          app_idea_description?: string | null
          building_blocks: string
          created_at?: string
          dietary: string
          drink_preference: string
          email?: string | null
          has_app_idea?: boolean
          id?: string
          lovable_experience: string
          moderation_language?: string | null
          participant_name?: string | null
          success_criteria: string
          token_id: string
          workshop_goals: string
        }
        Update: {
          ai_coding_experience?: string
          anything_else?: string | null
          app_audience?: string | null
          app_idea_description?: string | null
          building_blocks?: string
          created_at?: string
          dietary?: string
          drink_preference?: string
          email?: string | null
          has_app_idea?: boolean
          id?: string
          lovable_experience?: string
          moderation_language?: string | null
          participant_name?: string | null
          success_criteria?: string
          token_id?: string
          workshop_goals?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "survey_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_tokens: {
        Row: {
          created_at: string
          id: string
          kind: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          token?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_email: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
