
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, limit, orderBy, Timestamp } from 'firebase/firestore';
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
  createdAt?: Date | Timestamp;
}

export interface ProductDetailsPageData extends Product {}

// Helper to convert Firestore Timestamps to serializable dates
const toSerializableObject = <T extends Record<string, any>>(obj: T): T => {
  for (const key in obj) {
    if (obj[key] instanceof Timestamp) {
      obj[key] = obj[key].toDate() as any;
    }
  }
  return obj;
};

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  const q = query(collection(db, "products"), where("isFeatured", "==", true), limit(8));
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image,
    dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  const q = query(collection(db, "products"), where("isWeeklyDeal", "==", true), limit(8));
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  
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
    const productData = toSerializableObject({ id: docSnap.id, ...docSnap.data() } as Product);
    return productData;
  }
  return null;
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  let q;
  const productsRef = collection(db, "products");

  if (subCategorySlugParam && categorySlugParam) {
    q = query(productsRef, where("categorySlug", "==", categorySlugParam), where("subCategorySlug", "==", subCategorySlugParam));
  } else if (categorySlugParam) {
    q = query(productsRef, where("categorySlug", "==", categorySlugParam));
  } else {
    q = query(productsRef, orderBy("name"));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
  const q = query(collection(db, "promotions"), where("isActive", "==", true), orderBy("displayOrder"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data() } as PromoSlideProps));
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch(e) {
    console.error("Error adding product: ", e);
    return null;
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<boolean> {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, productData);
    return true;
  } catch (e) {
    console.error("Error updating product: ", e);
    return false;
  }
}
