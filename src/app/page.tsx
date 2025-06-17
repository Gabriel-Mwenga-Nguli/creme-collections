
import HeroSlider from '@/components/features/home/hero-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // CardDescription, CardHeader, CardTitle removed as not directly used for category
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import WeeklyDealsSlider from '@/components/features/home/weekly-deals-slider';
import { getFeaturedProducts, getWeeklyDeals } from '@/services/productService'; // Import Firestore service

const categoryHighlights = [
  { name: "Electronics", image: "https://placehold.co/400x300.png", dataAiHint: "gadgets technology", href: "/products/category/electronics" },
  { name: "Fashion", image: "https://placehold.co/400x300.png", dataAiHint: "apparel clothing", href: "/products/category/fashion" },
  { name: "Home Goods", image: "https://placehold.co/400x300.png", dataAiHint: "furniture decor", href: "/products/home" },
];

const promotionalBanners = [
  { title: "Weekend Sale", description: "Up to 50% off on selected items!", image: "https://placehold.co/600x400.png", dataAiHint: "sale discount", bgColor: "bg-primary/10", textColor: "text-primary-foreground", href: "/products?filter=sale" },
  { title: "New Arrivals", description: "Check out the latest trends.", image: "https://placehold.co/600x400.png", dataAiHint: "new products", bgColor: "bg-accent/10", textColor: "text-accent-foreground", href: "/products?filter=new" },
];

// HomePage is now an async Server Component
export default async function HomePage() {
  const featuredProductsData = await getFeaturedProducts();
  const weeklyDealsData = await getWeeklyDeals();

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
          {featuredProductsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProductsData.map((product) => (
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
            <p className="text-center text-muted-foreground">No featured products available at the moment. Check back soon!</p>
          )}
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
    