import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authService } from "@/lib/auth";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Settings,
  Bell,
  Smartphone,
  CreditCard,
  Eye,
  Download
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  accountType: string;
  memberSince: string;
  totalTrades: number;
  successRate: number;
  verificationStatus: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Profile() {
  const { data: userProfile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
    enabled: authService.isAuthenticated(),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="glass-card p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">Unable to load profile data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div className="mb-8" {...fadeInUp}>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and trading preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" data-testid="profile-name">
                      {userProfile.fullName}
                    </h3>
                    <p className="text-muted-foreground" data-testid="profile-email">
                      {userProfile.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <div className="mt-1">
                      <Badge variant="default" data-testid="account-type">
                        {userProfile.accountType}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <div className="mt-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span data-testid="member-since">{userProfile.memberSince}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                    <div className="mt-1">
                      <Badge 
                        variant={userProfile.verificationStatus === 'Verified' ? 'default' : 'secondary'}
                        data-testid="verification-status"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {userProfile.verificationStatus}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                    <div className="mt-1" data-testid="last-login">
                      {userProfile.lastLogin}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button data-testid="edit-profile-btn">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="glass-card" data-testid="change-password-btn">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trading Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="total-trades">
                      {userProfile.totalTrades}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent" data-testid="success-rate">
                      {userProfile.successRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Two-Factor Auth</span>
                  </div>
                  <Badge variant={userProfile.twoFactorEnabled ? 'default' : 'secondary'} data-testid="2fa-status">
                    {userProfile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <Button size="sm" variant="outline" className="w-full glass-card" data-testid="manage-security-btn">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Security
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" variant="outline" className="w-full glass-card justify-start" data-testid="notification-settings-btn">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button size="sm" variant="outline" className="w-full glass-card justify-start" data-testid="payment-methods-btn">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button size="sm" variant="outline" className="w-full glass-card justify-start" data-testid="privacy-settings-btn">
                  <Eye className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button size="sm" variant="outline" className="w-full glass-card justify-start" data-testid="export-data-btn">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}