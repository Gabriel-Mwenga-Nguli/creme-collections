
import HeroSlider from '@/components/features/home/hero-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import WeeklyDealsSlider, { type DealProduct } from '@/components/features/home/weekly-deals-slider';

const categoryHighlights = [
  { name: "Electronics", image: "https://placehold.co/400x300.png", dataAiHint: "gadgets technology", href: "/products/electronics" },
  { name: "Fashion", image: "https://placehold.co/400x300.png", dataAiHint: "apparel clothing", href: "/products/fashion" },
  { name: "Home Goods", image: "https://placehold.co/400x300.png", dataAiHint: "furniture decor", href: "/products/home" },
];

const promotionalBanners = [
  { title: "Weekend Sale", description: "Up to 50% off on selected items!", image: "https://placehold.co/600x400.png", dataAiHint: "sale discount", bgColor: "bg-primary/10", textColor: "text-primary-foreground", href: "/products?filter=sale" },
  { title: "New Arrivals", description: "Check out the latest trends.", image: "https://placehold.co/600x400.png", dataAiHint: "new products", bgColor: "bg-accent/10", textColor: "text-accent-foreground", href: "/products?filter=new" },
];

const featuredProductsData = [
  { id: 1, name: "Product Name 1", description: "Brief description of product 1.", image: "https://placehold.co/400x400.png", dataAiHint: "fashion product" },
  { id: 2, name: "Product Name 2", description: "Brief description of product 2.", image: "https://placehold.co/400x400.png", dataAiHint: "electronics gadget" },
  { id: 3, name: "Product Name 3", description: "Brief description of product 3.", image: "https://placehold.co/400x400.png", dataAiHint: "home accessory" },
  { id: 4, name: "Product Name 4", description: "Brief description of product 4.", image: "https://placehold.co/400x400.png", dataAiHint: "beauty item" },
];

const weeklyDealsData: DealProduct[] = [
  { id: 201, name: "Smart Watch Pro", description: "Track your fitness in style, now at an unbeatable price!", image: "https://placehold.co/300x300.png", dataAiHint: "smartwatch fitness", fixedOriginalPrice: 15000, fixedOfferPrice: 9999 },
  { id: 202, name: "Wireless Earbuds X", description: "Immersive sound, all day comfort. Limited time offer!", image: "https://placehold.co/300x300.png", dataAiHint: "audio earbuds", fixedOriginalPrice: 8000, fixedOfferPrice: 4999 },
  { id: 203, name: "Pro Gaming Mouse", description: "Precision and speed for gamers. Grab it while it's hot!", image: "https://placehold.co/300x300.png", dataAiHint: "gaming mouse", fixedOriginalPrice: 6000, fixedOfferPrice: 3499 },
  { id: 204, name: "Portable Blender", description: "Healthy smoothies on the go. Amazing discount!", image: "https://placehold.co/300x300.png", dataAiHint: "kitchen appliance", fixedOriginalPrice: 7500, fixedOfferPrice: 4899 },
  { id: 205, name: "Yoga Mat Premium", description: "Comfort and grip for your practice. Don't miss out!", image: "https://placehold.co/300x300.png", dataAiHint: "fitness yoga", fixedOriginalPrice: 4000, fixedOfferPrice: 2799 },
  { id: 206, name: "Bluetooth Speaker Max", description: "Room-filling sound, portable design. Huge savings!", image: "https://placehold.co/300x300.png", dataAiHint: "speaker audio", fixedOriginalPrice: 12000, fixedOfferPrice: 7999 },
];


export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSlider />

      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl font-headline mb-10">
            Shop Our Top Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categoryHighlights.map((category) => (
              <Link href={category.href} key={category.name} className="group block">
                <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary">
                  <CardContent className="p-0">
                    <div className="aspect-w-4 aspect-h-3">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.dataAiHint}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors font-headline">{category.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">Discover the best in {category.name.toLowerCase()}.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-primary/5" id="weekly-deals">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-10">
            <Zap className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl font-headline">
              Flash Deals of the Week!
            </h2>
            <Zap className="w-8 h-8 text-primary ml-3" />
          </div>
          <WeeklyDealsSlider deals={weeklyDealsData} />
        </div>
      </section>
      
      <section className="py-12 md:py-16 bg-secondary/30" id="promotions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl font-headline mb-10">
            Don't Miss Out!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {promotionalBanners.map((banner) => (
              <Link href={banner.href} key={banner.title} className="group block">
              <Card className={`overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary ${banner.bgColor}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <h3 className={`text-2xl font-semibold ${banner.textColor === 'text-primary-foreground' ? 'text-primary' : 'text-accent'} font-headline`}>{banner.title}</h3>
                    <p className={`mt-2 text-sm ${banner.textColor === 'text-primary-foreground' ? 'text-primary/80' : 'text-accent/80'}`}>{banner.description}</p>
                    <Button variant={banner.bgColor === 'bg-primary/10' ? 'default' : 'outline'} size="sm" className="mt-4 w-fit">
                       Shop Now <ShoppingBag className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="sm:w-1/2 aspect-video sm:aspect-auto">
                     <Image
                        src={banner.image}
                        alt={banner.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={banner.dataAiHint}
                      />
                  </div>
                </div>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background" id="new-arrivals">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl font-headline mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProductsData.map((product) => (
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
           <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/products">Shop All Products <ShoppingBag className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
