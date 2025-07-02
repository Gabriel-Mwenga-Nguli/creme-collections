
"use client";

import React, { useState, useEffect } from 'react';
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
import { useParams, useRouter } from 'next/navigation';
import { getProductDetailsById, updateProduct, type Product } from '@/services/productService';
import { CATEGORY_NAV_LINKS } from '@/lib/constants';

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { productId } = params as { productId: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;
    async function fetchProduct() {
      setIsLoading(true);
      const fetchedProduct = await getProductDetailsById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) return;
    
    setIsSaving(true);
    
    const formData = new FormData(event.currentTarget);
    const categoryLabel = formData.get('category') as string;
    const categoryInfo = CATEGORY_NAV_LINKS.find(cat => cat.label === categoryLabel);

    const updatedData: Partial<Product> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string,
      offerPrice: Number(formData.get('offerPrice')),
      originalPrice: Number(formData.get('originalPrice')),
      category: categoryInfo?.label,
      categorySlug: categoryInfo?.href.split('/').pop(),
      brand: formData.get('brand') as string,
      stock: Number(formData.get('stock')),
      isFeatured: formData.get('isFeatured') === 'on',
      isWeeklyDeal: formData.get('isWeeklyDeal') === 'on',
      availability: Number(formData.get('stock')) > 0 ? 'In Stock' : 'Out of Stock',
    };

    try {
        const success = await updateProduct(productId, updatedData);
        if (success) {
            toast({
                title: "Product Updated",
                description: `Product "${updatedData.name}" has been successfully updated.`,
            });
            router.push('/admin/products');
        } else {
             throw new Error("Failed to update product.");
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to update the product. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

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
          <p className="text-muted-foreground">Editing product: {product.name}</p>
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
                <Input name="name" id="name" defaultValue={product.name} required />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea name="description" id="description" defaultValue={product.description} />
              </div>
              <div>
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea name="longDescription" id="longDescription" rows={5} defaultValue={product.longDescription} />
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
                <Input name="offerPrice" id="offerPrice" type="number" defaultValue={product.offerPrice} required />
              </div>
               <div>
                <Label htmlFor="originalPrice">Original Price (KES)</Label>
                <Input name="originalPrice" id="originalPrice" type="number" defaultValue={product.originalPrice} />
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
                <Select name="category" defaultValue={product.category}>
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
                <Input name="brand" id="brand" defaultValue={product.brand} />
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
                    <Input name="stock" id="stock" type="number" defaultValue={product.stock} />
                </div>
                 <div>
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input name="sku" id="sku" placeholder="SKU not available" disabled />
                </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox name="isFeatured" id="isFeatured" defaultChecked={product.isFeatured} />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox name="isWeeklyDeal" id="isWeeklyDeal" defaultChecked={product.isWeeklyDeal} />
                    <Label htmlFor="isWeeklyDeal">Weekly Deal</Label>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild><Link href="/admin/products">Cancel</Link></Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
      </div>
    </form>
  );
}
