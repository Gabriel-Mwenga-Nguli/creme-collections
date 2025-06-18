
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Search, Eye } from 'lucide-react';
// import { getAllUsersForAdmin, type AdminUserView } from '@/services/adminService'; // Assuming this service exists
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

// Placeholder type - replace with actual AdminUserView from service
interface AdminUserView {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  creationTime: string | null; // Assuming ISO string or similar from service
  lastSignInTime: string | null; // Assuming ISO string or similar
  orderCount?: number; // Example additional field
  totalSpent?: number; // Example additional field
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminUserView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = "Manage Customers - Admin";
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        // const fetchedCustomers = await getAllUsersForAdmin();
        // For now, using placeholder data as getAllUsersForAdmin is complex
        const placeholderCustomers: AdminUserView[] = [
          { id: 'user1', email: 'customer1@example.com', displayName: 'Alice Smith', photoURL: null, creationTime: new Date(2023, 0, 15).toISOString(), lastSignInTime: new Date(2024, 4, 1).toISOString(), orderCount: 5, totalSpent: 12500 },
          { id: 'user2', email: 'customer2@example.com', displayName: 'Bob Johnson', photoURL: 'https://placehold.co/40x40.png', creationTime: new Date(2023, 2, 20).toISOString(), lastSignInTime: new Date(2024, 3, 28).toISOString(), orderCount: 2, totalSpent: 4800 },
          { id: 'user3', email: 'customer3@example.com', displayName: 'Carol Williams', photoURL: null, creationTime: new Date(2024, 0, 5).toISOString(), lastSignInTime: new Date(2024, 4, 3).toISOString(), orderCount: 1, totalSpent: 1500 },
        ];
        setCustomers(placeholderCustomers);

      } catch (error) {
        console.error("Error fetching customers for admin:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.displayName && customer.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            Manage Customers
          </h1>
          <p className="text-muted-foreground text-sm">View and manage customer information.</p>
        </div>
        {/* Add button for "Add Customer" if needed, though usually customers register themselves */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>List of all registered customers.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-1/2 lg:w-1/3"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={customer.photoURL || undefined} alt={customer.displayName || 'Customer'} />
                                <AvatarFallback>{getInitials(customer.displayName)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{customer.displayName || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email || 'N/A'}</TableCell>
                      <TableCell>{customer.creationTime ? format(new Date(customer.creationTime), 'PP') : 'N/A'}</TableCell>
                      <TableCell>{customer.lastSignInTime ? format(new Date(customer.lastSignInTime), 'PP') : 'N/A'}</TableCell>
                      <TableCell>{customer.orderCount ?? 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" disabled> {/* Placeholder */}
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No customers found. (Note: Fetching all Firebase Auth users directly is complex. This page currently uses placeholder data.)
            </p>
          )}
        </CardContent>
      </Card>
      <Card className="mt-6 bg-amber-50 border-amber-200">
        <CardHeader>
            <CardTitle className="text-amber-700 text-base">Developer Note</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-600 text-sm">
            <p>Displaying a full customer list directly from Firebase Authentication is often restricted for security and performance reasons on the client-side. This page currently uses placeholder data.</p>
            <p className="mt-2">For a production environment, consider:</p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>Creating a separate Firestore collection (e.g., `users_public_profiles`) that mirrors essential, non-sensitive user data upon user creation (e.g., via a Firebase Function).</li>
                <li>Using Firebase Functions to securely query and paginate the full user list from Firebase Auth for admin purposes.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
