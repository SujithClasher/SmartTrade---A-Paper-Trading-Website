import { TradeView } from '@/components/trade/trade-view'

export default function TradePage({ params }: { params: { symbol: string } }) {
  return <TradeView symbol={params.symbol.toUpperCase()} />
}
