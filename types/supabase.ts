export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line2: string | null;
          address_type: string | null;
          city: string;
          company: string | null;
          country: string;
          created_at: string | null;
          first_name: string;
          house_number: string;
          id: string;
          is_default: boolean | null;
          last_name: string;
          phone: string | null;
          postal_code: string;
          state: string | null;
          street: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          address_line2?: string | null;
          address_type?: string | null;
          city: string;
          company?: string | null;
          country?: string;
          created_at?: string | null;
          first_name: string;
          house_number: string;
          id?: string;
          is_default?: boolean | null;
          last_name: string;
          phone?: string | null;
          postal_code: string;
          state?: string | null;
          street: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          address_line2?: string | null;
          address_type?: string | null;
          city?: string;
          company?: string | null;
          country?: string;
          created_at?: string | null;
          first_name?: string;
          house_number?: string;
          id?: string;
          is_default?: boolean | null;
          last_name?: string;
          phone?: string | null;
          postal_code?: string;
          state?: string | null;
          street?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cart_items: {
        Row: {
          cart_id: string;
          created_at: string | null;
          id: string;
          price_at_add: number;
          quantity: number;
          updated_at: string | null;
          variant_id: string;
        };
        Insert: {
          cart_id: string;
          created_at?: string | null;
          id?: string;
          price_at_add: number;
          quantity: number;
          updated_at?: string | null;
          variant_id: string;
        };
        Update: {
          cart_id?: string;
          created_at?: string | null;
          id?: string;
          price_at_add?: number;
          quantity?: number;
          updated_at?: string | null;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          }
        ];
      };
      carts: {
        Row: {
          created_at: string | null;
          expires_at: string | null;
          id: string;
          session_id: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          session_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          session_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      feeding_guidelines: {
        Row: {
          created_at: string | null;
          daily_amount_grams: number;
          display_order: number | null;
          dog_weight_kg_max: number;
          dog_weight_kg_min: number;
          id: string;
          notes: string | null;
          product_id: string;
        };
        Insert: {
          created_at?: string | null;
          daily_amount_grams: number;
          display_order?: number | null;
          dog_weight_kg_max: number;
          dog_weight_kg_min: number;
          id?: string;
          notes?: string | null;
          product_id: string;
        };
        Update: {
          created_at?: string | null;
          daily_amount_grams?: number;
          display_order?: number | null;
          dog_weight_kg_max?: number;
          dog_weight_kg_min?: number;
          id?: string;
          notes?: string | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feeding_guidelines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feeding_guidelines_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
      ingredients: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_allergen: boolean | null;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_allergen?: boolean | null;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_allergen?: boolean | null;
          name?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string | null;
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          total_price: number;
          unit_price: number;
          variant_id: string;
          variant_name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          total_price: number;
          unit_price: number;
          variant_id: string;
          variant_name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          total_price?: number;
          unit_price?: number;
          variant_id?: string;
          variant_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          admin_notes: string | null;
          billing_address: Json;
          cancelled_at: string | null;
          carrier: string | null;
          confirmed_at: string | null;
          created_at: string | null;
          customer_notes: string | null;
          delivered_at: string | null;
          discount_amount: number | null;
          guest_email: string | null;
          guest_first_name: string | null;
          guest_last_name: string | null;
          id: string;
          order_number: string;
          payment_method: string | null;
          payment_status: string;
          payment_transaction_id: string | null;
          shipped_at: string | null;
          shipping_address: Json;
          shipping_cost: number;
          shipping_method: string | null;
          status: string;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          tracking_number: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          billing_address: Json;
          cancelled_at?: string | null;
          carrier?: string | null;
          confirmed_at?: string | null;
          created_at?: string | null;
          customer_notes?: string | null;
          delivered_at?: string | null;
          discount_amount?: number | null;
          guest_email?: string | null;
          guest_first_name?: string | null;
          guest_last_name?: string | null;
          id?: string;
          order_number: string;
          payment_method?: string | null;
          payment_status?: string;
          payment_transaction_id?: string | null;
          shipped_at?: string | null;
          shipping_address: Json;
          shipping_cost?: number;
          shipping_method?: string | null;
          status?: string;
          subtotal: number;
          tax_amount?: number;
          total_amount: number;
          tracking_number?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          billing_address?: Json;
          cancelled_at?: string | null;
          carrier?: string | null;
          confirmed_at?: string | null;
          created_at?: string | null;
          customer_notes?: string | null;
          delivered_at?: string | null;
          discount_amount?: number | null;
          guest_email?: string | null;
          guest_first_name?: string | null;
          guest_last_name?: string | null;
          id?: string;
          order_number?: string;
          payment_method?: string | null;
          payment_status?: string;
          payment_transaction_id?: string | null;
          shipped_at?: string | null;
          shipping_address?: Json;
          shipping_cost?: number;
          shipping_method?: string | null;
          status?: string;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          tracking_number?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_methods: {
        Row: {
          code: string;
          config: Json | null;
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          icon_url: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          provider: string;
          stripe_payment_method_type: string | null;
          stripe_supported_currencies: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          code: string;
          config?: Json | null;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          provider: string;
          stripe_payment_method_type?: string | null;
          stripe_supported_currencies?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          code?: string;
          config?: Json | null;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          provider?: string;
          stripe_payment_method_type?: string | null;
          stripe_supported_currencies?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
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
          },
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
      product_ingredients: {
        Row: {
          display_order: number | null;
          id: string;
          ingredient_id: string;
          percentage: number | null;
          product_id: string;
        };
        Insert: {
          display_order?: number | null;
          id?: string;
          ingredient_id: string;
          percentage?: number | null;
          product_id: string;
        };
        Update: {
          display_order?: number | null;
          id?: string;
          ingredient_id?: string;
          percentage?: number | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
      product_variants: {
        Row: {
          allow_backorder: boolean | null;
          available_from: string | null;
          available_until: string | null;
          compare_at_price: number | null;
          cost_price: number | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          low_stock_threshold: number | null;
          name: string;
          price: number;
          product_id: string;
          shipping_cost: number | null;
          stock_quantity: number;
          tax_rate: number | null;
          track_inventory: boolean | null;
          updated_at: string | null;
          weight_grams: number;
        };
        Insert: {
          allow_backorder?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          compare_at_price?: number | null;
          cost_price?: number | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          low_stock_threshold?: number | null;
          name: string;
          price: number;
          product_id: string;
          shipping_cost?: number | null;
          stock_quantity?: number;
          tax_rate?: number | null;
          track_inventory?: boolean | null;
          updated_at?: string | null;
          weight_grams: number;
        };
        Update: {
          allow_backorder?: boolean | null;
          available_from?: string | null;
          available_until?: string | null;
          compare_at_price?: number | null;
          cost_price?: number | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          low_stock_threshold?: number | null;
          name?: string;
          price?: number;
          product_id?: string;
          shipping_cost?: number | null;
          stock_quantity?: number;
          tax_rate?: number | null;
          track_inventory?: boolean | null;
          updated_at?: string | null;
          weight_grams?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null;
          bestseller: boolean;
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
          published_at: string | null;
          slug: string;
          specials: Database["public"]["Enums"]["specials"] | null;
          updated_at: string | null;
        };
        Insert: {
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          bestseller?: boolean;
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
          published_at?: string | null;
          slug?: string;
          specials?: Database["public"]["Enums"]["specials"] | null;
          updated_at?: string | null;
        };
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"] | null;
          bestseller?: boolean;
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
          published_at?: string | null;
          slug?: string;
          specials?: Database["public"]["Enums"]["specials"] | null;
          updated_at?: string | null;
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
      promotions: {
        Row: {
          applies_to: string;
          created_at: string | null;
          description: string | null;
          discount_type: string;
          discount_value: number;
          ends_at: string;
          id: string;
          is_active: boolean | null;
          min_purchase_amount: number | null;
          name: string;
          product_ids: string[] | null;
          starts_at: string;
          updated_at: string | null;
          variant_ids: string[] | null;
        };
        Insert: {
          applies_to: string;
          created_at?: string | null;
          description?: string | null;
          discount_type: string;
          discount_value: number;
          ends_at: string;
          id?: string;
          is_active?: boolean | null;
          min_purchase_amount?: number | null;
          name: string;
          product_ids?: string[] | null;
          starts_at: string;
          updated_at?: string | null;
          variant_ids?: string[] | null;
        };
        Update: {
          applies_to?: string;
          created_at?: string | null;
          description?: string | null;
          discount_type?: string;
          discount_value?: number;
          ends_at?: string;
          id?: string;
          is_active?: boolean | null;
          min_purchase_amount?: number | null;
          name?: string;
          product_ids?: string[] | null;
          starts_at?: string;
          updated_at?: string | null;
          variant_ids?: string[] | null;
        };
        Relationships: [];
      };
      related_products: {
        Row: {
          created_at: string | null;
          display_order: number | null;
          id: string;
          product_id: string;
          related_product_id: string;
        };
        Insert: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          product_id: string;
          related_product_id: string;
        };
        Update: {
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          product_id?: string;
          related_product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey";
            columns: ["related_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey";
            columns: ["related_product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
      shipping_methods: {
        Row: {
          base_price: number;
          carrier: string | null;
          code: string;
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          estimated_days_max: number | null;
          estimated_days_min: number | null;
          free_shipping_threshold: number | null;
          icon_url: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          base_price?: number;
          carrier?: string | null;
          code: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          estimated_days_max?: number | null;
          estimated_days_min?: number | null;
          free_shipping_threshold?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          base_price?: number;
          carrier?: string | null;
          code?: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          estimated_days_max?: number | null;
          estimated_days_min?: number | null;
          free_shipping_threshold?: number | null;
          icon_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          added_at: string | null;
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          added_at?: string | null;
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          added_at?: string | null;
          id?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products_with_primary_image";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      products_with_primary_image: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"] | null;
          bestseller: boolean | null;
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
          min_price: number | null;
          name: string | null;
          primary_image_alt: string | null;
          primary_image_url: string | null;
          published_at: string | null;
          slug: string | null;
          specials: Database["public"]["Enums"]["specials"] | null;
          starting_variant_name: string | null;
          updated_at: string | null;
        };
        Relationships: [];
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
        | "LAMM"
        | "PFERD"
        | "WILD"
        | "LACHS"
        | "HUHN";
      specials: "DIAT" | "HYPOALLERGEN" | "DARM" | "GELENK";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      age_group: ["JUNIOR", "ADULT", "SENIOR"],
      meat_type: [
        "ENTE",
        "RIND",
        "KANINCHEN",
        "LAMM",
        "PFERD",
        "WILD",
        "LACHS",
        "HUHN",
      ],
      specials: ["DIAT", "HYPOALLERGEN", "DARM", "GELENK"],
    },
  },
} as const;
