
"use client";

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
                <MapPin className="mr-2 h-5 w-5 text-primary" /> My Addresses
            </CardTitle>
            <CardDescription>Manage your shipping and billing addresses.</CardDescription>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAddresses.map((address, index) => (
          <React.Fragment key={address.id}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{address.name}</p>
                        {address.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                    <p className="text-sm text-muted-foreground">{address.city}</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {index < mockAddresses.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
