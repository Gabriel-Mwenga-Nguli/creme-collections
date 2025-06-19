
import HeroSlider from '@/components/features/home/hero-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Award, Truck, Users, Mail, ShieldCheck, Gift, Percent, Smartphone, Shirt, Home as HomeIconLucide, Briefcase } from 'lucide-react';
import ProductCard from '@/components/features/home/product-card';
import WeeklyDealsSlider from '@/components/features/home/weekly-deals-slider';
import { getFeaturedProducts, getWeeklyDeals } from '@/services/productService';
import { Input } from '@/components/ui/input';
import NewsletterPopup from '@/components/features/home/NewsletterPopup';
import ServicesHighlight from '@/components/features/home/ServicesHighlight';
import BrandShowcase from '@/components/features/home/BrandShowcase';

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
    overlayColor: "bg-black/40", // Darker overlay for red image
    textColor: "text-white", 
    href: "/products?filter=sale",
    buttonText: "Shop Flash Sale"
  },
  { 
    title: "Back to School Bonanza", 
    description: "All your essentials for the new term. Notebooks, bags, & more!", 
    image: "/images/promos/back-to-school.png", 
    dataAiHint: "school supplies", 
    overlayColor: "bg-slate-800/50", // Darker overlay for light image
    textColor: "text-white", 
    href: "/products/category/books-office-stationery/school-supplies",
    buttonText: "Get School Ready"
  },
   { 
    title: "New Arrivals Daily", 
    description: "Discover the latest trends and freshest products added just for you.", 
    image: "/images/banners/promo1.png", 
    dataAiHint: "new products showcase", 
    overlayColor: "bg-black/50", // Stronger overlay for complex image
    textColor: "text-white", 
    href: "/products?filter=new",
    buttonText: "Explore New In"
  },
  { 
    title: "Creme Collection Exclusives", 
    description: "Unique finds and special items you won't get anywhere else.", 
    image: "/images/banners/promo2.png", 
    dataAiHint: "exclusive items", 
    overlayColor: "bg-black/40", // Darker overlay for purple image
    textColor: "text-white", 
    href: "/products?filter=exclusive",
    buttonText: "Discover Exclusives"
  },
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
      <NewsletterPopup />
      <HeroSlider />

      <section className="py-8 md:py-12 bg-background animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesHighlight />
        </div>
      </section>

      <section className="py-8 md:py-12 bg-slate-100 dark:bg-slate-800/30 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-10">
            Top Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categoryHighlights.map((category) => (
              <Link href={category.href} key={category.name} className="group block">
                <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl hover:border-primary transform group-hover:-translate-y-1 bg-card">
                  <CardContent className="p-0">
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={225}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={category.dataAiHint}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <category.icon className="w-5 h-5 text-primary mr-2" />
                        <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors font-headline">{category.name}</h3>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Explore the best in {category.name.toLowerCase()}.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-8 md:py-12 bg-background animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-10">
            Special Offers & Promotions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {promotionalBannersData.map((banner, index) => (
              <Link href={banner.href} key={banner.title} className="group block">
                <Card className="relative overflow-hidden bg-card min-h-[280px] sm:min-h-[320px] flex flex-col rounded-xl transition-all duration-300 ease-in-out group-hover:shadow-2xl hover:ring-2 hover:ring-primary/50">
                  <div className="absolute inset-0 z-0">
                     <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={banner.dataAiHint}
                      />
                      <div className={`absolute inset-0 ${banner.overlayColor}`} />
                  </div>
                  <div className="relative z-10 flex flex-col justify-between flex-grow p-6">
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-extrabold ${banner.textColor} font-headline drop-shadow-lg`}>{banner.title}</h3>
                      <p className={`mt-2 text-sm md:text-md ${banner.textColor} opacity-90 max-w-xs drop-shadow-lg`}>{banner.description}</p>
                    </div>
                    <Button variant={index % 2 === 0 ? "default" : "secondary"} size="lg" className="mt-4 w-fit self-start text-sm" aria-label={banner.buttonText}>
                       {banner.buttonText} <ShoppingBag className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-primary/5 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-300" id="weekly-deals">
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
      
       <section className="py-8 md:py-12 bg-background animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-400" id="featured-products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-10">
            Featured Products
          </h2>
          {featuredProductsData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <Button asChild size="lg" variant="default">
              <Link href="/products">
                Shop All Products <ShoppingBag className="ml-2 h-5 w-5 inline" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-8 md:py-12 bg-slate-100 dark:bg-slate-800/30 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-500" id="brands">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BrandShowcase />
        </div>
      </section>


      <section className="py-8 md:py-12 bg-secondary/20 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-600" id="why-choose-us">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-12">
            Why Choose Creme Collections?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {whyChooseUsFeatures.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 font-headline">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-8 md:py-16 bg-background animate-in fade-in-0 slide-in-from-bottom-10 duration-500 ease-out delay-700" id="newsletter-cta">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl md:max-w-2xl mx-auto text-center bg-card p-8 md:p-10 lg:p-12 rounded-xl shadow-xl border border-primary/20">
            <Mail className="w-10 h-10 sm:w-12 sm:w-12 text-primary mb-4 mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground sm:text-4xl font-headline mb-3">
              Stay Updated with Creme Collections
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
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
            <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
