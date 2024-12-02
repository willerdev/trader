import { useState, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle } from 'lucide-react'
import { getMarketData, MarketTicker } from '../services/alpacaService'

// Most traded stocks on the market
const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META',
  'TSLA', 'NVDA', 'JPM', 'V', 'WMT',
  'JNJ', 'UNH', 'BAC', 'PG', 'HD',
  'MA', 'XOM', 'DIS', 'NFLX', 'ADBE'
]

const Markets = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketTicker>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchMarketData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const data = await getMarketData(DEFAULT_SYMBOLS)
      setMarketData(data)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(`Failed to fetch market data: ${errorMessage}. Please check your internet connection and try again.`)
    } finally {
      setIsLoading(false)
      if (showRefreshing) setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(() => fetchMarketData(), 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchMarketData(true)
  }

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const filteredSymbols = DEFAULT_SYMBOLS.filter(symbol =>
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-4">Markets</h2>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Markets</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredSymbols.map(symbol => {
            const data = marketData[symbol]
            const price = data?.latestTrade?.price

            return (
              <div key={symbol} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="font-medium text-gray-900">{symbol}</span>
                <span className="font-medium">{formatCurrency(price)}</span>
              </div>
            )
          })}

          {filteredSymbols.length === 0 && (
            <div className="px-4 py-3 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Markets