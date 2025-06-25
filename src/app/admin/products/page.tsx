
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';

const mockProducts = [
  { id: '1', name: 'Modern Smartwatch Series X', category: 'Electronics', price: 12999, stock: 50, status: 'Active', image: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Classic Men\'s Polo Shirt', category: 'Fashion', price: 2499, stock: 120, status: 'Active', image: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Stainless Steel Cookware Set', category: 'Home & Living', price: 7999, stock: 30, status: 'Active', image: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Wireless Headphones', category: 'Electronics', price: 19999, stock: 0, status: 'Archived', image: 'https://placehold.co/40x40.png' },
  { id: '5', name: 'Organic Green Tea', category: 'Groceries', price: 599, stock: 5, status: 'Active', image: 'https://placehold.co/40x40.png' },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-headline">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'Active' ? 'default' : 'outline'}>{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">KES {product.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions for {product.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/admin/products/edit/${product.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem>View on Site</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
