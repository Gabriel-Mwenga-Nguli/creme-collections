
import HeroSlider from '@/components/features/home/hero-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Award, Truck, Users, Mail } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import WeeklyDealsSlider from '@/components/features/home/weekly-deals-slider';
import { getFeaturedProducts, getWeeklyDeals } from '@/services/productService';
import { Input } from '@/components/ui/input'; 

const categoryHighlights = [
  { name: "Electronics", image: "/images/banners/electronics.png", dataAiHint: "latest gadgets", href: "/products/category/electronics" },
  { name: "Fashion", image: "/images/banners/fashion.png", dataAiHint: "stylish apparel", href: "/products/category/fashion" },
  { name: "Home Goods", image: "/images/banners/home.png", dataAiHint: "home decor", href: "/products/category/home-living" },
];

const promotionalBanners = [
  { title: "Weekend Sale Extravaganza", description: "Up to 50% off on selected items! Don't miss out.", image: "/images/promos/flash-sale.png", dataAiHint: "sale offer", bgColor: "bg-primary/10", textColor: "text-primary-foreground", href: "/products?filter=sale" },
  { title: "Fresh New Arrivals", description: "Check out the latest trends and must-have products.", image: "/images/promos/back-to-school.png", dataAiHint: "new products", bgColor: "bg-accent/10", textColor: "text-accent-foreground", href: "/products?filter=new" },
];

const whyChooseUsFeatures = [
  { title: "Quality You Can Trust", description: "Curated selection of high-quality items from top brands.", icon: Award, dataAiHint:"quality badge" },
  { title: "Reliable & Fast Delivery", description: "Swift and dependable shipping services across Kenya.", icon: Truck, dataAiHint:"delivery truck" },
  { title: "Dedicated Customer Support", description: "Our friendly team is always ready to assist you with any queries.", icon: Users, dataAiHint:"customer support" },
];

export default async function HomePage() {
  const featuredProductsData = await getFeaturedProducts();
  const weeklyDealsData = await getWeeklyDeals();

  return (
    <div className="flex flex-col">
      <HeroSlider />

      <section className="py-8 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-10">
            Shop Our Top Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors font-headline">{category.name}</h3>
                      <p className="mt-1 md:mt-2 text-sm text-muted-foreground">Discover the best in {category.name.toLowerCase()}.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-primary/5" id="weekly-deals">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8 md:mb-10">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline">
              Flash Deals of the Week!
            </h2>
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-2 sm:ml-3" />
          </div>
          <WeeklyDealsSlider deals={weeklyDealsData} />
        </div>
      </section>

      <section className="py-8 md:py-16 bg-secondary/20" id="why-choose-us">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-12">
            Why Choose Creme Collections?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {whyChooseUsFeatures.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center p-4 md:p-6 bg-card rounded-lg shadow-lg">
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5 md:mb-2 font-headline">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-8 md:py-16 bg-secondary/30" id="promotions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-10">
            Don't Miss Out!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {promotionalBanners.map((banner) => (
              <div key={banner.title} className="group block"> 
                <Card className={`overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary ${banner.bgColor}`}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                      <h3 className={`text-xl md:text-2xl font-semibold ${banner.textColor === 'text-primary-foreground' ? 'text-primary' : 'text-accent'} font-headline`}>{banner.title}</h3>
                      <p className={`mt-1.5 md:mt-2 text-sm ${banner.textColor === 'text-primary-foreground' ? 'text-primary/80' : 'text-accent/80'}`}>{banner.description}</p>
                      <Button asChild variant={banner.bgColor === 'bg-primary/10' ? 'default' : 'outline'} size="sm" className="mt-3 md:mt-4 w-fit">
                        <Link href={banner.href}>
                          Shop Now <ShoppingBag className="ml-2 h-4 w-4 inline" />
                        </Link>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-background" id="newsletter">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl md:max-w-2xl mx-auto text-center bg-card p-6 md:p-10 lg:p-12 rounded-xl shadow-xl border border-primary/20">
            <Mail className="w-10 h-10 sm:w-12 sm:w-12 text-primary mb-3 sm:mb-4 mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground sm:text-4xl font-headline mb-2 sm:mb-3">
              Stay Updated with Creme Collections
            </h2>
            <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
              Get the latest deals, new arrivals, and special offers directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-10 sm:h-12 text-sm sm:text-base sm:flex-grow" 
                aria-label="Email address for newsletter"
              />
              <Button type="submit" size="lg" className="h-10 sm:h-12 sm:w-auto text-sm sm:text-base">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-20 bg-background" id="new-arrivals">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-12">
            Featured Products
          </h2>
          {featuredProductsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProductsData.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
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
           <div className="text-center mt-8 md:mt-12">
            <Button asChild size="lg">
              <Link href="/products">
                Shop All Products <ShoppingBag className="ml-2 h-5 w-5 inline" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
