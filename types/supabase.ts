export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string | null;
          display_order: number;
          id: string;
          image_url: string;
          is_primary: boolean | null;
          product_id: string;
          updated_at: string | null;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string | null;
          display_order?: number;
          id?: string;
          image_url: string;
          is_primary?: boolean | null;
          product_id: string;
          updated_at?: string | null;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string | null;
          display_order?: number;
          id?: string;
          image_url?: string;
          is_primary?: boolean | null;
          product_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null;
          created_at: string | null;
          description: string | null;
          ean: number;
          feeding_recommendation: string | null;
          id: string;
          is_featured: boolean;
          is_new: boolean | null;
          is_on_sale: boolean | null;
          meat_type: Database["public"]["Enums"]["meat_type"] | null;
          meta_description: string | null;
          meta_keywords: string | null;
          meta_title: string | null;
          name: string;
          price: number | null;
          published_at: string | null;
          slug: string;
          specials: Database["public"]["Enums"]["specials"] | null;
          stock_quantity: number | null;
          updated_at: string | null;
          weight_kg: number | null;
        };
        Insert: {
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          created_at?: string | null;
          description?: string | null;
          ean: number;
          feeding_recommendation?: string | null;
          id?: string;
          is_featured?: boolean;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          meat_type?: Database["public"]["Enums"]["meat_type"] | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          meta_title?: string | null;
          name: string;
          price?: number | null;
          published_at?: string | null;
          slug?: string;
          specials?: Database["public"]["Enums"]["specials"] | null;
          stock_quantity?: number | null;
          updated_at?: string | null;
          weight_kg?: number | null;
        };
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          created_at?: string | null;
          description?: string | null;
          ean?: number;
          feeding_recommendation?: string | null;
          id?: string;
          is_featured?: boolean;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          meat_type?: Database["public"]["Enums"]["meat_type"] | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          meta_title?: string | null;
          name?: string;
          price?: number | null;
          published_at?: string | null;
          slug?: string;
          specials?: Database["public"]["Enums"]["specials"] | null;
          stock_quantity?: number | null;
          updated_at?: string | null;
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          date_of_birth: string | null;
          first_name: string;
          gender: string | null;
          id: string;
          last_name: string;
          role: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          date_of_birth?: string | null;
          first_name: string;
          gender?: string | null;
          id: string;
          last_name: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          date_of_birth?: string | null;
          first_name?: string;
          gender?: string | null;
          id?: string;
          last_name?: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          weight_grams: number;
          stock_quantity: number;
          low_stock_threshold: number | null;
          track_inventory: boolean | null;
          allow_backorder: boolean | null;
          is_active: boolean | null;
          available_from: string | null;
          available_until: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          weight_grams: number;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          track_inventory?: boolean | null;
          allow_backorder?: boolean | null;
          is_active?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          weight_grams?: number;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          track_inventory?: boolean | null;
          allow_backorder?: boolean | null;
          is_active?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      products_with_primary_image: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null;
          created_at: string | null;
          description: string | null;
          ean: number | null;
          feeding_recommendation: string | null;
          id: string | null;
          is_featured: boolean | null;
          is_new: boolean | null;
          is_on_sale: boolean | null;
          meat_type: Database["public"]["Enums"]["meat_type"] | null;
          meta_description: string | null;
          meta_keywords: string | null;
          meta_title: string | null;
          name: string | null;
          price: number | null;
          primary_image_alt: string | null;
          primary_image_url: string | null;
          published_at: string | null;
          slug: string | null;
          specials: Database["public"]["Enums"]["specials"] | null;
          stock_quantity: number | null;
          updated_at: string | null;
          weight_kg: number | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      age_group: "JUNIOR" | "ADULT" | "SENIOR";
      meat_type:
        | "ENTE"
        | "RIND"
        | "KANINCHEN"
        | "LAHM"
        | "PFERD"
        | "WILD"
        | "LACHS";
      specials: "DIAT" | "HYPOALLERGEN" | "DARM" | "GELENK";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
