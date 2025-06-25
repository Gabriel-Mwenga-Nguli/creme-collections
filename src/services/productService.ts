
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
  createdAt?: Timestamp; // Use Firestore Timestamp
}

export interface ProductDetailsPageData extends Product {}

// Helper function to convert Firestore doc to Product object
const productFromDoc = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt, // Timestamps are handled automatically
  } as Product;
};

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  const q = query(collection(db, "products"), where("isFeatured", "==", true), limit(8));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const p = productFromDoc(doc);
    return {
      id: p.id, name: p.name, description: p.description, image: p.image,
      dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
      rating: p.rating, reviewsCount: p.reviewsCount,
    }
  });
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  const q = query(collection(db, "products"), where("isWeeklyDeal", "==", true), limit(12));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const p = productFromDoc(doc);
    return {
      id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
      fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
      rating: p.rating, reviewsCount: p.reviewsCount,
    }
  });
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return productFromDoc(docSnap) as ProductDetailsPageData;
  }
  return null;
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  let q;
  const productsRef = collection(db, "products");
  
  if (categorySlugParam && subCategorySlugParam) {
    q = query(productsRef, where("categorySlug", "==", categorySlugParam), where("subCategorySlug", "==", subCategorySlugParam));
  } else if (categorySlugParam) {
    q = query(productsRef, where("categorySlug", "==", categorySlugParam));
  } else {
    q = query(productsRef, orderBy("createdAt", "desc"), limit(50)); // Get latest 50 if no filter
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(productFromDoc);
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
  const q = query(collection(db, "promotions"), where("isActive", "==", true), orderBy("displayOrder", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as PromoSlideProps);
}

// Function to add a product (for admin panel)
export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp() // Set creation time on the server
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product to Firestore:", error);
    return null;
  }
}

// Function to update a product (for admin panel)
export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<boolean> {
  try {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, productData);
    return true;
  } catch (error) {
    console.error("Error updating product in Firestore:", error);
    return false;
  }
}
