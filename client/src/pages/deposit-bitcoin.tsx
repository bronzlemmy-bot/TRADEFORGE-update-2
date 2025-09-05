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

          {/* Enhanced QR Code and Instructions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>QR Code & Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-orange-200 dark:border-orange-800">
                    <QrCode className="w-24 h-24 text-orange-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Scan this QR code with your Bitcoin wallet to deposit
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Generate New QR Code
                  </Button>
                </div>
                
                {/* Step-by-step Instructions */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Bitcoin className="w-4 h-4 mr-2 text-orange-500" />
                    How to Deposit Bitcoin
                  </h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                      <span>Open your Bitcoin wallet app</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                      <span>Scan the QR code or copy the address above</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                      <span>Enter the amount you want to deposit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                      <span>Confirm and send the transaction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
                      <span>Wait for 3 confirmations (usually 30-60 minutes)</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Enhanced Deposit History & Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Deposit Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-2xl font-bold text-green-600">0.02443</p>
                  <p className="text-sm text-muted-foreground">Total Deposited (BTC)</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-muted-foreground">Successful Deposits</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Deposit History */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Deposits</CardTitle>
                <Button variant="outline" size="sm" onClick={refreshDeposits}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {depositHistory?.length ? (
                  depositHistory.map((deposit) => (
                    <motion.div
                      key={deposit.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-3 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                            <Bitcoin className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{deposit.amount} BTC</p>
                            <p className="text-sm text-muted-foreground">
                              ${(deposit.amount * 43250).toFixed(2)} USD
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            deposit.status === 'confirmed' ? 'default' :
                            deposit.status === 'pending' ? 'secondary' :
                            'destructive'
                          }
                          className="flex items-center space-x-1"
                        >
                          {deposit.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                          {deposit.status === 'pending' && <Clock className="w-3 h-3" />}
                          {deposit.status === 'failed' && <XCircle className="w-3 h-3" />}
                          <span>{deposit.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground bg-muted/20 rounded p-3">
                        <div className="flex justify-between">
                          <span>Network:</span>
                          <span className="font-medium">{deposit.network}</span>
                        </div>
                        {deposit.status === 'pending' && (
                          <div className="flex justify-between">
                            <span>Confirmations:</span>
                            <span className="font-medium text-yellow-600">
                              {deposit.confirmations}/{deposit.requiredConfirmations}
                            </span>
                          </div>
                        )}
                        {deposit.txHash && (
                          <div className="flex justify-between">
                            <span>Transaction:</span>
                            <span className="font-mono text-xs">
                              {deposit.txHash.slice(0, 16)}...
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span>{new Date(deposit.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
                      <ArrowDownToLine className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-medium mb-2">No deposits yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your Bitcoin deposits will appear here
                    </p>
                    <Button variant="outline" size="sm">
                      Learn How to Deposit
                    </Button>
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