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
      assignees: {
        Row: {
          avatar: string | null
          avatar_alt: string | null
          created_at: string | null
          email: string | null
          id: string
          instagram: string | null
          last_contact: string | null
          name: string
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_alt?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_alt?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      booking_costs: {
        Row: {
          amount: number
          booking_id: string
          cost_type: string
          created_at: string | null
          id: string
          vendor_name: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          cost_type: string
          created_at?: string | null
          id?: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          cost_type?: string
          created_at?: string | null
          id?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_costs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          advance: number | null
          booking_name: string | null
          client_name: string
          created_at: string | null
          date: string
          deliverables: string | null
          duration: number | null
          gst: number | null
          id: string
          invoice_sent: boolean | null
          location: string | null
          notes: string | null
          payment_status: boolean | null
          phone: string | null
          price: number | null
          shoot_type: Database["public"]["Enums"]["shoot_type"]
          status: Database["public"]["Enums"]["booking_status"] | null
          time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          advance?: number | null
          booking_name?: string | null
          client_name: string
          created_at?: string | null
          date: string
          deliverables?: string | null
          duration?: number | null
          gst?: number | null
          id?: string
          invoice_sent?: boolean | null
          location?: string | null
          notes?: string | null
          payment_status?: boolean | null
          phone?: string | null
          price?: number | null
          shoot_type: Database["public"]["Enums"]["shoot_type"]
          status?: Database["public"]["Enums"]["booking_status"] | null
          time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          advance?: number | null
          booking_name?: string | null
          client_name?: string
          created_at?: string | null
          date?: string
          deliverables?: string | null
          duration?: number | null
          gst?: number | null
          id?: string
          invoice_sent?: boolean | null
          location?: string | null
          notes?: string | null
          payment_status?: boolean | null
          phone?: string | null
          price?: number | null
          shoot_type?: Database["public"]["Enums"]["shoot_type"]
          status?: Database["public"]["Enums"]["booking_status"] | null
          time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_attachments: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          name: string
          size: string | null
          url: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          name: string
          size?: string | null
          url?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          name?: string
          size?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_attachments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_communications: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          subject: string | null
          type: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_timeline: {
        Row: {
          client_id: string
          completed: boolean | null
          created_at: string | null
          date: string
          id: string
          position: number | null
          title: string
        }
        Insert: {
          client_id: string
          completed?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          position?: number | null
          title: string
        }
        Update: {
          client_id?: string
          completed?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          position?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_timeline_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          avatar: string | null
          avatar_alt: string | null
          created_at: string | null
          email: string | null
          id: string
          instagram: string | null
          last_contact: string | null
          name: string
          phone: string | null
          project_value: number | null
          shoot_types: string[] | null
          status: Database["public"]["Enums"]["client_status"] | null
          updated_at: string | null
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_alt?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name: string
          phone?: string | null
          project_value?: number | null
          shoot_types?: string[] | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_alt?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name?: string
          phone?: string | null
          project_value?: number | null
          shoot_types?: string[] | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          added_date: string | null
          category: Database["public"]["Enums"]["inventory_category"]
          created_at: string | null
          estimated_price: number | null
          id: string
          is_priority: boolean | null
          name: string
          notes: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          updated_at: string | null
          user_id: string
          vendor: string | null
        }
        Insert: {
          added_date?: string | null
          category: Database["public"]["Enums"]["inventory_category"]
          created_at?: string | null
          estimated_price?: number | null
          id?: string
          is_priority?: boolean | null
          name: string
          notes?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
          user_id: string
          vendor?: string | null
        }
        Update: {
          added_date?: string | null
          category?: Database["public"]["Enums"]["inventory_category"]
          created_at?: string | null
          estimated_price?: number | null
          id?: string
          is_priority?: boolean | null
          name?: string
          notes?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_budgets: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          month: string
          note: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          month: string
          note?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          month?: string
          note?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          avatar: string | null
          avatar_alt: string | null
          category: Database["public"]["Enums"]["professionals_category"] | null
          created_at: string | null
          email: string | null
          id: string
          instagram: string | null
          last_contact: string | null
          name: string
          phone: string | null
          starred: boolean
          updated_at: string | null
          user_id: string
          whatsapp: string | null
          work_name: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_alt?: string | null
          category?:
            | Database["public"]["Enums"]["professionals_category"]
            | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name: string
          phone?: string | null
          starred?: boolean
          updated_at?: string | null
          user_id: string
          whatsapp?: string | null
          work_name?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_alt?: string | null
          category?:
            | Database["public"]["Enums"]["professionals_category"]
            | null
          created_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_contact?: string | null
          name?: string
          phone?: string | null
          starred?: boolean
          updated_at?: string | null
          user_id?: string
          whatsapp?: string | null
          work_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignees: {
        Row: {
          assignee_id: string
          task_id: string
        }
        Insert: {
          assignee_id: string
          task_id: string
        }
        Update: {
          assignee_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "assignees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subtasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          position: number | null
          task_id: string
          title: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          position?: number | null
          task_id: string
          title: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          position?: number | null
          task_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_urgent: boolean | null
          linked_to_calendar: boolean | null
          position: number | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_urgent?: boolean | null
          linked_to_calendar?: boolean | null
          position?: number | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_urgent?: boolean | null
          linked_to_calendar?: boolean | null
          position?: number | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_admin: boolean | null
          studio_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_admin?: boolean | null
          studio_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean | null
          studio_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_booking_analytics: {
        Args: never
        Returns: {
          avg_monthly_booking_value: number
          growth_percentage: number
          previous_growth_percentage: number
          revenue_last_month: number
          revenue_this_month: number
          shoots_completed: number
        }[]
      }
      get_booking_unit_economics: {
        Args: never
        Returns: {
          avg_margin_percentage: number
          avg_net_revenue: number
          loss_making_shoots: number
          total_shoots: number
        }[]
      }
      get_enum_values: { Args: { enum_name: string }; Returns: string[] }
      get_last_6_months_revenue: {
        Args: never
        Returns: {
          month_key: string
          month_name: string
          revenue: number
        }[]
      }
      get_monthly_profit_analytics: {
        Args: never
        Returns: {
          net_growth_percentage: number
          net_profit_last_month: number
          net_profit_this_month: number
        }[]
      }
      get_recent_transactions: {
        Args: never
        Returns: {
          booking_date: string
          booking_name: string
          net_revenue: number
          profit_percentage: number
          shoot_type: string
          total_price: number
        }[]
      }
      get_revenue_buckets: {
        Args: never
        Returns: {
          revenue_range: string
          shoot_count: number
        }[]
      }
      get_revenue_dashboard: {
        Args: { p_user_id: string }
        Returns: {
          monthly_revenue: number
          potential_revenue: number
          revenue_by_type: Json
          shoots_completed: number
          shoots_this_week: number
          upcoming_shoots_count: number
        }[]
      }
      get_shoot_type_split: {
        Args: never
        Returns: {
          percentage: number
          revenue: number
          shoot_type: string
        }[]
      }
    }
    Enums: {
      booking_status: "confirmed" | "pending" | "completed" | "cancelled"
      client_status:
        | "lead"
        | "booked"
        | "editing"
        | "shoot_done"
        | "delivered"
        | "inactive"
      inventory_category:
        | "lights"
        | "mics"
        | "backdrops"
        | "consumables"
        | "equipment"
        | "other"
      inventory_status: "needed" | "ordered" | "received" | "purchased"
      professionals_category:
        | "video"
        | "photo"
        | "costumes"
        | "make-up-artist"
        | "models"
        | "equipments"
        | "restaurants"
        | "studios"
        | "custom"
      shoot_type:
        | "wedding"
        | "portrait"
        | "commercial"
        | "event"
        | "product"
        | "maternity"
        | "fashion"
        | "podcasting"
        | "baby"
        | "modeling"
        | "pending"
        | "studio_rentals"
        | "food"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "waiting" | "done"
      user_role: "admin" | "staff"
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
      booking_status: ["confirmed", "pending", "completed", "cancelled"],
      client_status: [
        "lead",
        "booked",
        "editing",
        "shoot_done",
        "delivered",
        "inactive",
      ],
      inventory_category: [
        "lights",
        "mics",
        "backdrops",
        "consumables",
        "equipment",
        "other",
      ],
      inventory_status: ["needed", "ordered", "received", "purchased"],
      professionals_category: [
        "video",
        "photo",
        "costumes",
        "make-up-artist",
        "models",
        "equipments",
        "restaurants",
        "studios",
        "custom",
      ],
      shoot_type: [
        "wedding",
        "portrait",
        "commercial",
        "event",
        "product",
        "maternity",
        "fashion",
        "podcasting",
        "baby",
        "modeling",
        "pending",
        "studio_rentals",
        "food",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "waiting", "done"],
      user_role: ["admin", "staff"],
    },
  },
} as const
