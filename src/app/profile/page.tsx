
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Award, Edit, Loader2, Camera, Heart, ListOrdered, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function MyAccountPage() {
  const { toast } = useToast();
  const { user, userProfile, isLoading, updateUserProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userProfile?.name || '');
  const [profilePic, setProfilePic] = useState<string | null>(userProfile?.photoURL || null);

  useEffect(() => {
    setName(userProfile?.name || '');
    setProfilePic(userProfile?.photoURL || null);
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userProfile) {
    router.push('/login');
    return null;
  }

  const handleProfileUpdate = () => {
    updateUserProfile({ name, photoURL: profilePic });
    toast({
      title: `Profile Updated`,
      description: `Your profile details have been updated.`,
    });
  };

  const handlePasswordUpdate = () => {
    toast({
      title: `Update Simulated`,
      description: `Password details have been "updated" for this session.`,
    });
  }

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        updateUserProfile({ photoURL: reader.result as string });
        toast({ title: 'Picture Updated!', description: 'Your profile picture has been changed.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex flex-col items-center justify-center text-center bg-secondary text-secondary-foreground p-4">
              <ListOrdered className="h-8 w-8 mb-2"/>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs">Total Orders</p>
          </Card>
           <Card className="flex flex-col items-center justify-center text-center bg-primary/10 text-primary p-4">
              <Heart className="h-8 w-8 mb-2"/>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs">Wishlist Items</p>
          </Card>
           <Card className="flex flex-col items-center justify-center text-center bg-accent/10 text-accent p-4">
              <Award className="h-8 w-8 mb-2"/>
              <p className="text-2xl font-bold">1,250</p>
              <p className="text-xs">Loyalty Points</p>
          </Card>
      </div>

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
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" />
          </div>
        </CardContent>
         <CardFooter>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
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
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
