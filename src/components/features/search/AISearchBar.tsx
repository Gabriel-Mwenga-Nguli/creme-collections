
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { smartProductSearch, type SmartProductSearchInput } from '@/ai/flows/product-search'; // Assuming flow is adjusted or suitable

export default function AISearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // Example of calling the AI flow.
      // In a real scenario, you might want to display these results in a dropdown
      // or use them to augment the search page.
      const input: SmartProductSearchInput = { searchTerm: searchTerm.trim() };
      const aiResults = await smartProductSearch(input);
      console.log('AI Search Results:', aiResults); 
      // For now, we'll just navigate to the search page with the query.
      // The search page itself could then use this query for a more detailed AI search.
      router.push(`/search-page?q=${encodeURIComponent(searchTerm.trim())}`);

    } catch (error) {
      console.error('AI search failed:', error);
      // Fallback: just navigate to search page if AI fails
      router.push(`/search-page?q=${encodeURIComponent(searchTerm.trim())}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="search"
        placeholder="Search for products, brands, or categories..."
        className="w-full h-10 pl-10 pr-12 rounded-md border-border focus:border-primary focus:ring-primary bg-background"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search products"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute inset-y-0 right-0 pr-2 flex items-center hover:bg-transparent text-primary disabled:opacity-75 h-full"
        disabled={isLoading}
        aria-label="Submit search"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
      </Button>
    </form>
  );
}
