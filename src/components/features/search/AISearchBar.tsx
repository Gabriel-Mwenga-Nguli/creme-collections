
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { smartProductSearch, type SmartProductSearchInput } from '@/ai/flows/product-search';

export default function AISearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      // The AI search flow is called, but for navigation, we primarily use query params.
      // The search-page can then decide how to use the AI results or perform its own.
      // const input: SmartProductSearchInput = { searchTerm: searchTerm.trim() };
      // const aiResults = await smartProductSearch(input);
      // console.log('AI Search Results (from header bar):', aiResults); 
      
      router.push(`/search-page?q=${encodeURIComponent(searchTerm.trim())}`);

    } catch (error) {
      console.error('AI search from header bar failed:', error);
      // Fallback: just navigate to search page if AI call fails
      router.push(`/search-page?q=${encodeURIComponent(searchTerm.trim())}`);
    } finally {
      setIsLoading(false);
      // setSearchTerm(''); // Optionally clear search term after navigation
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <Input
        type="search"
        placeholder="Search for products..."
        className={
          "w-full h-12 pl-5 pr-14 rounded-full " +
          "bg-white dark:bg-slate-100 " +
          "text-slate-900 dark:text-slate-900 " + // Ensure input text is dark on light bg
          "placeholder:text-slate-600 dark:placeholder:text-slate-700 " + // Improved placeholder contrast
          "text-sm " + 
          "border-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-transparent " +
          "shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow"
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search products"
      />
      <button
        type="submit"
        className={
          "absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 " +
          "text-slate-500 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-primary " + // Adjusted icon colors for consistency
          "focus:text-primary dark:focus:text-primary focus:outline-none " + 
          "disabled:opacity-75 transition-colors rounded-r-full"
        }
        disabled={isLoading}
        aria-label="Submit search"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
      </button>
    </form>
  );
}

