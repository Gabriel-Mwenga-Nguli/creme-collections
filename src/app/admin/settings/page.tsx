
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Save, Store, Bell, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Placeholder for actual settings fetching and saving logic

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [storeName, setStoreName] = useState("Creme Collections");
  const [supportEmail, setSupportEmail] = useState("support@cremecollections.shop");
  // Add more settings states here, e.g., for featured product IDs, banner texts, theme colors

  useEffect(() => {
    document.title = "Store Settings - Admin";
    // Placeholder: Fetch current settings
    // e.g., getStoreSettings().then(settings => { setStoreName(settings.name); ... });
  }, []);

  const handleSaveChanges = (section: string) => {
    // Placeholder: Save settings logic for the specific section
    console.log(`Saving ${section} settings:`, { storeName, supportEmail });
    toast({ title: "Settings Saved", description: `${section} settings have been updated.` });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
          <SettingsIcon className="mr-3 h-7 w-7 text-primary" />
          Store Settings
        </h1>
        <p className="text-muted-foreground text-sm">Manage your store's configuration and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-primary"/>General Settings</CardTitle>
          <CardDescription>Basic information about your store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input id="supportEmail" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          </div>
          {/* Add more general settings fields */}
          <Button onClick={() => handleSaveChanges('General')} size="sm">
            <Save className="mr-2 h-4 w-4"/>Save General Settings
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Notification Settings</CardTitle>
          <CardDescription>Configure email notifications for orders, users, etc. (Placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Notification settings are typically managed via backend configurations or third-party email services. This section is a placeholder for future integration.</p>
          {/* Add notification settings fields here */}
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/>Appearance &amp; Theme (Placeholder)</CardTitle>
          <CardDescription>Customize store colors, logo, and homepage content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground mb-2">
                Primary theme colors are managed in <code>src/app/globals.css</code>. For more dynamic theme control, a theme editor or database-driven settings would be needed.
            </p>
            <div>
                <Label htmlFor="featuredProductIds">Featured Product IDs (Comma-separated)</Label>
                <Input id="featuredProductIds" placeholder="prodId1,prodId2,prodId3" />
                <p className="text-xs text-muted-foreground mt-1">These IDs would be used to populate the "Featured Products" section on the homepage.</p>
            </div>
             <div>
                <Label htmlFor="promoBannerText">Promotional Banner Text (Homepage)</Label>
                <Textarea id="promoBannerText" placeholder="e.g., Big Summer Sale! Up to 50% off." rows={2} />
            </div>
            <Button onClick={() => handleSaveChanges('Appearance')} size="sm" disabled> {/* Disabled as it's placeholder */}
                <Save className="mr-2 h-4 w-4"/>Save Appearance Settings (Placeholder)
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
