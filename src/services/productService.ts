
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import type { PromoSlideProps } from '@/lib/types';


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
  createdAt?: Timestamp;
  sku?: string;
}

export interface ProductDetailsPageData extends Product {}

// Helper to convert Firestore doc to Product object
const fromFirestore = (doc: any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    } as Product;
};

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  const q = query(collection(db, "products"), where("isFeatured", "==", true), limit(10));
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(fromFirestore);
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image,
    dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  const q = query(collection(db, "products"), where("isWeeklyDeal", "==", true), limit(10));
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(fromFirestore);
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
    fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return fromFirestore(docSnap) as ProductDetailsPageData;
  } else {
    console.log("No such product!");
    return null;
  }
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  let q = query(collection(db, "products"));

  if (categorySlugParam) {
    q = query(q, where("categorySlug", "==", categorySlugParam));
  }
  if (subCategorySlugParam) {
    q = query(q, where("subCategorySlug", "==", subCategorySlugParam));
  }

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error getting products: ", error);
    // Firestore might require an index for this query.
    // The error message in the console will include a link to create it.
    return [];
  }
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
  // This could also be fetched from a 'promotions' collection in Firestore
  // For now, returning static data as it's less likely to change frequently
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


export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: Timestamp.now(),
    });
    console.log("Product written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding product: ", e);
    return null;
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<boolean> {
  const productRef = doc(db, "products", productId);
  try {
    await updateDoc(productRef, productData);
    console.log(`Product ${productId} updated successfully.`);
    return true;
  } catch(e) {
    console.error(`Error updating product ${productId}: `, e);
    return false;
  }
}
