import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartWidget } from "@/components/chart-widget";
import { authService } from "@/lib/auth";
import { 
  BarChart3,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap
} from "lucide-react";

interface MarketAnalysis {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  analysis: {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    supportLevel: number;
    resistanceLevel: number;
    rsi: number;
    macd: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  };
  news: Array<{
    title: string;
    summary: string;
    impact: 'positive' | 'negative' | 'neutral';
    timestamp: string;
  }>;
}

interface MarketIndices {
  sp500: { value: number; change: number; };
  nasdaq: { value: number; change: number; };
  dow: { value: number; change: number; };
  vix: { value: number; change: number; };
}

export default function MarketAnalysisPage() {
  const [, navigate] = useLocation();
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  const { data: marketData, isLoading } = useQuery<MarketAnalysis[]>({
    queryKey: ["/api/market/analysis"],
    enabled: authService.isAuthenticated(),
    refetchInterval: 30000,
  });

  const { data: indices } = useQuery<MarketIndices>({
    queryKey: ["/api/market/indices"],
    enabled: authService.isAuthenticated(),
    refetchInterval: 60000,
  });

  const selectedStock = marketData?.find(stock => stock.symbol === selectedSymbol) || marketData?.[0];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Market Analysis</h1>
          </div>
        </div>
      </div>

      {/* Market Indices Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {indices && Object.entries(indices).map(([key, data]) => (
          <Card key={key} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase">{key}</p>
                  <p className="text-lg font-bold">{data.value.toLocaleString()}</p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  data.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {data.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {data.change >= 0 ? '+' : ''}{data.change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Stock List */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Top Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {marketData?.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSymbol === stock.symbol
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/20 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${stock.price}</p>
                        <p className={`text-xs ${
                          stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {selectedStock && (
            <>
              {/* Stock Header */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                      <p className="text-muted-foreground">{selectedStock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${selectedStock.price.toLocaleString()}</p>
                      <div className={`flex items-center space-x-1 ${
                        selectedStock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedStock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>
                          {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} 
                          ({selectedStock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Tabs */}
              <Tabs defaultValue="analysis" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
                  <TabsTrigger value="chart">Price Chart</TabsTrigger>
                  <TabsTrigger value="news">Market News</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Recommendation */}
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>AI Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                selectedStock.analysis.recommendation === 'BUY' ? 'default' :
                                selectedStock.analysis.recommendation === 'SELL' ? 'destructive' :
                                'secondary'
                              }
                              className="text-lg px-4 py-2"
                            >
                              {selectedStock.analysis.recommendation === 'BUY' && <TrendingUp className="w-4 h-4 mr-2" />}
                              {selectedStock.analysis.recommendation === 'SELL' && <TrendingDown className="w-4 h-4 mr-2" />}
                              {selectedStock.analysis.recommendation === 'HOLD' && <Activity className="w-4 h-4 mr-2" />}
                              {selectedStock.analysis.recommendation}
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Confidence</p>
                              <p className="text-xl font-bold">{selectedStock.analysis.confidence}%</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Sentiment:</span>
                              <Badge variant={
                                selectedStock.analysis.sentiment === 'Bullish' ? 'default' :
                                selectedStock.analysis.sentiment === 'Bearish' ? 'destructive' :
                                'secondary'
                              }>
                                {selectedStock.analysis.sentiment}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Indicators */}
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Technical Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Support Level</p>
                              <p className="text-lg font-bold text-green-500">
                                ${selectedStock.analysis.supportLevel}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Resistance Level</p>
                              <p className="text-lg font-bold text-red-500">
                                ${selectedStock.analysis.resistanceLevel}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>RSI (14):</span>
                              <span className={`font-medium ${
                                selectedStock.analysis.rsi > 70 ? 'text-red-500' :
                                selectedStock.analysis.rsi < 30 ? 'text-green-500' :
                                'text-muted-foreground'
                              }`}>
                                {selectedStock.analysis.rsi}
                                {selectedStock.analysis.rsi > 70 && ' (Overbought)'}
                                {selectedStock.analysis.rsi < 30 && ' (Oversold)'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>MACD:</span>
                              <span className={`font-medium ${
                                selectedStock.analysis.macd === 'Bullish' ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {selectedStock.analysis.macd}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="chart">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Price Chart - {selectedStock.symbol}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartWidget height={400} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="news">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Market News</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedStock.news.map((newsItem, index) => (
                          <div key={index} className="border-l-4 border-l-primary/20 pl-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{newsItem.title}</h4>
                              <Badge
                                variant={
                                  newsItem.impact === 'positive' ? 'default' :
                                  newsItem.impact === 'negative' ? 'destructive' :
                                  'secondary'
                                }
                              >
                                {newsItem.impact === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                                {newsItem.impact === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                                {newsItem.impact === 'neutral' && <Activity className="w-3 h-3 mr-1" />}
                                {newsItem.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{newsItem.summary}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(newsItem.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}