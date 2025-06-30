
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Shield, Loader2, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { manageLoyaltyPoints } from '@/ai/flows/loyalty-points-flow';

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, userProfile, isLoading, updateUserProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(userProfile?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [isLoading, user, userProfile, router]);

  const handleProfileUpdate = async () => {
    if (!name.trim()) {
      toast({ title: 'Name cannot be empty', variant: 'destructive' });
      return;
    }
    if (!user) {
        toast({ title: 'User not found', variant: 'destructive' });
        return;
    }
    setIsSaving(true);
    
    // Simulate updating profile in the main auth context
    updateUserProfile({ name });
    
    try {
        // After updating, call the AI flow to award points
        const loyaltyResponse = await manageLoyaltyPoints({
            userId: user.uid,
            activityType: 'profile_update',
        });
        toast({
            title: 'Profile Updated Successfully!',
            description: `You've earned ${loyaltyResponse.pointsChange} loyalty points.`,
            action: <Award className="h-5 w-5 text-yellow-500" />,
        });
    } catch(error) {
        console.error("Failed to award loyalty points:", error);
        toast({
            title: 'Profile Updated',
            description: 'Your personal details have been saved, but there was an issue awarding loyalty points.',
            variant: 'default' // Still a success, but with a note
        });
    }

    setIsSaving(false);
  };

  const handlePasswordUpdate = async () => {
    toast({
      title: 'Update Simulated',
      description: 'In a real app, this would change your password.',
    });
  };

  if (isLoading || !user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
          <CardDescription>Manage your personal details. Click "Save Changes" to update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={userProfile.email} disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" />
          </div>
        </CardContent>
         <CardFooter>
            <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </CardFooter>
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
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>
           <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
