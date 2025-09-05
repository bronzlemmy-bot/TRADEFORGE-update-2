import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/lib/auth";
import { 
  Bitcoin, 
  ArrowDownToLine,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  QrCode,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DepositHistory {
  id: string;
  amount: number;
  address: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  network: string;
}

interface WalletData {
  address: string;
  balance: number;
  pendingDeposits: number;
}

export default function DepositBitcoinPage() {
  const [, navigate] = useLocation();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  const { data: walletData, isLoading: walletLoading } = useQuery<WalletData>({
    queryKey: ["/api/wallet/bitcoin"],
    enabled: authService.isAuthenticated(),
  });

  const { data: depositHistory, isLoading: historyLoading } = useQuery<DepositHistory[]>({
    queryKey: ["/api/wallet/bitcoin/deposits"],
    enabled: authService.isAuthenticated(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const copyAddress = async () => {
    if (walletData?.address) {
      await navigator.clipboard.writeText(walletData.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const refreshDeposits = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/wallet/bitcoin/deposits"] });
    queryClient.invalidateQueries({ queryKey: ["/api/wallet/bitcoin"] });
  };

  if (walletLoading || historyLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
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
            <Bitcoin className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Deposit Bitcoin</h1>
          </div>
        </div>
        <Button onClick={refreshDeposits} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Deposit Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Overview */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bitcoin className="w-5 h-5 text-orange-500" />
                <span>Bitcoin Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-2xl font-bold">{walletData?.balance || 0} BTC</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pending Deposits</p>
                  <p className="text-2xl font-bold text-yellow-500">{walletData?.pendingDeposits || 0} BTC</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Address */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Deposit Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Only send Bitcoin (BTC) to this address. Sending any other cryptocurrency will result in permanent loss.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label>Bitcoin Address (BTC Network)</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={walletData?.address || "Loading..."}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={copyAddress}
                      size="icon"
                      variant="outline"
                      disabled={!walletData?.address}
                    >
                      {copiedAddress ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {copiedAddress && (
                    <p className="text-sm text-green-500 mt-1">Address copied to clipboard!</p>
                  )}
                </div>

                <div className="bg-muted/20 rounded-lg p-4 text-sm">
                  <h4 className="font-semibold mb-2">Important Information:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Minimum deposit: 0.0001 BTC</li>
                    <li>• Network: Bitcoin (BTC)</li>
                    <li>• Confirmations required: 3</li>
                    <li>• Estimated arrival: 30-60 minutes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-48 h-48 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your Bitcoin wallet to deposit
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Deposit History */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {depositHistory?.length ? (
                  depositHistory.map((deposit) => (
                    <motion.div
                      key={deposit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{deposit.amount} BTC</span>
                        <Badge
                          variant={
                            deposit.status === 'confirmed' ? 'default' :
                            deposit.status === 'pending' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {deposit.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {deposit.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {deposit.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {deposit.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Network: {deposit.network}</p>
                        {deposit.status === 'pending' && (
                          <p>Confirmations: {deposit.confirmations}/{deposit.requiredConfirmations}</p>
                        )}
                        {deposit.txHash && (
                          <p className="truncate">
                            Tx: {deposit.txHash.slice(0, 16)}...
                          </p>
                        )}
                        <p>{new Date(deposit.createdAt).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ArrowDownToLine className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No deposits yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}