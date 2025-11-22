/**
 * Database Types
 * 
 * TypeScript types generated from Supabase schema.
 * 
 * To regenerate types:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Generate: supabase gen types typescript --project-id "your-project-id" > src/types/database.types.ts
 * 
 * @see docs/GENERATE_TYPES.md for detailed instructions
 * 
 * @module types/database.types
 */

/**
 * Placeholder database types
 * 
 * Replace this with generated types from Supabase CLI:
 * supabase gen types typescript --project-id "your-project-id" > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          age: number | null;
          avatar_url: string | null;
          bio: string | null;
          location: unknown | null; // PostGIS geography
          city: string | null;
          country: string | null;
          country_code: string | null;
          verified: boolean;
          premium: boolean;
          online_status: string;
          last_active: string;
          onboarding_completed: boolean;
          profile_completion: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      user_languages: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          language_code: string;
          flag_emoji: string | null;
          type: 'teaching' | 'learning';
          level: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_languages']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_languages']['Insert']>;
      };
      user_interests: {
        Row: {
          id: string;
          user_id: string;
          interest: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_interests']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_interests']['Insert']>;
      };
      availability_slots: {
        Row: {
          id: string;
          user_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          repeat_weekly: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['availability_slots']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['availability_slots']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          link: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string;
          reason: string;
          description: string;
          evidence_urls: string[] | null;
          status: string;
          moderator_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      nearby_users: {
        Args: {
          user_lat: number;
          user_lng: number;
          radius_km?: number;
          current_user_id?: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          age: number | null;
          avatar_url: string | null;
          city: string | null;
          country: string | null;
          verified: boolean;
          premium: boolean;
          online_status: string;
          distance_km: number;
        }[];
      };
      calculate_match_score: {
        Args: {
          user1_id: string;
          user2_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

