import type { Database } from './database.types'

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export type ForexRate = Database['public']['Tables']['forex_rates']['Row']
export type ForexRateInsert = Database['public']['Tables']['forex_rates']['Insert']
export type ForexRateUpdate = Database['public']['Tables']['forex_rates']['Update']

export type ShopBalance = Database['public']['Tables']['shop_balances']['Row']

export type Currency = 'KES' | 'USD'
export type TransactionChannel = 'MPESA' | 'Taaj' | 'Forex' | 'Cash'
export type CustomerType = 'agent' | 'customer' | 'staff'

export interface CustomerWithBalance extends Customer {
  balance: number
  transactionCount: number
}

export interface DashboardStats {
  totalKES: number
  totalUSD: number
  todayTransactions: number
  unclaimedCount: number
  unclaimedAmountKES: number
  unclaimedAmountUSD: number
}

export interface TransactionWithCustomer extends Transaction {
  customer?: Customer | null
}
