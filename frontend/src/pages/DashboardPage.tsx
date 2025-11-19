import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { DashboardStats, TransactionWithCustomer, ShopBalance, Transaction } from '@/types'
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, TrendingUp } from 'lucide-react'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalKES: 0,
    totalUSD: 0,
    todayTransactions: 0,
    unclaimedCount: 0,
    unclaimedAmountKES: 0,
    unclaimedAmountUSD: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get shop balances
      const { data: balances } = await supabase
        .from('shop_balances')
        .select('*')
        .returns<ShopBalance[]>()

      // Get today's transactions count
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)

      // Get unclaimed transactions
      const { data: unclaimedData } = await supabase
        .from('transactions')
        .select('*')
        .eq('is_unclaimed', true)
        .returns<Transaction[]>()

      // Get recent transactions with customer info
      const { data: recentData } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const kesBalance = balances?.find(b => b.currency === 'KES')?.total_balance || 0
      const usdBalance = balances?.find(b => b.currency === 'USD')?.total_balance || 0

      const unclaimedKES = unclaimedData?.filter(t => t.currency === 'KES')
        .reduce((sum, t) => sum + t.amount_in - t.amount_out, 0) || 0
      const unclaimedUSD = unclaimedData?.filter(t => t.currency === 'USD')
        .reduce((sum, t) => sum + t.amount_in - t.amount_out, 0) || 0

      setStats({
        totalKES: kesBalance,
        totalUSD: usdBalance,
        todayTransactions: todayCount || 0,
        unclaimedCount: unclaimedData?.length || 0,
        unclaimedAmountKES: unclaimedKES,
        unclaimedAmountUSD: unclaimedUSD,
      })

      setRecentTransactions(recentData || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              KES Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatCurrency(stats.totalKES, 'KES')}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Kenyan Shillings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              USD Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(stats.totalUSD, 'USD')}
            </div>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
              US Dollars
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Today's Transactions
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.todayTransactions}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
              Transactions today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-300">
              Unclaimed
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.unclaimedCount}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
              {formatCurrency(stats.unclaimedAmountKES, 'KES')} + {formatCurrency(stats.unclaimedAmountUSD, 'USD')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.amount_in > 0 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.amount_in > 0 ? (
                        <ArrowDownCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {transaction.customer?.name || 'Unclaimed'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.channel} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount_in > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount_in > 0 ? '+' : '-'}
                      {formatCurrency(
                        transaction.amount_in > 0 ? transaction.amount_in : transaction.amount_out,
                        transaction.currency
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Balance: {formatCurrency(transaction.balance_after, transaction.currency)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
