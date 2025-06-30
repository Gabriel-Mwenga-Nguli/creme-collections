
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const mockAddresses = [
  {
    id: '1',
    name: 'Home',
    addressLine1: '123 Riverside Drive, Apt 4B',
    city: 'Nairobi',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Work',
    addressLine1: 'Creme Collections HQ, 456 Business Ave',
    city: 'Nairobi',
    isDefault: false,
  },
];

export default function AddressPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-xl font-headline flex items-center">
                <MapPin className="mr-3 h-6 w-6 text-primary" /> My Addresses
            </CardTitle>
            <CardDescription>Manage your shipping and billing addresses.</CardDescription>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {mockAddresses.length > 0 ? mockAddresses.map((address, index) => (
          <React.Fragment key={address.id}>
            <div className="flex items-start justify-between p-2 rounded-lg hover:bg-muted/50">
                <div>
                    <div className="flex items-center gap-3">
                        <p className="font-semibold text-lg">{address.name}</p>
                        {address.isDefault && <Badge>Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                    <p className="text-sm text-muted-foreground">{address.city}</p>
                </div>
                 <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label="Edit Address">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete Address">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {index < mockAddresses.length - 1 && <Separator />}
          </React.Fragment>
        )) : (
             <div className="text-center py-16">
              <MapPin className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No Addresses Saved</p>
              <p className="text-muted-foreground mb-6">
                Add a new address to get started with faster checkouts.
              </p>
              <Button>
                 <Plus className="mr-2 h-4 w-4" /> Add Address
              </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
