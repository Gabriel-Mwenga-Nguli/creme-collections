
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { productId } = params;

  // In a real app, you would fetch the product data using the productId
  const mockProduct = {
    name: 'Modern Smartwatch Series X',
    description: 'Sleek smartwatch with advanced health tracking.',
    longDescription: 'Full-featured Modern Smartwatch Series X...',
    offerPrice: 12999,
    originalPrice: 15999,
    category: 'electronics',
    brand: 'TechNova',
    stock: 50,
    sku: 'TN-SWX-001',
    isFeatured: true,
    isWeeklyDeal: false,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Product Updated (Simulated)",
      description: `Product "${mockProduct.name}" has been successfully updated.`,
    });
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/products">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to products</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Edit Product</h1>
          <p className="text-muted-foreground">Editing product ID: {productId}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" defaultValue={mockProduct.name} required />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea id="description" defaultValue={mockProduct.description} />
              </div>
              <div>
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea id="longDescription" rows={5} defaultValue={mockProduct.longDescription} />
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
               <div>
                <Label htmlFor="offerPrice">Offer Price (KES)</Label>
                <Input id="offerPrice" type="number" defaultValue={mockProduct.offerPrice} required />
              </div>
               <div>
                <Label htmlFor="originalPrice">Original Price (KES)</Label>
                <Input id="originalPrice" type="number" defaultValue={mockProduct.originalPrice} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={mockProduct.category}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home-living">Home & Living</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" defaultValue={mockProduct.brand} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" defaultValue={mockProduct.stock} />
                </div>
                 <div>
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input id="sku" defaultValue={mockProduct.sku} />
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox id="isFeatured" defaultChecked={mockProduct.isFeatured} />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="isWeeklyDeal" defaultChecked={mockProduct.isWeeklyDeal} />
                    <Label htmlFor="isWeeklyDeal">Weekly Deal</Label>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild><Link href="/admin/products">Cancel</Link></Button>
          <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
