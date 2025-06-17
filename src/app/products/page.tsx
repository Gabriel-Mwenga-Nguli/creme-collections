
import type { Metadata } from 'next';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { Filter, List, Search } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, type Product } from '@/services/productService'; // Import Firestore service

export const metadata: Metadata = {
  title: 'All Products - Creme Lite',
  description: 'Browse all products available on Creme Lite.',
};

export default async function AllProductsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }}) {
  const filter = searchParams?.filter || 'all';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  // In a real app, you would use this filter to fetch specific products.
  let pageTitle = "All Products";
  if (filter === 'sale') pageTitle = "Products on Sale";
  if (filter === 'new') pageTitle = "New Arrivals";
  if (filter === 'offers') pageTitle = "Special Offers";
  if (category) pageTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;

  // Fetch all products from Firestore - implement filtering later if needed
  const products = await getAllProducts(category);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline">{pageTitle}</h1>
            <p className="text-muted-foreground mt-1">Browse our extensive collection of products.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
             <Button variant="outline" asChild>
                <Link href="/search-page">
                    <Search className="mr-2 h-4 w-4" /> Search
                </Link>
            </Button>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id} // Already string from service
              name={product.name}
              description={product.description}
              image={product.image}
              dataAiHint={product.dataAiHint}
              fixedOfferPrice={product.fixedOfferPrice}
              fixedOriginalPrice={product.fixedOriginalPrice}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <List className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-foreground">No products found.</p>
          <p className="text-muted-foreground mt-2">Please check back later or try different filters.</p>
        </div>
      )}

      {/* Placeholder for Pagination */}
      <div className="mt-12 flex justify-center">
        <Button variant="outline" className="mr-2">Previous</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}

    