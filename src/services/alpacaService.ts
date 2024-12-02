const API_KEY = import.meta.env.VITE_ALPACA_API_KEY
const API_SECRET = import.meta.env.VITE_ALPACA_API_SECRET
const API_URL = import.meta.env.VITE_ALPACA_API_URL

const headers = {
  'APCA-API-KEY-ID': API_KEY,
  'APCA-API-SECRET-KEY': API_SECRET,
  'Content-Type': 'application/json'
}

export interface Position {
  symbol: string
  qty: number
  market_value: number
  avg_entry_price: number
  current_price: number
}

export interface Order {
  id: string
  client_order_id: string
  created_at: string
  updated_at: string
  submitted_at: string
  filled_at: string | null
  expired_at: string | null
  canceled_at: string | null
  failed_at: string | null
  replaced_at: string | null
  replaced_by: string | null
  replaces: string | null
  asset_id: string
  symbol: string
  asset_class: string
  notional: string | null
  qty: string
  filled_qty: string
  filled_avg_price: string | null
  order_class: string
  order_type: string
  type: string
  side: string
  time_in_force: string
  limit_price: string | null
  stop_price: string | null
  status: string
  extended_hours: boolean
  legs: any[] | null
  trail_percent: string | null
  trail_price: string | null
  hwm: string | null
}

export interface MarketOrder {
  symbol: string
  qty: number
  side: 'buy' | 'sell'
  type: 'market'
  time_in_force: 'day'
}

export interface MarketTicker {
  symbol: string
  latestTrade?: {
    price: number
    timestamp: string
  }
  prevDailyBar?: {
    close: number
  }
  dailyBar?: {
    open: number
    high: number
    low: number
    close: number
    volume: number
  }
  minuteBar?: {
    open: number
    high: number
    low: number
    close: number
    volume: number
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.text()
    let errorMessage = `HTTP error! status: ${response.status}`
    try {
      const errorJson = JSON.parse(errorBody)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // If the error body isn't JSON, use the raw text
      errorMessage = errorBody || errorMessage
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

// Retry logic helper
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      return await handleResponse(response)
    } catch (error) {
      if (i === retries - 1) throw error // Last retry failed
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))) // Exponential backoff
    }
  }
}

export const getAccount = async () => {
  try {
    return await fetchWithRetry(`${API_URL}/v2/account`, { method: 'GET', headers })
  } catch (error) {
    console.error('Error fetching account:', error)
    throw new Error('Failed to fetch account data. Please try again later.')
  }
}

export const getPositions = async (): Promise<Position[]> => {
  try {
    return await fetchWithRetry(`${API_URL}/v2/positions`, { method: 'GET', headers })
  } catch (error) {
    console.error('Error fetching positions:', error)
    throw new Error('Failed to fetch positions. Please try again later.')
  }
}

export const getOrders = async (status: 'open' | 'closed' | 'all' = 'all'): Promise<Order[]> => {
  try {
    const url = `${API_URL}/v2/orders?status=${status}&limit=50`
    return await fetchWithRetry(url, { method: 'GET', headers })
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders. Please try again later.')
  }
}

export const placeOrder = async (orderData: MarketOrder) => {
  try {
    return await fetchWithRetry(
      `${API_URL}/v2/orders`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      }
    )
  } catch (error) {
    console.error('Error placing order:', error)
    throw new Error('Failed to place order. Please check your input and try again.')
  }
}

export const getBars = async (symbol: string, timeframe: string = '1D') => {
  try {
    const endDate = new Date()
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const data = await fetchWithRetry(
      `${API_URL}/v2/stocks/${symbol}/bars?` + 
      `start=${startDate.toISOString()}&` +
      `end=${endDate.toISOString()}&` +
      `timeframe=${timeframe}`,
      { method: 'GET', headers }
    )
    return data.bars || []
  } catch (error) {
    console.error('Error fetching bars:', error)
    throw new Error(`Failed to fetch price history for ${symbol}. Please try again later.`)
  }
}

export const getMarketData = async (symbols: string[]): Promise<Record<string, MarketTicker>> => {
  try {
    // Validate input
    if (!symbols || symbols.length === 0) {
      throw new Error('No symbols provided')
    }

    // Check for API credentials
    if (!API_KEY || !API_SECRET) {
      throw new Error('API credentials are not configured')
    }

    const data = await fetchWithRetry(
      `${API_URL}/v2/stocks/snapshots?symbols=${symbols.join(',')}`,
      { method: 'GET', headers }
    )

    // Validate response data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API')
    }

    // Process and validate each ticker
    const processedData: Record<string, MarketTicker> = {}
    for (const symbol of symbols) {
      const rawData = data[symbol]
      if (rawData) {
        processedData[symbol] = {
          symbol,
          latestTrade: rawData.latestTrade ? {
            price: Number(rawData.latestTrade.price) || 0,
            timestamp: rawData.latestTrade.timestamp || new Date().toISOString()
          } : undefined,
          prevDailyBar: rawData.prevDailyBar ? {
            close: Number(rawData.prevDailyBar.close) || 0
          } : undefined,
          dailyBar: rawData.dailyBar ? {
            open: Number(rawData.dailyBar.open) || 0,
            high: Number(rawData.dailyBar.high) || 0,
            low: Number(rawData.dailyBar.low) || 0,
            close: Number(rawData.dailyBar.close) || 0,
            volume: Number(rawData.dailyBar.volume) || 0
          } : undefined,
          minuteBar: rawData.minuteBar ? {
            open: Number(rawData.minuteBar.open) || 0,
            high: Number(rawData.minuteBar.high) || 0,
            low: Number(rawData.minuteBar.low) || 0,
            close: Number(rawData.minuteBar.close) || 0,
            volume: Number(rawData.minuteBar.volume) || 0
          } : undefined
        }
      }
    }

    return processedData
  } catch (error) {
    console.error('Error fetching market data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to fetch market data: ${errorMessage}`)
  }
}