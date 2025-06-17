
import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/features/home/product-card'; // For related products

// Helper function to get product details (replace with actual data fetching)
async function getProductDetails(productId: string) {
  // In a real app, you would fetch this data from an API or database
  // For now, we'll use placeholder data based on the ID
  const numericId = parseInt(productId.replace('product-', ''), 10) || 1;
  return {
    id: numericId,
    name: `Product Name ${numericId}`,
    description: `This is a detailed description for Product ${numericId}. It's a fantastic item with many great features and benefits. You'll love the quality and craftsmanship. Perfect for various uses and occasions.`,
    longDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam erat volutpat.`,
    image: `https://placehold.co/600x600.png`, // Main product image
    dataAiHint: "modern gadget",
    images: [ // Gallery images
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
      `https://placehold.co/100x100.png`,
    ],
    price: (Math.random() * 7000 + 3000).toFixed(0), // KES 3000 - 10000
    originalPrice: (Math.random() * 8000 + 4000).toFixed(0), // KES 4000 - 12000 (ensure it's higher)
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating between 3.5 and 5.0
    reviewsCount: Math.floor(Math.random() * 200) + 10, // 10-210 reviews
    availability: Math.random() > 0.3 ? 'In Stock' : 'Out of Stock',
    category: 'Electronics', // Example category
    brand: 'BrandName', // Example brand
  };
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const product = await getProductDetails(params.productId);
  return {
    title: `${product.name} - Creme Lite`,
    description: product.description,
  };
}

// Mock related products data
const relatedProductsData = [
  { id: 101, name: "Related Product 1", description: "Description for related product 1.", image: "https://placehold.co/300x300.png", dataAiHint: "tech accessory" },
  { id: 102, name: "Related Product 2", description: "Description for related product 2.", image: "https://placehold.co/300x300.png", dataAiHint: "smart device" },
  { id: 103, name: "Related Product 3", description: "Description for related product 3.", image: "https://placehold.co/300x300.png", dataAiHint: "office gadget" },
  { id: 104, name: "Related Product 4", description: "Description for related product 4.", image: "https://placehold.co/300x300.png", dataAiHint: "home electronics" },
];


export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = await getProductDetails(params.productId);

  // Ensure originalPrice is greater than price if both are set
  const displayOriginalPrice = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) ? product.originalPrice : (parseFloat(product.price) * 1.25).toFixed(0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg bg-card">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full h-full"
              data-ai-hint={product.dataAiHint}
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <button key={index} className="aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary outline-none">
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
                KES {parseFloat(product.price).toLocaleString('en-US')}
              </p>
            {displayOriginalPrice && parseFloat(displayOriginalPrice) > parseFloat(product.price) && (
              <p className="text-xl text-muted-foreground line-through">
                KES {parseFloat(displayOriginalPrice).toLocaleString('en-US')}
              </p>
            )}
          </div>
          
          <p className={`text-sm font-semibold ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
            {product.availability}
          </p>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-grow">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-grow">
              <Heart className="mr-2 h-5 w-5" /> Add to Wishlist
            </Button>
          </div>
           <div className="flex items-center justify-start space-x-2 pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MessageCircle className="mr-2 h-4 w-4" /> Ask a question
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

    