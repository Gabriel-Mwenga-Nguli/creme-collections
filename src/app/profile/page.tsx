
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Award, Edit, Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
          <CardDescription>Manage your personal details. Click "Save" to simulate an update.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePic || undefined} alt={name} />
              <AvatarFallback className="text-2xl">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" /> Change Picture
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureUpload}
              className="hidden"
              accept="image/png, image/jpeg"
            />
          </div>
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
          <Button onClick={handleProfileUpdate}>Save Changes</Button>
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
          <Button onClick={handlePasswordUpdate}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
