export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          type: 'agent' | 'customer' | 'staff'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          type: 'agent' | 'customer' | 'staff'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          type?: 'agent' | 'customer' | 'staff'
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          date: string
          customer_id: string | null
          channel: 'MPESA' | 'Taaj' | 'Forex' | 'Cash'
          amount_in: number
          amount_out: number
          balance_after: number
          currency: 'KES' | 'USD'
          remarks: string | null
          is_unclaimed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          date?: string
          customer_id?: string | null
          channel: 'MPESA' | 'Taaj' | 'Forex' | 'Cash'
          amount_in?: number
          amount_out?: number
          balance_after?: number
          currency: 'KES' | 'USD'
          remarks?: string | null
          is_unclaimed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          customer_id?: string | null
          channel?: 'MPESA' | 'Taaj' | 'Forex' | 'Cash'
          amount_in?: number
          amount_out?: number
          balance_after?: number
          currency?: 'KES' | 'USD'
          remarks?: string | null
          is_unclaimed?: boolean
          created_at?: string
        }
      }
      forex_rates: {
        Row: {
          id: string
          date: string
          usd_to_kes: number
          kes_to_usd: number
          created_at: string
        }
        Insert: {
          id?: string
          date?: string
          usd_to_kes: number
          kes_to_usd: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          usd_to_kes?: number
          kes_to_usd?: number
          created_at?: string
        }
      }
      shop_balances: {
        Row: {
          id: string
          currency: 'KES' | 'USD'
          total_balance: number
          last_updated: string
        }
        Insert: {
          id?: string
          currency: 'KES' | 'USD'
          total_balance?: number
          last_updated?: string
        }
        Update: {
          id?: string
          currency?: 'KES' | 'USD'
          total_balance?: number
          last_updated?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_all_balances: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
