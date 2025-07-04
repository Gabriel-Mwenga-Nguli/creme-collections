
'use client'; // Make it a client component to read searchParams

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { smartProductSearch, type SmartProductSearchOutput } from '@/ai/flows/product-search';
import ProductCard from '@/components/features/home/product-card';

function SearchPageComponent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SmartProductSearchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const results = await smartProductSearch({ searchTerm: query });
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results. Please try again.");
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = initialQuery ? `Search results for "${initialQuery}"` : 'Search Products - Creme Collections';
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Update URL to reflect new search term, which will trigger the useEffect
    const newUrl = searchTerm ? `/search-page?q=${encodeURIComponent(searchTerm)}` : '/search-page';
    window.history.pushState({}, '', newUrl);
    performSearch(searchTerm);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-4 font-headline">Smart Product Search</h1>
        <p className="text-lg text-muted-foreground">
          Our AI-powered search helps you find products by name, description, and more.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12 flex gap-2">
        <Input
          type="search"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow h-12 text-base"
          aria-label="Search input"
        />
        <Button type="submit" size="lg" disabled={isLoading} className="h-12">
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <SearchIcon className="mr-2 h-5 w-5" />}
          Search
        </Button>
      </form>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Searching for products...</p>
        </div>
      )}

      {error && (
        <Card className="max-w-2xl mx-auto bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Search Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {searchResults && !isLoading && (
        <div className="max-w-4xl mx-auto">
          {searchResults.products.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Search Results</h2>
              {searchResults.reasoning && (
                <p className="text-muted-foreground mb-6 italic">Note: {searchResults.reasoning}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                    dataAiHint={product.dataAiHint}
                    fixedOfferPrice={product.offerPrice}
                    fixedOriginalPrice={product.originalPrice}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-foreground">No products found for "{searchTerm}".</p>
              <p className="text-muted-foreground">Try a different search term or check your spelling.</p>
               {searchResults.reasoning && (
                <p className="text-sm text-muted-foreground mt-4 italic">AI Note: {searchResults.reasoning}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Wrap the client component in Suspense for useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center"><Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" /></div>}>
      <SearchPageComponent />
    </Suspense>
  );
}
