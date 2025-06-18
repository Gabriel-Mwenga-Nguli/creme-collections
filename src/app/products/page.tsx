
import type { Metadata } from 'next';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { List, Filter, LayoutGrid, ChevronsUpDown, Search, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal
import Link from 'next/link';
import { getAllProducts, type Product } from '@/services/productService';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile filters

export const metadata: Metadata = {
  title: 'All Products - Creme Collections',
  description: 'Browse all products available on Creme Collections, grouped by category and brand.',
};

interface GroupedProducts {
  [categoryName: string]: {
    categorySlug?: string;
    subCategories: {
      [subCategoryName: string]: {
        subCategorySlug?: string;
        brands: {
          [brandName: string]: Product[];
        };
      };
    };
  };
}

// Moved outside component for potential reusability or if Filters component is extracted
const FiltersContent = ({ categories, groupedProducts, uniqueBrands, priceRanges }: {
  categories: string[];
  groupedProducts: GroupedProducts;
  uniqueBrands: string[];
  priceRanges: { label: string; value: string }[];
}) => (
  <>
    <Accordion type="multiple" defaultValue={['category', 'brand', 'price']} className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger className="text-base font-medium">Category</AccordionTrigger>
        <AccordionContent className="space-y-1 pt-2 max-h-60 overflow-y-auto">
          {categories.map(cat => (
            <Button key={cat} variant="ghost" className="w-full justify-start text-sm h-8 px-2" asChild>
               <Link href={`/products/category/${groupedProducts[cat].categorySlug || cat.toLowerCase().replace(/\s+/g, '-')}`}>{cat}</Link>
            </Button>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="brand">
        <AccordionTrigger className="text-base font-medium">Brand</AccordionTrigger>
        <AccordionContent className="space-y-1 pt-2 max-h-60 overflow-y-auto">
          {uniqueBrands.map(brand => (
            <Button key={brand} variant="ghost" className="w-full justify-start text-sm h-8 px-2">{brand}</Button>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger className="text-base font-medium">Price</AccordionTrigger>
        <AccordionContent className="space-y-2 pt-2">
          <Select>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    <Button className="w-full mt-4" variant="outline">Apply Filters</Button>
    <Button className="w-full mt-2" variant="ghost">Clear Filters</Button>
  </>
);


export default async function AllProductsPage() {
  const products = await getAllProducts();

  const groupProducts = (products: Product[]): GroupedProducts => {
    return products.reduce<GroupedProducts>((acc, product) => {
      const categoryName = product.category || 'Uncategorized';
      const subCategoryName = product.subCategory || 'General';
      const brandName = product.brand || 'Unbranded';

      if (!acc[categoryName]) {
        acc[categoryName] = { categorySlug: product.categorySlug, subCategories: {} };
      }
      if (!acc[categoryName].subCategories[subCategoryName]) {
        acc[categoryName].subCategories[subCategoryName] = { subCategorySlug: product.subCategorySlug, brands: {} };
      }
      if (!acc[categoryName].subCategories[subCategoryName].brands[brandName]) {
        acc[categoryName].subCategories[subCategoryName].brands[brandName] = [];
      }
      acc[categoryName].subCategories[subCategoryName].brands[brandName].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupProducts(products);
  const categories = Object.keys(groupedProducts).sort();

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand || 'Unbranded'))).sort();
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under KES 1,000", value: "0-1000" },
    { label: "KES 1,000 - KES 5,000", value: "1000-5000" },
    { label: "KES 5,000 - KES 10,000", value: "5000-10000" },
    { label: "Over KES 10,000", value: "10000+" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline">All Products</h1>
        <p className="text-muted-foreground mt-1">Explore our entire collection, organized for your convenience.</p>
      </div>

      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Show Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
             <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-primary" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
                 <FiltersContent categories={categories} groupedProducts={groupedProducts} uniqueBrands={uniqueBrands} priceRanges={priceRanges} />
              </CardContent>
          </SheetContent>
        </Sheet>
      </div>


      <div className="grid lg:grid-cols-4 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Filter className="mr-2 h-5 w-5 text-primary" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FiltersContent categories={categories} groupedProducts={groupedProducts} uniqueBrands={uniqueBrands} priceRanges={priceRanges} />
            </CardContent>
          </Card>
          <Button variant="secondary" className="w-full mt-6" asChild>
            <Link href="/search-page">
                <Search className="mr-2 h-4 w-4" /> Advanced Search
            </Link>
          </Button>
        </aside>

        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <List className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/30 mb-4 sm:mb-6" />
              <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">No products found.</p>
              <p className="text-muted-foreground">Our catalog is currently empty. Please check back later!</p>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-12">
              {categories.map(categoryName => (
                <section key={categoryName} aria-labelledby={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h2 id={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl md:text-2xl font-bold text-primary font-headline mb-4 md:mb-6 pb-2 border-b-2 border-primary">
                    {categoryName}
                  </h2>
                  {Object.entries(groupedProducts[categoryName].subCategories).map(([subCategoryName, subCategoryData]) => (
                    <section key={subCategoryName} aria-labelledby={`subcategory-${subCategoryName.toLowerCase().replace(/\s+/g, '-')}`} className="mb-8 md:mb-10">
                      {subCategoryName !== 'General' && (
                        <h3 id={`subcategory-${subCategoryName.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 ml-0 md:ml-2">
                          {subCategoryName}
                        </h3>
                      )}
                      {Object.entries(subCategoryData.brands).map(([brandName, brandProducts]) => (
                        <div key={brandName} className="mb-6 md:mb-8">
                          {brandName !== 'Unbranded' && (
                             <h4 className="text-base md:text-lg font-medium text-muted-foreground mb-2 md:mb-3 ml-0 md:ml-4">{brandName}</h4>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {brandProducts.map((product) => (
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
                        </div>
                      ))}
                    </section>
                  ))}
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
