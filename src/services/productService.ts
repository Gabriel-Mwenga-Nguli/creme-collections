
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import type { CartItem } from '@/context/CartContext'; // For ProductDetails extension
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';

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
  category?: string;
  brand?: string;
  stock?: number;
  isFeatured?: boolean;
  isWeeklyDeal?: boolean;
  // Add any other fields you have in Firestore for products
}

// Helper function to map Firestore doc to our Product interface
function mapDocToProduct(document: any): Product {
  const data = document.data();
  return {
    id: document.id,
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '',
    image: data.image || 'https://placehold.co/400x400.png',
    images: data.images || (data.image ? [data.image] : ['https://placehold.co/100x100.png']),
    dataAiHint: data.dataAiHint || 'product',
    offerPrice: data.offerPrice || 0,
    originalPrice: data.originalPrice,
    rating: data.rating,
    reviewsCount: data.reviewsCount,
    availability: data.availability || 'N/A',
    category: data.category,
    brand: data.brand,
    stock: data.stock,
    isFeatured: data.isFeatured || false,
    isWeeklyDeal: data.isWeeklyDeal || false,
  };
}


export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isFeatured', '==', true), limit(4));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => {
      const productData = mapDocToProduct(doc);
      // Map to ProductCardProps
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
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('isWeeklyDeal', '==', true), limit(6));
    const querySnapshot = await getDocs(q);

    const deals = querySnapshot.docs.map(doc => {
      const productData = mapDocToProduct(doc);
      // Map to DealProduct
      return {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        image: productData.image,
        dataAiHint: productData.dataAiHint,
        fixedOfferPrice: productData.offerPrice, // DealProduct requires this
        fixedOriginalPrice: productData.originalPrice || productData.offerPrice * 1.2, // DealProduct requires this
      };
    });
    return deals;
  } catch (error) {
    console.error("Error fetching weekly deals: ", error);
    return [];
  }
}

// Extended interface for Product Detail Page
export interface ProductDetailsPageData extends Product {
  // Inherits all from Product, can add more if needed for detail page specifically
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
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
    console.error("Error fetching product details: ", error);
    return null;
  }
}

export async function getAllProducts(categorySlug?: string, subCategorySlug?: string): Promise<ProductCardProps[]> {
  try {
    const productsRef = collection(db, 'products');
    let q;

    // This is a simplified category filtering.
    // In a real app, category/subcategory might be stored as references or more structured.
    if (subCategorySlug) {
      // Assuming subCategory is stored in a field like 'subCategorySlug' or needs more complex querying
      // For now, let's assume 'category' field stores the main category slug
       q = query(productsRef, where('categorySlug', '==', categorySlug), where('subCategorySlug', '==', subCategorySlug), limit(12));
    } else if (categorySlug) {
      q = query(productsRef, where('categorySlug', '==', categorySlug), limit(12));
    } else {
      q = query(productsRef, limit(12)); // Default limit for "All Products"
    }
    
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
    console.error("Error fetching all products: ", error);
    return [];
  }
}
    