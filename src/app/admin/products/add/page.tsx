
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/services/productService'; // Import the service
import { CATEGORY_NAV_LINKS } from '@/lib/constants';

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      offerPrice: Number(formData.get('offerPrice')),
      originalPrice: Number(formData.get('originalPrice')),
      category: formData.get('category') as string,
      categorySlug: (formData.get('category') as string)?.toLowerCase().replace(/\s+/g, '-'),
      brand: formData.get('brand') as string,
      stock: Number(formData.get('stock')),
      isFeatured: formData.get('isFeatured') === 'on',
      isWeeklyDeal: formData.get('isWeeklyDeal') === 'on',
      image: '/images/products/placeholder.png', // Default placeholder
      dataAiHint: 'product placeholder', // Default hint
      availability: Number(formData.get('stock')) > 0 ? 'In Stock' : 'Out of Stock',
    };
    
    // Basic validation
    if (!productData.name || !productData.offerPrice) {
        toast({ title: "Validation Error", description: "Name and Offer Price are required.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    const newProductId = await addProduct(productData);

    if (newProductId) {
      toast({
        title: "Product Added",
        description: "The new product has been successfully added to the catalog.",
      });
      router.push('/admin/products');
    } else {
      toast({
        title: "Error",
        description: "Failed to add the product. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
          <h1 className="text-2xl font-bold font-headline">Add New Product</h1>
          <p className="text-muted-foreground">Fill in the details to add a new product to your store.</p>
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
                <Input name="name" id="name" placeholder="e.g., Wireless Bluetooth Speaker" required />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea name="description" id="description" placeholder="A brief summary of the product" />
              </div>
              <div>
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea name="longDescription" id="longDescription" rows={5} placeholder="Detailed product information" />
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
                <Input name="offerPrice" id="offerPrice" type="number" placeholder="1999" required />
              </div>
               <div>
                <Label htmlFor="originalPrice">Original Price (KES)</Label>
                <Input name="originalPrice" id="originalPrice" type="number" placeholder="2499" />
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
                <Select name="category">
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_NAV_LINKS.map(cat => (
                        <SelectItem key={cat.label} value={cat.label}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="brand">Brand</Label>
                <Input name="brand" id="brand" placeholder="e.g., TechNova" />
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
                    <Input name="stock" id="stock" type="number" placeholder="100" />
                </div>
                 <div>
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input name="sku" id="sku" placeholder="TECH-SPKR-001" />
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox name="isFeatured" id="isFeatured" />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox name="isWeeklyDeal" id="isWeeklyDeal" />
                    <Label htmlFor="isWeeklyDeal">Weekly Deal</Label>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild><Link href="/admin/products">Cancel</Link></Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Product
          </Button>
      </div>
    </form>
  );
}
