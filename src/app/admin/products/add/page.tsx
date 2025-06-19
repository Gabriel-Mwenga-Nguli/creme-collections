
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChevronLeft, ShoppingBag, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addProduct, type Product } from '@/services/productService';
import { CATEGORY_NAV_LINKS } from '@/lib/constants'; // For category dropdowns

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>;

export default function AdminAddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    longDescription: '',
    image: '/images/banners/electronics.png', // Default local placeholder
    images: ['/images/banners/electronics.png', '/images/banners/fashion.png'], // Default local placeholders
    dataAiHint: '',
    offerPrice: 0,
    originalPrice: undefined,
    availability: 'In Stock',
    category: '',
    categorySlug: '',
    subCategory: '',
    subCategorySlug: '',
    brand: '',
    stock: 0,
    isFeatured: false,
    isWeeklyDeal: false,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const subCategories = selectedCategory ? CATEGORY_NAV_LINKS.find(cat => cat.href.split('/').pop() === selectedCategory)?.subLinks : [];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    }
     else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'categorySlug') {
        setSelectedCategory(value);
        const catLabel = CATEGORY_NAV_LINKS.find(c => c.href.split('/').pop() === value)?.label;
        setFormData(prev => ({ ...prev, category: catLabel || '', subCategory: '', subCategorySlug: '' }));
    }
    if (name === 'subCategorySlug') {
        const subCatLabel = subCategories?.find(sc => sc.href.split('/').pop() === value)?.label;
        setFormData(prev => ({ ...prev, subCategory: subCatLabel || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.name || formData.offerPrice <= 0 || !formData.categorySlug) {
        toast({ title: "Validation Error", description: "Product Name, Offer Price, and Category are required.", variant: "destructive"});
        setIsSaving(false);
        return;
    }
    
    try {
      const productId = await addProduct(formData);
      if (productId) {
        toast({ title: "Product Added", description: `${formData.name} has been successfully added.` });
        router.push('/admin/products');
      } else {
        throw new Error("Failed to get product ID after adding.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({ title: "Error", description: "Could not add product. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-headline flex items-center">
                <ShoppingBag className="mr-3 h-7 w-7 text-primary" />
                Add New Product
            </h1>
            <p className="text-muted-foreground text-sm">Fill in the details for the new product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                <div><Label htmlFor="description">Short Description (for cards)</Label><Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={2} /></div>
                <div><Label htmlFor="longDescription">Long Description (for product page)</Label><Textarea id="longDescription" name="longDescription" value={formData.longDescription || ''} onChange={handleInputChange} rows={5} /></div>
                <div><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" value={formData.brand || ''} onChange={handleInputChange} /></div>
                <div><Label htmlFor="dataAiHint">AI Hint (keywords for image search, max 2 words)</Label><Input id="dataAiHint" name="dataAiHint" value={formData.dataAiHint} onChange={handleInputChange} placeholder="e.g., smartphone tech"/></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Pricing &amp; Stock</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div><Label htmlFor="offerPrice">Offer Price (KES)</Label><Input id="offerPrice" name="offerPrice" type="number" value={formData.offerPrice} onChange={handleInputChange} required min="0" step="0.01" /></div>
                <div><Label htmlFor="originalPrice">Original Price (KES, optional)</Label><Input id="originalPrice" name="originalPrice" type="number" value={formData.originalPrice || ''} onChange={handleInputChange} min="0" step="0.01" /></div>
                <div><Label htmlFor="stock">Stock Quantity</Label><Input id="stock" name="stock" type="number" value={formData.stock || 0} onChange={handleInputChange} min="0" /></div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select name="availability" value={formData.availability} onValueChange={(value) => handleSelectChange('availability', value)}>
                    <SelectTrigger><SelectValue placeholder="Select availability" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Pre-order">Pre-order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Images</CardTitle><CardDescription>Enter URLs for product images. Use paths like /images/products/your-image.png</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    <div><Label htmlFor="image">Main Image URL</Label><Input id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="/images/products/main-image.png" required /></div>
                    <div><Label htmlFor="images">Additional Image URLs (comma-separated)</Label><Textarea id="images_temp" name="images_temp" value={formData.images?.join(', ') || ''} onChange={(e) => setFormData(prev => ({...prev, images: e.target.value.split(',').map(url => url.trim()).filter(url => url)}))} placeholder="/images/products/image1.png, /images/products/image2.png" rows={2} /></div>
                </CardContent>
            </Card>

          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>Categorization</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categorySlug">Category</Label>
                  <Select name="categorySlug" value={formData.categorySlug} onValueChange={(value) => handleSelectChange('categorySlug', value)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORY_NAV_LINKS.map(cat => <SelectItem key={cat.href.split('/').pop()} value={cat.href.split('/').pop()!}>{cat.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCategory && subCategories && subCategories.length > 0 && (
                  <div>
                    <Label htmlFor="subCategorySlug">Sub-Category</Label>
                    <Select name="subCategorySlug" value={formData.subCategorySlug} onValueChange={(value) => handleSelectChange('subCategorySlug', value)}>
                      <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                      <SelectContent>
                        {subCategories.map(sub => <SelectItem key={sub.href.split('/').pop()} value={sub.href.split('/').pop()!}>{sub.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Visibility</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2"><Checkbox id="isFeatured" name="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))} /><Label htmlFor="isFeatured">Featured Product</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="isWeeklyDeal" name="isWeeklyDeal" checked={formData.isWeeklyDeal} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isWeeklyDeal: !!checked }))} /><Label htmlFor="isWeeklyDeal">Weekly Deal</Label></div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}
