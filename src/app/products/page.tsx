
import type { Metadata } from 'next';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { List, Filter, LayoutGrid, ChevronsUpDown, Search } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, type Product } from '@/services/productService';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'All Products - Creme Lite',
  description: 'Browse all products available on Creme Lite, grouped by category and brand.',
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

  // Placeholder for unique brands and price ranges for filters
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
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline">All Products</h1>
        <p className="text-muted-foreground mt-1">Explore our entire collection, organized for your convenience.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 sticky top-24">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Filter className="mr-2 h-5 w-5 text-primary" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="multiple" defaultValue={['category', 'brand', 'price']} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base font-medium">Category</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2">
                    {categories.map(cat => (
                      <Button key={cat} variant="ghost" className="w-full justify-start text-sm" asChild>
                         <Link href={`/products/category/${groupedProducts[cat].categorySlug || cat.toLowerCase().replace(/\s+/g, '-')}`}>{cat}</Link>
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brand">
                  <AccordionTrigger className="text-base font-medium">Brand</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                    {uniqueBrands.map(brand => (
                      <Button key={brand} variant="ghost" className="w-full justify-start text-sm">{brand}</Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                  <AccordionTrigger className="text-base font-medium">Price</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2">
                    <Select>
                      <SelectTrigger className="w-full">
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
            </CardContent>
          </Card>
          <Button variant="secondary" className="w-full mt-6" asChild>
            <Link href="/search-page">
                <Search className="mr-2 h-4 w-4" /> Advanced Search
            </Link>
          </Button>
        </aside>

        {/* Products Display Area */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <List className="mx-auto h-20 w-20 text-muted-foreground/30 mb-6" />
              <p className="text-xl font-semibold text-foreground mb-2">No products found.</p>
              <p className="text-muted-foreground">Our catalog is currently empty. Please check back later!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map(categoryName => (
                <section key={categoryName} aria-labelledby={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h2 id={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-bold text-primary font-headline mb-6 pb-2 border-b-2 border-primary">
                    {categoryName}
                  </h2>
                  {Object.entries(groupedProducts[categoryName].subCategories).map(([subCategoryName, subCategoryData]) => (
                    <section key={subCategoryName} aria-labelledby={`subcategory-${subCategoryName.toLowerCase().replace(/\s+/g, '-')}`} className="mb-10">
                      {subCategoryName !== 'General' && (
                        <h3 id={`subcategory-${subCategoryName.toLowerCase().replace(/\s+/g, '-')}`} className="text-xl font-semibold text-foreground mb-4 ml-2">
                          {subCategoryName}
                        </h3>
                      )}
                      {Object.entries(subCategoryData.brands).map(([brandName, brandProducts]) => (
                        <div key={brandName} className="mb-8">
                          {brandName !== 'Unbranded' && (
                             <h4 className="text-lg font-medium text-muted-foreground mb-3 ml-4">{brandName}</h4>
                          )}
                          <div className={`grid grid-cols-1 sm:grid-cols-2 ${subCategoryName !== 'General' || brandName !== 'Unbranded' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 md:gap-6`}>
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
