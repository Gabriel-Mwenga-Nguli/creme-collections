
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal
import { CATEGORY_NAV_LINKS } from '@/lib/constants';
import { getAllProducts, type Product } from '@/services/productService'; 
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'; // For mobile filters
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // For filter card look
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // For filter sections
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For price filter

function formatSlugPart(slugPart: string): string {
  if (!slugPart) return '';
  return slugPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface PageProps {
  params: { slug: string[] };
}

function getCategoryInfo(slug: string[]) {
  const categorySlug = slug[0];
  const subCategorySlug = slug[1];

  const category = CATEGORY_NAV_LINKS.find(cat => cat.href.endsWith(categorySlug));
  if (!category) return null;

  if (subCategorySlug) {
    const subCategory = category.subLinks?.find(sub => sub.href.endsWith(subCategorySlug));
    if (!subCategory) return null; 
    return {
      categoryName: formatSlugPart(categorySlug),
      categoryHref: category.href,
      categorySlug: categorySlug,
      subCategoryName: formatSlugPart(subCategorySlug),
      subCategoryHref: subCategory.href,
      subCategorySlug: subCategorySlug,
      pageTitle: `${formatSlugPart(subCategorySlug)} - ${formatSlugPart(categorySlug)}`,
      heading: `Shop ${formatSlugPart(subCategorySlug)} in ${formatSlugPart(categorySlug)}`,
      aiHint: `${formatSlugPart(categorySlug).toLowerCase()} ${formatSlugPart(subCategorySlug).toLowerCase()}`.substring(0,50).split(' ').slice(0,2).join(' ')
    };
  }

  return {
    categoryName: formatSlugPart(categorySlug),
    categoryHref: category.href,
    categorySlug: categorySlug,
    subCategoryName: null,
    subCategoryHref: null,
    subCategorySlug: null,
    pageTitle: `${formatSlugPart(categorySlug)} Products`,
    heading: `Explore ${formatSlugPart(categorySlug)}`,
    aiHint: formatSlugPart(categorySlug).toLowerCase().split(' ').slice(0,2).join(' ')
  };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const categoryInfo = getCategoryInfo(params.slug);

  if (!categoryInfo) {
    return {
      title: 'Category Not Found - Creme Collections',
      description: 'The category you are looking for does not exist.',
    };
  }
  
  return {
    title: `${categoryInfo.pageTitle} - Creme Collections`,
    description: `Browse our selection of ${categoryInfo.pageTitle.toLowerCase()} at Creme Collections.`,
  };
}

const FiltersSidebarContent = ({ uniqueBrands, priceRanges, currentCategory, currentSubCategory }: {
  uniqueBrands: string[];
  priceRanges: { label: string; value: string }[];
  currentCategory?: { name: string; slug: string | undefined };
  currentSubCategory?: { name: string; slug: string | undefined };
}) => (
  <Card className="shadow-none border-none lg:shadow-md lg:border">
    <CardHeader className="px-4 py-3 lg:p-6">
      <CardTitle className="text-lg lg:text-xl font-semibold flex items-center">
        Filters
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 py-3 lg:p-6 space-y-4 lg:space-y-6">
      <Accordion type="multiple" defaultValue={['brand', 'price']} className="w-full">
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm lg:text-base font-medium">Brand</AccordionTrigger>
          <AccordionContent className="space-y-1 pt-2 max-h-48 lg:max-h-60 overflow-y-auto">
            {uniqueBrands.map(brand => (
              <Button key={brand} variant="ghost" className="w-full justify-start text-xs lg:text-sm h-7 lg:h-8 px-2">{brand}</Button>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm lg:text-base font-medium">Price</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <Select>
              <SelectTrigger className="w-full h-8 lg:h-9 text-xs lg:text-sm">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value} className="text-xs lg:text-sm">{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button className="w-full mt-3 lg:mt-4 text-xs lg:text-sm" variant="outline">Apply Filters</Button>
      <Button className="w-full mt-1 lg:mt-2 text-xs lg:text-sm" variant="ghost">Clear Filters</Button>
    </CardContent>
  </Card>
);


export default async function CategoryPage({ params }: PageProps) {
  const categoryInfo = getCategoryInfo(params.slug);

  if (!categoryInfo) {
    notFound(); 
  }

  const products: Product[] = await getAllProducts(categoryInfo.categorySlug, categoryInfo.subCategorySlug || undefined);
  
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand || 'Unbranded'))).sort();
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under KES 1,000", value: "0-1000" },
    { label: "KES 1,000 - KES 5,000", value: "1000-5000" },
    { label: "KES 5,000 - KES 10,000", value: "5000-10000" },
    { label: "Over KES 10,000", value: "10000+" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <nav className="mb-4 md:mb-6 flex items-center space-x-1.5 md:space-x-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center">
          <Home className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-1.5" /> Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <Link href={categoryInfo.categoryHref} className="hover:text-primary">
          {categoryInfo.categoryName}
        </Link>
        {categoryInfo.subCategoryName && categoryInfo.subCategoryHref && (
          <>
            <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <Link href={categoryInfo.subCategoryHref} className="hover:text-primary">
              {categoryInfo.subCategoryName}
            </Link>
          </>
        )}
      </nav>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 md:mb-6 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground font-headline">{categoryInfo.heading}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="lg:hidden self-end sm:self-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <FiltersSidebarContent 
                uniqueBrands={uniqueBrands} 
                priceRanges={priceRanges} 
                currentCategory={{name: categoryInfo.categoryName, slug: categoryInfo.categorySlug}}
                currentSubCategory={categoryInfo.subCategoryName ? {name: categoryInfo.subCategoryName, slug: categoryInfo.subCategorySlug} : undefined}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>


      <div className="grid lg:grid-cols-4 gap-6 md:gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <FiltersSidebarContent 
            uniqueBrands={uniqueBrands} 
            priceRanges={priceRanges}
            currentCategory={{name: categoryInfo.categoryName, slug: categoryInfo.categorySlug}}
            currentSubCategory={categoryInfo.subCategoryName ? {name: categoryInfo.subCategoryName, slug: categoryInfo.subCategorySlug} : undefined}
          />
        </aside>

        <main className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  dataAiHint={product.dataAiHint}
                  fixedOfferPrice={product.offerPrice} 
                  fixedOriginalPrice={product.originalPrice} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 col-span-full">
              <p className="text-lg sm:text-xl text-foreground">No products found in this category yet.</p>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">Check back soon or explore other categories!</p>
              <Button asChild className="mt-4 sm:mt-6">
                <Link href="/products/category/electronics">Explore Electronics</Link> 
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
