import { useState, useEffect } from 'react'
import TradingView from './TradingView'
import { LayoutTemplate, LayoutGrid, AlertCircle, RefreshCw } from 'lucide-react'
import { getBars } from '../services/alpacaService'

const Trading = () => {
  const [symbol] = useState('AAPL')
  const [isLandscape, setIsLandscape] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleRetry = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await getBars(symbol) // Test API connection
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load trading data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleRetry()
  }, [symbol])

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Trading View</h2>
        <div className="flex gap-2">
          {error && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              <span>Retry</span>
            </button>
          )}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            {isLandscape ? (
              <>
                <LayoutGrid size={20} />
                <span>Portrait</span>
              </>
            ) : (
              <>
                <LayoutTemplate size={20} />
                <span>Landscape</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`bg-white rounded-lg shadow ${isLandscape ? 'h-[calc(100vh-12rem)]' : 'h-[500px]'}`}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <RefreshCw size={24} className="text-blue-600" />
              </div>
              <p className="text-gray-600">Loading trading data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Unable to Load Trading Data</h3>
                <p className="text-gray-600 max-w-md">
                  {error}. This might be due to network issues or API limitations. Please try again later.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <TradingView symbol={symbol} isLandscape={isLandscape} />
        )}
      </div>
    </div>
  )
}

export default Trading