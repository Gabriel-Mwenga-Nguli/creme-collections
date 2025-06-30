
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import type { PromoSlideProps } from '@/lib/types';
import { getProductsFromLoyverse, getProductByIdFromLoyverse } from './loyverseService';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  dataAiHint: string;
  offerPrice: number;
  originalPrice?: number;
  rating?: string | number;
  reviewsCount?: number;
  availability?: string;
  category?: string;
  categorySlug?: string;
  subCategory?: string;
  subCategorySlug?: string;
  brand?: string;
  stock?: number;
  isFeatured?: boolean;
  isWeeklyDeal?: boolean;
  createdAt?: Date;
  loyverseId?: string;
  sku?: string;
}

export interface ProductDetailsPageData extends Product {}

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  console.log("Fetching featured products from Loyverse service...");
  const products = await getProductsFromLoyverse({ featured: true, limit: 10 });
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image,
    dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  console.log("Fetching weekly deals from Loyverse service...");
  const products = await getProductsFromLoyverse({ weeklyDeal: true, limit: 10 });
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
    fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  console.log(`Fetching details for product ID ${productId} from Loyverse service...`);
  return getProductByIdFromLoyverse(productId);
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  console.log("Fetching all products from Loyverse service...");
  const products = await getProductsFromLoyverse();
  
  if (!categorySlugParam && !subCategorySlugParam) {
    return products;
  }
  
  let filteredProducts = products;
  if (categorySlugParam) {
    console.log(`Filtering for category: ${categorySlugParam}`);
    filteredProducts = filteredProducts.filter(p => p.categorySlug === categorySlugParam);
  }
  if (subCategorySlugParam) {
    console.log(`Filtering for sub-category: ${subCategorySlugParam}`);
    filteredProducts = filteredProducts.filter(p => p.subCategorySlug === subCategorySlugParam);
  }
  
  return filteredProducts;
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
    // Promotions are managed separately and not in Loyverse
    return [
        {
          type: 'firstOrder', title: 'Ksh 500 Off!', subtitle: 'Your First Creme Collections Order', code: 'KARIBU500',
          terms: '*Min. spend Ksh 2,500. T&Cs apply.', href: '/products', dataAiHint: 'first order discount',
          backgroundColor: 'bg-gradient-to-br from-primary to-accent', foregroundColor: 'text-primary-foreground',
          accentColor: 'text-white', displayOrder: 1, isActive: true,
        },
        {
          type: 'revealCode', title: 'Fashion Finds', subtitle: 'Up to 20% Off Select Apparel', actionText: 'TAP TO REVEAL',
          codePlaceholder: 'CODE', productImage: '/images/banners/fashion.png', href: '/products/category/fashion',
          dataAiHint: 'fashion apparel sale', backgroundColor: 'bg-secondary', foregroundColor: 'text-secondary-foreground',
          accentColor: 'text-primary border-primary', displayOrder: 3, isActive: true,
        }
    ];
}

// These functions are no longer needed as they write to the database.
// They are kept here but return dummy data to avoid breaking imports.
export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
  console.log("[DEV MODE] addProduct is a mock function and does not write to Loyverse. Data:", productData);
  return `mock_product_id_${Date.now()}`;
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<boolean> {
  console.log(`[DEV MODE] updateProduct is a mock function and does not write to Loyverse. ID: ${productId}, Data:`, productData);
  return true;
}
