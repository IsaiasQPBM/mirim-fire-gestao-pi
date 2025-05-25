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
      assessment_results: {
        Row: {
          assessment_id: string
          created_at: string
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_date: string
          assessment_type: string
          class_id: string
          created_at: string
          description: string | null
          discipline_id: string
          id: string
          instructor_id: string
          status: string
          title: string
          total_points: number
          updated_at: string
        }
        Insert: {
          assessment_date: string
          assessment_type: string
          class_id: string
          created_at?: string
          description?: string | null
          discipline_id: string
          id?: string
          instructor_id: string
          status?: string
          title: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          assessment_date?: string
          assessment_type?: string
          class_id?: string
          created_at?: string
          description?: string | null
          discipline_id?: string
          id?: string
          instructor_id?: string
          status?: string
          title?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          class_id: string | null
          created_at: string
          created_by: string
          description: string | null
          discipline_id: string | null
          end_date: string
          event_type: string
          id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          discipline_id?: string | null
          end_date: string
          event_type: string
          id?: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          discipline_id?: string | null
          end_date?: string
          event_type?: string
          id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      class_disciplines: {
        Row: {
          class_id: string
          created_at: string
          discipline_id: string
          id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          discipline_id: string
          id?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          discipline_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_disciplines_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_disciplines_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      class_instructors: {
        Row: {
          assignment_date: string
          class_id: string
          created_at: string
          id: string
          instructor_id: string
          is_primary: boolean
        }
        Insert: {
          assignment_date?: string
          class_id: string
          created_at?: string
          id?: string
          instructor_id: string
          is_primary?: boolean
        }
        Update: {
          assignment_date?: string
          class_id?: string
          created_at?: string
          id?: string
          instructor_id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "class_instructors_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_instructors_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_students: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          course_id: string
          created_at: string
          end_date: string
          id: string
          location: string
          name: string
          start_date: string
          status: string
          time_schedule: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          end_date: string
          id?: string
          location: string
          name: string
          start_date: string
          status?: string
          time_schedule: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          end_date?: string
          id?: string
          location?: string
          name?: string
          start_date?: string
          status?: string
          time_schedule?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          class_id: string | null
          content: string
          id: string
          is_read: boolean
          message_type: string
          priority: string
          read_at: string | null
          recipient_id: string | null
          sender_id: string
          sent_at: string
          title: string
        }
        Insert: {
          class_id?: string | null
          content: string
          id?: string
          is_read?: boolean
          message_type: string
          priority?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
          sent_at?: string
          title: string
        }
        Update: {
          class_id?: string | null
          content?: string
          id?: string
          is_read?: boolean
          message_type?: string
          priority?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          sent_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          objectives: string | null
          prerequisites: string[] | null
          total_hours: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          objectives?: string | null
          prerequisites?: string[] | null
          total_hours?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          objectives?: string | null
          prerequisites?: string[] | null
          total_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      disciplines: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          practice_hours: number
          status: string
          theory_hours: number
          updated_at: string
          workload: number | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          practice_hours?: number
          status?: string
          theory_hours?: number
          updated_at?: string
          workload?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          practice_hours?: number
          status?: string
          theory_hours?: number
          updated_at?: string
          workload?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "disciplines_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          class_id: string
          content: string | null
          created_at: string
          description: string | null
          discipline_id: string
          end_time: string
          id: string
          instructor_id: string
          lesson_date: string
          resources: string[] | null
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          class_id: string
          content?: string | null
          created_at?: string
          description?: string | null
          discipline_id: string
          end_time: string
          id?: string
          instructor_id: string
          lesson_date: string
          resources?: string[] | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          content?: string | null
          created_at?: string
          description?: string | null
          discipline_id?: string
          end_time?: string
          id?: string
          instructor_id?: string
          lesson_date?: string
          resources?: string[] | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
