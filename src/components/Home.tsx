import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { getAccount, getPositions, Position } from '../services/alpacaService'

interface AccountInfo {
  portfolio_value: number
  buying_power: number
  cash: number
}

const Home = () => {
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const [accountData, positionsData] = await Promise.all([
        getAccount(),
        getPositions()
      ])
      setAccount(accountData)
      setPositions(positionsData)
      setError('')
    } catch (err) {
      setError('Failed to fetch trading data')
      console.error(err)
    } finally {
      setIsLoading(false)
      if (showRefreshing) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Set up interval to refresh data every 10 seconds
    const interval = setInterval(() => fetchData(), 10000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100)
  }

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Dashboard</h2>
        <button
          onClick={() => fetchData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          <Clock className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <span className="text-sm text-gray-600">Portfolio Value</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(account.portfolio_value)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <span className="text-sm text-gray-600">Buying Power</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(account.buying_power)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="text-purple-600" size={20} />
              </div>
              <span className="text-sm text-gray-600">Cash Balance</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(account.cash)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Current Positions</h3>
        </div>
        <div className="overflow-x-auto">
          {positions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No active positions
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Symbol</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Current Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Market Value</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Avg Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.map((position) => {
                  const profitLoss = ((position.current_price - position.avg_entry_price) / position.avg_entry_price) * 100
                  const isProfit = profitLoss >= 0

                  return (
                    <tr key={position.symbol}>
                      <td className="px-4 py-3 text-sm font-medium">{position.symbol}</td>
                      <td className="px-4 py-3 text-sm text-right">{position.qty}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(position.current_price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(position.market_value)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          {formatCurrency(position.avg_entry_price)}
                          <span className={`${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                            ({isProfit ? '+' : ''}{formatPercent(profitLoss)})
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home