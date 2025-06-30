
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, User, BarChart2, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OrderHistoryChart from '@/components/features/profile/OrderHistoryChart';
import ProfileStatCard from '@/components/features/profile/ProfileStatCard';

export default function ProfileDashboardPage() {
  const { toast } = useToast();
  const { user, userProfile, isLoading, updateUserProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotoURL = reader.result as string;
        updateUserProfile({ photoURL: newPhotoURL });
        toast({ title: 'Picture Updated!', description: 'Your new profile picture has been saved.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  if (isLoading || !user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-4 border-primary/20">
                            <AvatarImage src={userProfile.photoURL || undefined} alt={userProfile.name} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">
                                {getInitials(userProfile.name)}
                            </AvatarFallback>
                        </Avatar>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 h-full w-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                           <Camera className="h-8 w-8"/>
                           <span className="sr-only">Upload picture</span>
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePictureUpload}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                    </div>
                    <CardTitle className="text-2xl font-headline mt-4">{userProfile.name}</CardTitle>
                    <CardDescription>{userProfile.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button variant="outline" onClick={() => router.push('/profile/settings')}>
                        <User className="mr-2 h-4 w-4"/> Edit Profile
                    </Button>
                </CardContent>
            </Card>
            <ProfileStatCard icon={Award} title="Loyalty Status" value="Gold Tier" description="1,250 Points" />
        </div>
        <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-primary" /> Spending Insights
                    </CardTitle>
                    <CardDescription>Your mock spending summary over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] pl-0">
                    <OrderHistoryChart />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
