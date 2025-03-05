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
      account_transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          status: Database["public"]["Enums"]["transaction_status_enum"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "merchant_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          branch_code: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          merchant_id: string | null
          routing_number: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          branch_code?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          merchant_id?: string | null
          routing_number?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          branch_code?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          merchant_id?: string | null
          routing_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_favorites: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discounts: {
        Row: {
          apply_to: Database["public"]["Enums"]["apply_to_enum"] | null
          code: string | null
          created_at: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type_enum"]
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_purchase_amount: number | null
          name: string
          starts_at: string | null
          store_id: string | null
          target_id: string | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          apply_to?: Database["public"]["Enums"]["apply_to_enum"] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type_enum"]
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name: string
          starts_at?: string | null
          store_id?: string | null
          target_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          apply_to?: Database["public"]["Enums"]["apply_to_enum"] | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type_enum"]
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name?: string
          starts_at?: string | null
          store_id?: string | null
          target_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discounts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          feedback_type:
            | Database["public"]["Enums"]["feedback_type_enum"]
            | null
          id: string
          message: string
          status: Database["public"]["Enums"]["feedback_status_enum"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Insert: {
          created_at?: string | null
          feedback_type?:
            | Database["public"]["Enums"]["feedback_type_enum"]
            | null
          id?: string
          message: string
          status?: Database["public"]["Enums"]["feedback_status_enum"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Update: {
          created_at?: string | null
          feedback_type?:
            | Database["public"]["Enums"]["feedback_type_enum"]
            | null
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["feedback_status_enum"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Relationships: []
      }
      merchant_accounts: {
        Row: {
          available_balance: number | null
          created_at: string | null
          currency: string | null
          current_balance: number | null
          id: string
          merchant_id: string | null
          pending_balance: number | null
          store_id: string | null
          updated_at: string | null
        }
        Insert: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          merchant_id?: string | null
          pending_balance?: number | null
          store_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          merchant_id?: string | null
          pending_balance?: number | null
          store_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_accounts_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_accounts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_stores: {
        Row: {
          created_at: string | null
          id: string
          merchant_id: string | null
          role: Database["public"]["Enums"]["role_enum"]
          store_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          role: Database["public"]["Enums"]["role_enum"]
          store_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_stores_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          kyc_level: Database["public"]["Enums"]["kyc_level_enum"] | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          kyc_level?: Database["public"]["Enums"]["kyc_level_enum"] | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_level?: Database["public"]["Enums"]["kyc_level_enum"] | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_discount_amount: number | null
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_discount_amount?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_discount_amount?: number | null
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          discount_id: string | null
          id: string
          notes: string | null
          order_number: string
          payment_details: Json | null
          payment_method:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_provider_id: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_method: string | null
          status: Database["public"]["Enums"]["order_status_enum"] | null
          store_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_id?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_details?: Json | null
          payment_method?:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_provider_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: Database["public"]["Enums"]["order_status_enum"] | null
          store_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          discount_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_details?: Json | null
          payment_method?:
            | Database["public"]["Enums"]["payment_method_enum"]
            | null
          payment_provider_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: Database["public"]["Enums"]["order_status_enum"] | null
          store_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payment_provider_id_fkey"
            columns: ["payment_provider_id"]
            isOneToOne: false
            referencedRelation: "payment_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_providers: {
        Row: {
          configs: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          provider_type: Database["public"]["Enums"]["provider_type_enum"]
          updated_at: string | null
        }
        Insert: {
          configs?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          provider_type: Database["public"]["Enums"]["provider_type_enum"]
          updated_at?: string | null
        }
        Update: {
          configs?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          provider_type?: Database["public"]["Enums"]["provider_type_enum"]
          updated_at?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          id: string
          inventory_count: number | null
          is_active: boolean | null
          name: string
          options: Json
          price_adjustment: number | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_count?: number | null
          is_active?: boolean | null
          name: string
          options: Json
          price_adjustment?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_count?: number | null
          is_active?: boolean | null
          name?: string
          options?: Json
          price_adjustment?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          inventory_count: number | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          sale_price: number | null
          store_id: string | null
          subcategory: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          inventory_count?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          sale_price?: number | null
          store_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          inventory_count?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          sale_price?: number | null
          store_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string | null
          reason: string | null
          refund_details: Json | null
          refund_method: string | null
          status: Database["public"]["Enums"]["refund_status_enum"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          reason?: string | null
          refund_details?: Json | null
          refund_method?: string | null
          status?: Database["public"]["Enums"]["refund_status_enum"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          reason?: string | null
          refund_details?: Json | null
          refund_method?: string | null
          status?: Database["public"]["Enums"]["refund_status_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          order_id: string | null
          product_id: string | null
          rating: number
          store_id: string | null
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating: number
          store_id?: string | null
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string | null
          rating?: number
          store_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_payment_providers: {
        Row: {
          configs: Json | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          is_payout_account: boolean | null
          is_phone_verified: boolean | null
          mobile_number: string | null
          provider_id: string | null
          provider_merchant_id: string | null
          store_id: string | null
          updated_at: string | null
        }
        Insert: {
          configs?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          is_payout_account?: boolean | null
          is_phone_verified?: boolean | null
          mobile_number?: string | null
          provider_id?: string | null
          provider_merchant_id?: string | null
          store_id?: string | null
          updated_at?: string | null
        }
        Update: {
          configs?: Json | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          is_payout_account?: boolean | null
          is_phone_verified?: boolean | null
          mobile_number?: string | null
          provider_id?: string | null
          provider_merchant_id?: string | null
          store_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_payment_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "payment_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_payment_providers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          category: string
          contact_email: string | null
          contact_phone: string | null
          coordinates: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          name: string
          social_links: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name: string
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name?: string
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          message: string
          request_id: string | null
          sender_id: string | null
          sender_type: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message: string
          request_id?: string | null
          sender_id?: string | null
          sender_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          message?: string
          request_id?: string | null
          sender_id?: string | null
          sender_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "support_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          message: string
          priority: Database["public"]["Enums"]["priority_enum"] | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: Database["public"]["Enums"]["support_status_enum"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
          user_type: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: Database["public"]["Enums"]["priority_enum"] | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: Database["public"]["Enums"]["support_status_enum"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: Database["public"]["Enums"]["priority_enum"] | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: Database["public"]["Enums"]["support_status_enum"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: Database["public"]["Enums"]["user_type_enum"] | null
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
      apply_to_enum: "store" | "category" | "product"
      discount_type_enum: "percentage" | "fixed_amount"
      feedback_status_enum:
        | "new"
        | "reviewed"
        | "in_progress"
        | "resolved"
        | "closed"
      feedback_type_enum:
        | "feature_request"
        | "bug_report"
        | "general"
        | "suggestion"
      kyc_level_enum: "level1" | "level2" | "level3"
      order_status_enum:
        | "pending"
        | "paid"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method_enum: "mobile_money" | "card" | "cash"
      payment_status_enum: "pending" | "completed" | "failed" | "refunded"
      priority_enum: "low" | "medium" | "high" | "critical"
      provider_type_enum:
        | "mobile_money"
        | "card"
        | "bank"
        | "e-wallet"
        | "other"
      refund_status_enum: "pending" | "approved" | "rejected" | "completed"
      role_enum: "owner" | "member"
      support_status_enum: "open" | "in_progress" | "resolved" | "closed"
      transaction_status_enum: "pending" | "completed" | "failed" | "cancelled"
      transaction_type_enum: "sale" | "refund" | "payout" | "adjustment" | "fee"
      user_type_enum: "merchant" | "customer"
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
