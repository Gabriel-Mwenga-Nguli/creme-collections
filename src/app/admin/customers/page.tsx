
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const mockUsers = [
  { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', orders: 5, joined: '2024-05-20' },
  { id: 'usr_2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Customer', orders: 2, joined: '2024-05-15' },
  { id: 'usr_3', name: 'Admin User', email: 'admin@cremecollections.shop', role: 'Admin', orders: 0, joined: '2024-01-01' },
  { id: 'usr_4', name: 'Michael Johnson', email: 'michael.j@example.com', role: 'Customer', orders: 8, joined: '2023-11-10' },
  { id: 'usr_5', name: 'Emily Davis', email: 'emily.d@example.com', role: 'Shop Manager', orders: 0, joined: '2024-03-22' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-headline">Customers</h1>
          <p className="text-muted-foreground">Manage your users and their roles.</p>
        </div>
        <Button disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>A list of all registered users in your system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Shop Manager' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{user.orders}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem disabled>View Profile</DropdownMenuItem>
                        <DropdownMenuItem disabled>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive">Suspend User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
