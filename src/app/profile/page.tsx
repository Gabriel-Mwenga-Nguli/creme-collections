
import type { Metadata } from 'next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, MapPin, Edit3, LogOut } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Profile - Creme Collections',
  description: 'Manage your Creme Collections account details, orders, and preferences.',
};

export default function ProfilePage() {
  // Dummy user data
  const user = {
    name: 'Alex K.',
    email: 'alex.k@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    initials: 'AK',
    joinedDate: 'Joined March 2023',
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <User className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">My Account</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left Sidebar / User Info */}
          <Card className="md:col-span-1 shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture"/>
                <AvatarFallback className="text-2xl bg-muted">{user.initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="text-xs">{user.joinedDate}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10">
                <User className="mr-2 h-4 w-4" /> Personal Information
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10">
                <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Heart className="mr-2 h-4 w-4" /> My Wishlist
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10">
                <MapPin className="mr-2 h-4 w-4" /> Shipping Addresses
              </Button>
              <Separator className="my-2"/>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>

          {/* Right Content Area / Profile Form */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-headline">Edit Profile</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Kamau" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter to change password" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Leave blank to keep current" className="mt-1" />
                </div>
                <div className="pt-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
