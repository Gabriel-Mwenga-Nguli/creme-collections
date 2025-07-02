
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { getUserAddresses, type Address } from '@/services/addressService';

export default function AddressPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAddresses() {
      if (user) {
        setIsLoading(true);
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);
        setIsLoading(false);
      }
    }
    fetchAddresses();
  }, [user]);

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
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((address, index) => (
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
              {index < addresses.length - 1 && <Separator />}
            </React.Fragment>
          ))
        ) : (
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
