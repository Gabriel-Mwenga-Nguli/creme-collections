
import type { Metadata } from 'next';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { Filter, List, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Products - Creme Lite',
  description: 'Browse all products available on Creme Lite.',
};

// Dummy product data for the general products page
const dummyProducts = [
  { id: 501, name: "Generic Product A", description: "High-quality item with excellent features.", image: "https://placehold.co/400x400.png", dataAiHint: "general item" },
  { id: 502, name: "Versatile Gadget B", description: "Useful for various everyday tasks.", image: "https://placehold.co/400x400.png", dataAiHint: "tech gadget" },
  { id: 503, name: "Stylish Accessory C", description: "A perfect addition to your collection.", image: "https://placehold.co/400x400.png", dataAiHint: "fashion accessory" },
  { id: 504, name: "Essential Home Good D", description: "Must-have for any modern home.", image: "https://placehold.co/400x400.png", dataAiHint: "home good" },
  { id: 505, name: "Another Great Product E", description: "You'll love this amazing product.", image: "https://placehold.co/400x400.png", dataAiHint: "cool stuff" },
  { id: 506, name: "Top Seller Item F", description: "Popular choice among our customers.", image: "https://placehold.co/400x400.png", dataAiHint: "best seller" },
  { id: 507, name: "New Arrival G", description: "Freshly added to our catalog.", image: "https://placehold.co/400x400.png", dataAiHint: "new item" },
  { id: 508, name: "Limited Edition H", description: "Get it before it's gone!", image: "https://placehold.co/400x400.png", dataAiHint: "limited stock" },
];

export default function AllProductsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }}) {
  const filter = searchParams?.filter || 'all';
  // In a real app, you would use this filter to fetch specific products.
  // For now, we just display a title based on it.
  let pageTitle = "All Products";
  if (filter === 'sale') pageTitle = "Products on Sale";
  if (filter === 'new') pageTitle = "New Arrivals";
  if (filter === 'offers') pageTitle = "Special Offers";
  if (typeof searchParams?.category === 'string') pageTitle = `${searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)} Products`;


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

      {dummyProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {dummyProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              dataAiHint={product.dataAiHint}
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
