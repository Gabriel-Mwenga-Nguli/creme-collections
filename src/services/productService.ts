
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import type { CartItem } from '@/context/CartContext'; // For ProductDetails extension
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc, type DocumentSnapshot, type QueryDocumentSnapshot } from 'firebase/firestore';

// Base Product interface matching Firestore structure
export interface Product {
  id: string; // Document ID from Firestore
  name: string;
  description: string; // Short description for cards
  longDescription?: string; // Detailed description for product page
  image: string; // Main image URL
  images?: string[]; // Array of additional image URLs
  dataAiHint: string;
  offerPrice: number;
  originalPrice?: number;
  rating?: string | number;
  reviewsCount?: number;
  availability?: string;
  category?: string; // Main category name/slug
  categorySlug?: string; // Slug for main category
  subCategorySlug?: string; // Slug for sub-category
  brand?: string;
  stock?: number;
  isFeatured?: boolean;
  isWeeklyDeal?: boolean;
  // Add any other fields you have in Firestore for products
}

// Helper function to map Firestore doc to our Product interface
function mapDocToProduct(document: DocumentSnapshot | QueryDocumentSnapshot): Product {
  const data = document.data();
  if (!data) {
    // This case should ideally not happen if document exists, but good for robustness
    throw new Error(`Document data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id,
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '',
    image: data.image || 'https://placehold.co/400x400.png',
    images: data.images || (data.image ? [data.image] : ['https://placehold.co/100x100.png']),
    dataAiHint: data.dataAiHint || 'product',
    offerPrice: typeof data.offerPrice === 'number' ? data.offerPrice : 0,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    rating: data.rating,
    reviewsCount: typeof data.reviewsCount === 'number' ? data.reviewsCount : 0,
    availability: data.availability || 'N/A',
    category: data.category,
    categorySlug: data.categorySlug,
    subCategorySlug: data.subCategorySlug,
    brand: data.brand,
    stock: typeof data.stock === 'number' ? data.stock : 0,
    isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : false,
    isWeeklyDeal: typeof data.isWeeklyDeal === 'boolean' ? data.isWeeklyDeal : false,
  };
}


export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch featured products.");
    return [];
  }
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isFeatured', '==', true), limit(4));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => {
      const productData = mapDocToProduct(doc);
      return {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        image: productData.image,
        dataAiHint: productData.dataAiHint,
        fixedOfferPrice: productData.offerPrice,
        fixedOriginalPrice: productData.originalPrice,
      };
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products: ", error);
    return [];
  }
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch weekly deals.");
    return [];
  }
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isWeeklyDeal', '==', true), limit(6));
    const querySnapshot = await getDocs(q);

    const deals = querySnapshot.docs.map(doc => {
      const productData = mapDocToProduct(doc);
      return {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        image: productData.image,
        dataAiHint: productData.dataAiHint,
        fixedOfferPrice: productData.offerPrice, 
        fixedOriginalPrice: productData.originalPrice || productData.offerPrice * 1.2, 
      };
    });
    return deals;
  } catch (error) {
    console.error("Error fetching weekly deals: ", error);
    return [];
  }
}

export interface ProductDetailsPageData extends Product {
  // Inherits all from Product, can add more if needed for detail page specifically
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch product details.");
    return null;
  }
  try {
    const productDocRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productDocRef);

    if (productSnap.exists()) {
      return mapDocToProduct(productSnap) as ProductDetailsPageData;
    } else {
      console.log(`No such product document with ID: ${productId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product details for ID ${productId}: `, error);
    return null;
  }
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<ProductCardProps[]> {
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch all products.");
    return [];
  }
  try {
    const productsRef = collection(db, 'products');
    let q;

    if (subCategorySlugParam) {
       q = query(productsRef, where('categorySlug', '==', categorySlugParam), where('subCategorySlug', '==', subCategorySlugParam), limit(12));
    } else if (categorySlugParam) {
      q = query(productsRef, where('categorySlug', '==', categorySlugParam), limit(12));
    } else {
      q = query(productsRef, limit(12));
    }
    
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(docSn => { // Renamed doc to docSn to avoid conflict with doc from getDoc
      const productData = mapDocToProduct(docSn);
      return {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        image: productData.image,
        dataAiHint: productData.dataAiHint,
        fixedOfferPrice: productData.offerPrice,
        fixedOriginalPrice: productData.originalPrice,
      };
    });
    return products;
  } catch (error) {
    console.error("Error fetching all products: ", error);
    return [];
  }
}
    
