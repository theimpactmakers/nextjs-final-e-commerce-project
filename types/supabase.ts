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
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          weight_grams: number;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          stock_quantity: number;
          low_stock_threshold: number | null;
          track_inventory: boolean | null;
          allow_backorder: boolean | null;
          is_active: boolean | null;
          available_from: string | null;
          available_until: string | null;
          tax_rate: number;
          shipping_cost: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          weight_grams: number;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          track_inventory?: boolean | null;
          allow_backorder?: boolean | null;
          is_active?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          tax_rate?: number;
          shipping_cost?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          weight_grams?: number;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          track_inventory?: boolean | null;
          allow_backorder?: boolean | null;
          is_active?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          tax_rate?: number;
          shipping_cost?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          ean: number;
          age_group: Database["public"]["Enums"]["age_group"] | null;
          meat_type: Database["public"]["Enums"]["meat_type"] | null;
          specials: Database["public"]["Enums"]["specials"] | null;
          feeding_recommendation: string | null;
          is_featured: boolean;
          is_new: boolean | null;
          is_on_sale: boolean | null;
          bestseller: boolean;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          description?: string | null;
          ean: number;
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          meat_type?: Database["public"]["Enums"]["meat_type"] | null;
          specials?: Database["public"]["Enums"]["specials"] | null;
          feeding_recommendation?: string | null;
          is_featured?: boolean;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          bestseller?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          ean?: number;
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          meat_type?: Database["public"]["Enums"]["meat_type"] | null;
          specials?: Database["public"]["Enums"]["specials"] | null;
          feeding_recommendation?: string | null;
          is_featured?: boolean;
          is_new?: boolean | null;
          is_on_sale?: boolean | null;
          bestseller?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string | null;
          published_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          is_primary: boolean | null;
          display_order: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          is_primary?: boolean | null;
          display_order?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          is_primary?: boolean | null;
          display_order?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      products_with_primary_image: {
        Row: {
          id: string | null;
          name: string | null;
          slug: string | null;
          description: string | null;
          ean: number | null;
          age_group: Database["public"]["Enums"]["age_group"] | null;
          meat_type: Database["public"]["Enums"]["meat_type"] | null;
          specials: Database["public"]["Enums"]["specials"] | null;
          feeding_recommendation: string | null;
          is_featured: boolean | null;
          is_new: boolean | null;
          is_on_sale: boolean | null;
          bestseller: boolean | null;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          primary_image_url: string | null;
          primary_image_alt: string | null;
          min_price: number | null;
          starting_variant_name: string | null;
        };
      };
    };
    Enums: {
      age_group: "JUNIOR" | "ADULT" | "SENIOR";
      meat_type:
        | "ENTE"
        | "RIND"
        | "KANINCHEN"
        | "LAMM"
        | "PFERD"
        | "WILD"
        | "LACHS"
        | "HUHN";
      specials: "DIAT" | "HYPOALLERGEN" | "DARM" | "GELENK";
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  TableName extends keyof PublicSchema["Tables"] | keyof PublicSchema["Views"]
> = TableName extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][TableName]["Row"]
  : TableName extends keyof PublicSchema["Views"]
  ? PublicSchema["Views"][TableName]["Row"]
  : never;

export type TablesInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Update"];

export type Enums<EnumName extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][EnumName];
