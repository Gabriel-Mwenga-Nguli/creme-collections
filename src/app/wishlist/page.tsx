
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function WishlistRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new wishlist page within the profile section
    router.replace('/profile/wishlist');
  }, [router]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to your wishlist...</p>
    </div>
  );
}
