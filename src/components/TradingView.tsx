import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import { getBars } from '../services/alpacaService'

interface TradingViewProps {
  symbol: string
  isLandscape: boolean
}

const TradingView = ({ symbol, isLandscape }: TradingViewProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0.1)',
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.1)',
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      crosshair: {
        vertLine: {
          width: 1,
          color: 'rgba(42, 46, 57, 0.3)',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: 'rgba(42, 46, 57, 0.3)',
          style: 3,
        },
      },
    })

    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    const loadData = async () => {
      try {
        const bars = await getBars(symbol)
        if (!bars || bars.length === 0) {
          throw new Error('No trading data available')
        }
        
        const chartData = bars.map((bar: any) => ({
          time: bar.Timestamp,
          open: bar.OpenPrice,
          high: bar.HighPrice,
          low: bar.LowPrice,
          close: bar.ClosePrice,
        }))
        candlestickSeries.setData(chartData)
        
        // Fit the content after data is loaded
        chart.current.timeScale().fitContent()
      } catch (error) {
        console.error('Error loading chart data:', error)
        throw error // Propagate error to parent component
      }
    }

    loadData()

    const handleResize = () => {
      if (chartContainerRef.current && chart.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.current?.remove()
    }
  }, [symbol])

  // Update chart dimensions when orientation changes
  useEffect(() => {
    if (chart.current && chartContainerRef.current) {
      chart.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      })
      chart.current.timeScale().fitContent()
    }
  }, [isLandscape])

  return (
    <div ref={chartContainerRef} className="w-full h-full" />
  )
}

export default TradingView