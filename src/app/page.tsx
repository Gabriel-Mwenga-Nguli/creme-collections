

import HeroSlider from '@/components/features/home/hero-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Award, Truck, Users, Mail, ShieldCheck, Gift, Percent, Smartphone, Shirt, Home as HomeIconLucide, Briefcase, Package, Power } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import WeeklyDealsSlider from '@/components/features/home/weekly-deals-slider';
import { getFeaturedProducts, getWeeklyDeals, getPromotions } from '@/services/productService'; // Added getPromotions
import { Input } from '@/components/ui/input';
import NewsletterPopup from '@/components/features/home/NewsletterPopup';
import ServicesHighlight from '@/components/features/home/ServicesHighlight';
import PromotionalOfferSlider, { type PromoSlideProps } from '@/components/features/home/PromotionalOfferSlider';
import { cn } from '@/lib/utils';
import BlackFridayDeals from '@/components/features/home/BlackFridayDeals';


const categoryHighlights = [
  { name: "Electronics", image: "/images/banners/electronics.png", dataAiHint: "latest gadgets", href: "/products/category/electronics", icon: Smartphone },
  { name: "Fashion", image: "/images/banners/fashion.png", dataAiHint: "stylish apparel", href: "/products/category/fashion", icon: Shirt },
  { name: "Home Goods", image: "/images/banners/home.png", dataAiHint: "home decor", href: "/products/category/home-living", icon: HomeIconLucide },
];

const promotionalBannersData = [
  {
    title: "Weekend Flash Sale!",
    description: "Massive discounts up to 50% off. Limited time only!",
    image: "/images/promos/flash-sale.png",
    dataAiHint: "flash sale discount",
    overlayColor: "bg-red-700/60",
    textColor: "text-white",
    href: "/products/category/electronics",
    buttonText: "Shop Flash Sale"
  },
  {
    title: "Back to School Bonanza",
    description: "All your essentials for the new term. Notebooks, bags, & more!",
    image: "/images/promos/back-to-school.png",
    dataAiHint: "school supplies",
    overlayColor: "bg-sky-800/60",
    textColor: "text-white",
    href: "/products/category/books-office-stationery/school-supplies",
    buttonText: "Get School Ready"
  },
   {
    title: "New Arrivals Daily",
    description: "Discover the latest trends and freshest products added just for you.",
    image: "/images/banners/promo1.png",
    dataAiHint: "new products showcase",
    overlayColor: "bg-slate-800/60",
    textColor: "text-white",
    href: "/products/category/beauty-personal-care/fragrances",
    buttonText: "Explore New In"
  },
  {
    title: "Creme Collection Exclusives",
    description: "Unique finds and special items you won't get anywhere else.",
    image: "/images/banners/promo2.png",
    dataAiHint: "exclusive items",
    overlayColor: "bg-purple-800/50",
    textColor: "text-white",
    href: "/products/category/fashion/bags-luggage",
    buttonText: "Discover Exclusives"
  },
];

const whyChooseUsFeatures = [
  { title: "Quality You Can Trust", description: "Curated selection of high-quality items from top brands.", icon: Award, dataAiHint:"quality badge" },
  { title: "Reliable & Fast Delivery", description: "Swift and dependable shipping services across Kenya.", icon: Truck, dataAiHint:"delivery truck" },
  { title: "Dedicated Customer Support", description: "Our friendly team is always ready to assist you with any queries.", icon: Users, dataAiHint:"customer support" },
  { title: "Secure Online Shopping", description: "Shop with confidence using our secure payment gateways.", icon: ShieldCheck, dataAiHint:"secure payment" },
];


export default async function HomePage() {
  const featuredProductsData = await getFeaturedProducts();
  const weeklyDealsData = await getWeeklyDeals();
  const promotionsData = await getPromotions(); // Fetch promotions from Firestore

  return (
    <div className="flex flex-col">
      <NewsletterPopup />
      <HeroSlider />
      <BlackFridayDeals deals={weeklyDealsData} />

      <section className="py-10 md:py-16 bg-background animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out">
        <ServicesHighlight />
      </section>

      <section className="py-10 md:py-16 bg-slate-100 dark:bg-slate-800/30 animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline mb-10 md:mb-14">
            Top Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categoryHighlights.map((category) => (
              <Link href={category.href} key={category.name} className="group block">
                <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl hover:border-primary transform group-hover:-translate-y-1.5 bg-card rounded-xl">
                  <CardContent className="p-0">
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={category.dataAiHint}
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-1.5">
                        <category.icon className="w-6 h-6 text-primary mr-2.5 transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110" />
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors font-headline">{category.name}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">Explore the best in {category.name.toLowerCase()}.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-background animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline mb-10 md:mb-14">
            Special Offers & Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {promotionalBannersData.map((banner, index) => (
              <Link href={banner.href} key={banner.title} className="group block">
                <Card className="relative overflow-hidden bg-card min-h-[300px] sm:min-h-[350px] flex flex-col rounded-xl transition-all duration-300 ease-in-out group-hover:shadow-2xl hover:ring-2 hover:ring-primary/50 group-hover:transform group-hover:scale-[1.02]">
                   <div className="absolute inset-0 z-0">
                     <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint={banner.dataAiHint}
                      />
                      <div className={cn("absolute inset-0 transition-opacity duration-300 group-hover:opacity-90", banner.overlayColor || 'bg-black/40')} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between flex-grow p-6 md:p-8">
                    <div>
                      <h3 className={cn("text-3xl md:text-4xl font-extrabold font-headline drop-shadow-lg leading-tight", banner.textColor || 'text-white')}>{banner.title}</h3>
                      <p className={cn("mt-3 text-base md:text-lg opacity-90 max-w-xs drop-shadow-lg", banner.textColor || 'text-white')}>{banner.description}</p>
                    </div>
                    <Button variant={index % 2 === 0 ? "default" : "secondary"} size="lg" className="mt-6 w-fit self-start text-base px-7 py-3.5 font-semibold group-hover:bg-opacity-90 transition-transform duration-300 group-hover:scale-105" aria-label={banner.buttonText}>
                       {banner.buttonText} <ShoppingBag className="ml-2.5 h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-primary/5 animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-300" id="weekly-deals">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-10 md:mb-14">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mr-3 sm:mr-4" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline">
              Flash Deals of the Week!
            </h2>
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary ml-3 sm:ml-4" />
          </div>
          <WeeklyDealsSlider deals={weeklyDealsData} />
        </div>
      </section>

       <section className="py-10 md:py-16 bg-background animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-400" id="featured-products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline mb-10 md:mb-14">
            Featured Products
          </h2>
          {featuredProductsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
           <div className="text-center mt-10 md:mt-14">
            <Button asChild size="lg" variant="default" className="px-10 py-6 text-lg">
              <Link href="/products">
                Shop All Products <ShoppingBag className="ml-2 h-5 w-5 inline" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-slate-100 dark:bg-slate-800/30 animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-500" id="promotions-slider">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground md:text-5xl font-headline mb-10 md:mb-14 text-center">
            Today's Best Promotions
          </h2>
          <PromotionalOfferSlider promos={promotionsData} />
        </div>
      </section>


      <section className="py-10 md:py-16 bg-secondary/20 animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-600" id="why-choose-us">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline mb-10 md:mb-14">
            Why Choose Creme Collections?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            {whyChooseUsFeatures.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center p-6 md:p-8 bg-card rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary border-2 border-transparent">
                <feature.icon className="w-12 h-12 sm:w-14 sm:h-14 text-primary mb-5 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 font-headline">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background animate-in fade-in-0 slide-in-from-bottom-12 duration-700 ease-out delay-700" id="newsletter-cta">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12 lg:p-16 rounded-2xl shadow-xl border border-primary/20 max-w-none">
            <Mail className="w-12 h-12 sm:w-14 sm:h-14 text-primary mb-5 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground sm:text-5xl font-headline mb-4">
              Stay Updated with Creme Collections
            </h2>
            <p className="text-muted-foreground mb-8 text-base md:text-lg">
              Get the latest deals, new arrivals, and special offers directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-12 sm:h-14 text-base sm:text-lg sm:flex-grow rounded-lg"
                aria-label="Email address for newsletter"
              />
              <Button type="submit" size="lg" className="h-12 sm:h-14 sm:w-auto text-base sm:text-lg px-8 rounded-lg">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-5">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
