
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Award, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyAccountPage() {
  const { toast } = useToast();
  const { user, userProfile, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userProfile) {
    // This should ideally not happen if layout protects the route, but as a fallback:
    router.push('/login');
    return null;
  }

  const handleUpdate = (feature: string) => {
    toast({
      title: `Update Simulated`,
      description: `${feature} details have been "updated" for this session.`,
    });
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
          <CardDescription>Manage your personal details. Click "Save" to simulate an update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={userProfile.name} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={userProfile.email} disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" />
          </div>
          <Button onClick={() => handleUpdate('Profile')}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" /> Loyalty Program
          </CardTitle>
          <CardDescription>Your loyalty points balance.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-4xl font-bold text-primary">1,250 Points</div>
          <Button variant="outline">Redeem Points</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" /> Account Security
          </CardTitle>
          <CardDescription>Change your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <Button onClick={() => handleUpdate('Password')}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
