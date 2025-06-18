
"use client"; 

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2, MessageCircle, Plus, Minus, Loader2, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductCard, { type ProductCardProps } from '@/components/features/home/product-card'; 
import WeeklyDealsSlider, { type DealProduct } from '@/components/features/home/weekly-deals-slider';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from 'react'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { getProductDetailsById, type ProductDetailsPageData, getFeaturedProducts, getWeeklyDeals } from '@/services/productService'; 
import { notFound, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';


interface ProductDetailsComponentData extends ProductDetailsPageData {}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params; // Corrected: Direct access to productId
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart(); 
  const [user, authLoading] = useAuthState(auth);

  const [product, setProduct] = useState<ProductDetailsComponentData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>([]);
  const [offerProducts, setOfferProducts] = useState<DealProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      if (productId && typeof productId === 'string') { 
        setIsLoading(true);
        try {
          const productDetails = await getProductDetailsById(productId);
          if (productDetails) {
            setProduct(productDetails as ProductDetailsComponentData); 
            setSelectedImage(productDetails.image); 
            document.title = `${productDetails.name} - Creme Collections`;

            // Fetch related products (e.g., featured products)
            const fetchedRelatedProductsData = await getFeaturedProducts(); 
            const mappedRelatedProducts = fetchedRelatedProductsData.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              image: p.image,
              dataAiHint: p.dataAiHint,
              fixedOfferPrice: p.fixedOfferPrice,
              fixedOriginalPrice: p.fixedOriginalPrice
            }));
            setRelatedProducts(mappedRelatedProducts.filter(p => p.id !== productId).slice(0, 4));

            // Fetch products on offer (e.g., weekly deals)
            const fetchedOfferProductsData = await getWeeklyDeals();
            setOfferProducts(fetchedOfferProductsData.filter(p => p.id !== productId).slice(0, 6));


          } else {
            console.warn("Product not found on client side after fetch for ID:", productId);
            // Client-side notFound or redirect
            // notFound(); // This might not behave as expected client-side after initial load.
            // router.push('/404'); // Alternative
          }
        } catch (error) {
          console.error("Error loading product data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn("Invalid or missing productId for Product Detail Page:", productId);
        setIsLoading(false);
        // Optionally redirect or show an error message
      }
    }
    loadProductData();
  }, [productId, router]); 

  useEffect(() => {
    if (!user || !productId || !db || authLoading) {
        if(!authLoading && user) setIsWishlistProcessing(false);
        return;
    }
    if (typeof productId !== 'string') {
        console.warn("Wishlist check skipped due to invalid productId:", productId);
        setIsWishlistProcessing(false);
        return;
    }
    setIsWishlistProcessing(true);
    const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', productId);
    const unsubscribe = onSnapshot(wishlistItemRef, (docSnap) => {
        setIsInWishlist(docSnap.exists());
        setIsWishlistProcessing(false);
    }, (error) => {
        console.error("Error checking wishlist status:", error);
        setIsWishlistProcessing(false);
    });
    return () => unsubscribe();
  }, [user, productId, authLoading]);


  const handleToggleWishlist = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to manage your wishlist.", variant: "destructive", action: <Button asChild><Link href="/login">Login</Link></Button> });
      return;
    }
    if (!product || !db || typeof product.id !== 'string') {
        console.error("Product data or DB not available for wishlist action, or product ID is invalid.");
        toast({ title: "Error", description: "Could not update wishlist. Product data missing.", variant: "destructive" });
        return;
    }


    setIsWishlistProcessing(true);
    const wishlistItemRef = doc(db, 'users', user.uid, 'wishlist', product.id);

    try {
      if (isInWishlist) {
        await deleteDoc(wishlistItemRef);
        toast({ title: "Removed from Wishlist", description: `${product.name} removed from your wishlist.` });
      } else {
        await setDoc(wishlistItemRef, { 
          productId: product.id, 
          addedAt: serverTimestamp(),
          name: product.name, 
          image: product.image,
          categorySlug: product.categorySlug || null, 
          offerPrice: product.offerPrice
        });
        toast({ title: "Added to Wishlist!", description: `${product.name} added to your wishlist.` });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({ title: "Error", description: "Could not update your wishlist. Please try again.", variant: "destructive" });
    } finally {
      // Snapshot listener will update isWishlistProcessing
    }
  };


  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    notFound(); 
    return null; 
  }
  
  const displayOriginalPrice = product.originalPrice && product.offerPrice && product.originalPrice > product.offerPrice 
    ? product.originalPrice 
    : (product.offerPrice || 0) * 1.25; 

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product && typeof product.id === 'string') {
      const productToAdd: ProductCardProps = {
        id: product.id, 
        name: product.name,
        description: product.description, 
        image: product.image,
        dataAiHint: product.dataAiHint,
        fixedOfferPrice: product.offerPrice, 
        fixedOriginalPrice: product.originalPrice,
      };
      addToCart(productToAdd, quantity);
    } else {
        toast({title: "Error", description: "Could not add product to cart. Product ID missing or invalid.", variant: "destructive"});
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Creme Collections!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const currentGalleryImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg bg-card">
            {selectedImage && (
              <Image
                key={selectedImage} 
                src={selectedImage}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full transition-opacity duration-300"
                data-ai-hint={product.dataAiHint}
                priority
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {currentGalleryImages.slice(0,4).map((img, index) => (
              <button 
                key={index} 
                className={`aspect-square rounded-md overflow-hidden border-2 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary outline-none ${selectedImage === img ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
                aria-label={`View image ${index + 1} of ${product.name}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  data-ai-hint="product detail" 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category || 'N/A'} / {product.brand || 'N/A'}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(String(product.rating || 0))) ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.rating || '0'} based on {product.reviewsCount || 0} reviews)</span>
          </div>

          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <div className="space-y-2">
             <p className="text-3xl font-bold text-primary">
                KES {(product.offerPrice || 0).toLocaleString()}
              </p>
            {product.originalPrice && product.offerPrice && product.originalPrice > product.offerPrice && (
              <p className="text-xl text-muted-foreground line-through">
                KES {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          
          <p className={`text-sm font-semibold ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
            {product.availability || "N/A"} {product.stock !== undefined && product.availability === 'In Stock' ? `(${product.stock} left)` : ''}
          </p>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="quantity" className="text-sm font-medium shrink-0">Quantity:</Label>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-muted" onClick={decrementQuantity} aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  readOnly
                  className="h-10 w-12 text-center border-0 focus-visible:ring-0 bg-transparent font-medium"
                  aria-label="Current quantity"
                />
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-muted" onClick={incrementQuantity} aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-grow" onClick={handleAddToCart} disabled={product.availability !== 'In Stock'}>
                <ShoppingCart className="mr-2 h-5 w-5" /> {product.availability === 'In Stock' ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-grow" 
                onClick={handleToggleWishlist}
                disabled={isWishlistProcessing}
              >
                {isWishlistProcessing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-destructive text-destructive' : ''}`} />
                )}
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>

           <div className="flex items-center justify-start space-x-2 pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" asChild>
             <a href={`/contact?subject=Question about ${product.name}`}>
                <MessageCircle className="mr-2 h-4 w-4" /> Ask a question
             </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Detailed Description Section */}
      <div className="mt-12 md:mt-16 py-8 border-t">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground font-headline mb-6 flex items-center">
          <Info className="mr-3 h-7 w-7 text-primary" />
          Product Description
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
          {product.longDescription ? (
            <p>{product.longDescription}</p>
          ) : (
            <p>No detailed description available for this product.</p>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 md:mt-16 py-8 border-t">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground font-headline mb-8 text-center">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((relatedProd) => (
              <ProductCard
                key={relatedProd.id}
                id={relatedProd.id}
                name={relatedProd.name}
                description={relatedProd.description}
                image={relatedProd.image}
                dataAiHint={relatedProd.dataAiHint}
                fixedOfferPrice={relatedProd.fixedOfferPrice}
                fixedOriginalPrice={relatedProd.fixedOriginalPrice}
              />
            ))}
          </div>
        </div>
      )}

      {/* Products on Offer Section */}
      {offerProducts.length > 0 && (
        <div className="mt-12 md:mt-16 py-8 border-t bg-primary/5 px-4 sm:px-6 lg:px-8 rounded-lg">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary font-headline mb-8 text-center">
            Special Offers
          </h2>
          <WeeklyDealsSlider deals={offerProducts} />
        </div>
      )}
    </div>
  );
}

