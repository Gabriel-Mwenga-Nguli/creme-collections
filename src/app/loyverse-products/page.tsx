"use client";

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { app, isConfigured } from '@/lib/firebase';
import ProductCard from '@/components/features/home/product-card';
import { Loader2, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface for the product data coming from the cloud function
interface LoyverseProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  imageUrl: string;
  dataAiHint: string;
  stock: number;
}

export default function LoyverseProductsPage() {
  const [products, setProducts] = useState<LoyverseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Loyverse Inventory - Creme Collections';
    
    async function fetchProducts() {
      if (!isConfigured || !app) {
        setError("Firebase is not configured. Please check your .env.local file.");
        setIsLoading(false);
        return;
      }
      
      const functions: Functions = getFunctions(app);
      const getLoyverseProducts = httpsCallable(functions, 'getLoyverseProducts');

      try {
        const result = await getLoyverseProducts();
        const data = result.data as { products: LoyverseProduct[] };
        setProducts(data.products || []);
      } catch (err: any) {
        console.error("Error fetching Loyverse products:", err);
        setError(err.message || "An unknown error occurred while fetching products.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Fetching products from Loyverse...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-destructive/10 p-6 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold text-destructive">Failed to Load Products</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No products found</h2>
            <p className="text-muted-foreground mt-2">Your Loyverse inventory appears to be empty or could not be loaded.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            image={product.imageUrl}
            dataAiHint={product.dataAiHint}
            fixedOfferPrice={product.price}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary font-headline">Loyverse Inventory</h1>
        <p className="text-muted-foreground mb-10">Products fetched live from your Loyverse store.</p>
      </div>
      {renderContent()}
    </div>
  );
}
