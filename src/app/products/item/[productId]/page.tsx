
"use client"; 

import type { Metadata } from 'next'; 
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2, MessageCircle, Plus, Minus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductCard, { type ProductCardProps } from '@/components/features/home/product-card'; 
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, use } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext'; // Import useCart

// Define a type for the product details
interface ProductDetails extends ProductCardProps {
  longDescription: string;
  images: string[];
  // originalPrice?: string; // Already in ProductCardProps via fixedOriginalPrice
  rating: string;
  reviewsCount: number;
  availability: string;
  category: string;
  brand: string;
}

// Helper function to get product details (replace with actual data fetching in a real app)
async function fetchProductDetails(productId: string): Promise<ProductDetails> {
  // For now, we'll use placeholder data based on the ID
  const numericId = parseInt(productId.replace('product-', ''), 10) || 1;
  const randomBasePrice = Math.random() * 7000 + 3000; // 2000-9000
  const offerPrice = parseFloat(randomBasePrice.toFixed(0));
  const originalPrice = parseFloat((randomBasePrice * (Math.random() * 0.3 + 1.1)).toFixed(0)); // 10-40% higher

  return {
    id: numericId,
    name: `Product Name ${numericId}`,
    description: `This is a detailed description for Product ${numericId}. It's a fantastic item with many great features and benefits. You'll love the quality and craftsmanship. Perfect for various uses and occasions.`,
    longDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam erat volutpat.`,
    image: `https://placehold.co/600x600.png`, 
    dataAiHint: "modern gadget",
    images: [ 
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
    ],
    fixedOfferPrice: offerPrice,
    fixedOriginalPrice: originalPrice,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating between 3.5 and 5.0
    reviewsCount: Math.floor(Math.random() * 200) + 10, // 10-210 reviews
    availability: Math.random() > 0.3 ? 'In Stock' : 'Out of Stock',
    category: 'Electronics', 
    brand: 'BrandName', 
  };
}

// Mock related products data
const relatedProductsData = [
  { id: 101, name: "Related Product 1", description: "Description for related product 1.", image: "https://placehold.co/300x300.png", dataAiHint: "tech accessory", fixedOfferPrice: 2500, fixedOriginalPrice: 3000 },
  { id: 102, name: "Related Product 2", description: "Description for related product 2.", image: "https://placehold.co/300x300.png", dataAiHint: "smart device", fixedOfferPrice: 4500, fixedOriginalPrice: 5500 },
  { id: 103, name: "Related Product 3", description: "Description for related product 3.", image: "https://placehold.co/300x300.png", dataAiHint: "office gadget", fixedOfferPrice: 1800, fixedOriginalPrice: 2200 },
  { id: 104, name: "Related Product 4", description: "Description for related product 4.", image: "https://placehold.co/300x300.png", dataAiHint: "home electronics", fixedOfferPrice: 6000, fixedOriginalPrice: 7500 },
];

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(paramsPromise); 
  
  const { toast } = useToast();
  const { addToCart } = useCart(); 
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      if (productId) { 
        const productDetails = await fetchProductDetails(productId);
        setProduct(productDetails);
        setSelectedImage(productDetails.image); 
        document.title = `${productDetails.name} - Creme Lite`;
      }
    }
    loadProduct();
  }, [productId]); 

  if (!product || selectedImage === null) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }
  
  const displayOriginalPrice = product.fixedOriginalPrice && product.fixedOfferPrice && product.fixedOriginalPrice > product.fixedOfferPrice 
    ? product.fixedOriginalPrice 
    : (product.fixedOfferPrice || 0) * 1.25;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product) {
      const productToAdd: ProductCardProps = {
        id: product.id,
        name: product.name,
        description: product.description, 
        image: product.image,
        dataAiHint: product.dataAiHint,
        fixedOfferPrice: product.fixedOfferPrice,
        fixedOriginalPrice: product.fixedOriginalPrice,
      };
      addToCart(productToAdd, quantity);
    }
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist!",
      description: `${product.name} has been added to your wishlist.`,
      variant: "default",
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Creme Lite!`,
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg bg-card">
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
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[product.image, ...product.images].slice(0,4).map((img, index) => (
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

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-muted-foreground">{product.category} / {product.brand}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(product.rating)) ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.rating} based on {product.reviewsCount} reviews)</span>
          </div>

          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <div className="space-y-2">
             <p className="text-3xl font-bold text-primary">
                KES {(product.fixedOfferPrice || 0).toLocaleString()}
              </p>
            {product.fixedOriginalPrice && product.fixedOfferPrice && product.fixedOriginalPrice > product.fixedOfferPrice && (
              <p className="text-xl text-muted-foreground line-through">
                KES {product.fixedOriginalPrice.toLocaleString()}
              </p>
            )}
          </div>
          
          <p className={`text-sm font-semibold ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
            {product.availability}
          </p>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
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
              <Button size="lg" variant="outline" className="flex-grow" onClick={handleAddToWishlist}>
                <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
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

          <Separator />

          {/* Product Details / Long Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground font-headline">Product Details</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <p>{product.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 md:mt-24">
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-foreground font-headline mb-8 md:mb-12">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {relatedProductsData.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              name={relatedProduct.name}
              description={relatedProduct.description}
              image={relatedProduct.image}
              dataAiHint={relatedProduct.dataAiHint}
              fixedOfferPrice={relatedProduct.fixedOfferPrice}
              fixedOriginalPrice={relatedProduct.fixedOriginalPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
    