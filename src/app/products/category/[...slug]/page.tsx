
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/features/home/product-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORY_NAV_LINKS } from '@/lib/constants';
import { getAllProducts, type Product } from '@/services/productService'; // Import Firestore service

// Helper to format slug parts into readable titles
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

// Find category and subcategory info from constants
function getCategoryInfo(slug: string[]) {
  const categorySlug = slug[0];
  const subCategorySlug = slug[1];

  const category = CATEGORY_NAV_LINKS.find(cat => cat.href.endsWith(categorySlug));
  if (!category) return null;

  if (subCategorySlug) {
    const subCategory = category.subLinks?.find(sub => sub.href.endsWith(subCategorySlug));
    if (!subCategory) return null; // Subcategory specified in URL but not found
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


export default async function CategoryPage({ params }: PageProps) {
  const categoryInfo = getCategoryInfo(params.slug);

  if (!categoryInfo) {
    notFound(); 
  }

  // Fetch products from Firestore based on category/subcategory slugs
  // getAllProducts now returns Product[]
  const products: Product[] = await getAllProducts(categoryInfo.categorySlug, categoryInfo.subCategorySlug || undefined);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center">
          <Home className="h-4 w-4 mr-1.5" /> Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={categoryInfo.categoryHref} className="hover:text-primary">
          {categoryInfo.categoryName}
        </Link>
        {categoryInfo.subCategoryName && categoryInfo.subCategoryHref && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link href={categoryInfo.subCategoryHref} className="hover:text-primary">
              {categoryInfo.subCategoryName}
            </Link>
          </>
        )}
      </nav>

      <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline mb-2">{categoryInfo.heading}</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Browse our curated selection of {categoryInfo.subCategoryName ? categoryInfo.subCategoryName.toLowerCase() : categoryInfo.categoryName.toLowerCase()} products.
      </p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              dataAiHint={product.dataAiHint}
              fixedOfferPrice={product.offerPrice} // map from Product to ProductCardProps
              fixedOriginalPrice={product.originalPrice} // map from Product to ProductCardProps
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-foreground">No products found in this category yet.</p>
          <p className="text-muted-foreground mt-2">Check back soon or explore other categories!</p>
          <Button asChild className="mt-6">
            <Link href="/products/category/electronics">Explore Electronics</Link> 
          </Button>
        </div>
      )}
    </div>
  );
}

    
