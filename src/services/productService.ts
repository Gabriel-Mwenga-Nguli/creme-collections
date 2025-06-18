
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc, addDoc, updateDoc, serverTimestamp, Timestamp, type DocumentSnapshot, type QueryDocumentSnapshot, orderBy } from 'firebase/firestore';

// Log the state of 'db' immediately after import at the module level
console.log('[ProductService Module Load] Value of db imported from firebase.ts:', db === null ? 'null' : 'VALID INSTANCE');


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
  createdAt?: Timestamp; // Added for sorting recent products
}


function mapDocToProduct(document: DocumentSnapshot | QueryDocumentSnapshot): Product {
  const data = document.data();
  if (!data) {
    throw new Error(`Document data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id, 
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '', 
    image: data.image || 'https://placehold.co/400x400.png',
    images: data.images && Array.isArray(data.images) && data.images.length > 0 
            ? data.images 
            : (data.image ? [data.image] : ['https://placehold.co/100x100.png']),
    dataAiHint: data.dataAiHint || 'product',
    offerPrice: typeof data.offerPrice === 'number' ? data.offerPrice : 0,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    rating: data.rating !== undefined ? String(data.rating) : '0', 
    reviewsCount: typeof data.reviewsCount === 'number' ? data.reviewsCount : 0,
    availability: data.availability || 'N/A',
    category: data.category || 'Uncategorized',
    categorySlug: data.categorySlug || (data.category ? data.category.toLowerCase().replace(/\s+/g, '-') : 'uncategorized'),
    subCategory: data.subCategory,
    subCategorySlug: data.subCategorySlug || (data.subCategory ? data.subCategory.toLowerCase().replace(/\s+/g, '-') : undefined),
    brand: data.brand || 'Unbranded',
    stock: typeof data.stock === 'number' ? data.stock : 0,
    isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : false,
    isWeeklyDeal: typeof data.isWeeklyDeal === 'boolean' ? data.isWeeklyDeal : false,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
  };
}


export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  console.log('[getFeaturedProducts Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
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
  console.log('[getWeeklyDeals Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
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
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  console.log('[getProductDetailsById Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch product details for ID:", productId);
    return null;
  }
  if (!productId || typeof productId !== 'string') {
    console.error("Invalid productId provided to getProductDetailsById:", productId);
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

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  console.log('[getAllProducts Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch products.");
    return [];
  }
  try {
    const productsRef = collection(db, 'products');
    let q;

    if (categorySlugParam && subCategorySlugParam) {
       q = query(productsRef, where('categorySlug', '==', categorySlugParam), where('subCategorySlug', '==', subCategorySlugParam), orderBy('name', 'asc'));
    } else if (categorySlugParam) {
      q = query(productsRef, where('categorySlug', '==', categorySlugParam), orderBy('name', 'asc'));
    } else {
      q = query(productsRef, orderBy('name', 'asc')); 
    }
    
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(docSn => mapDocToProduct(docSn));
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    if (categorySlugParam) console.error("Category slug for error:", categorySlugParam);
    if (subCategorySlugParam) console.error("Sub-category slug for error:", subCategorySlugParam);
    return [];
  }
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
    console.log('[addProduct Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot add product.");
        return null;
    }
    try {
        const productsRef = collection(db, 'products');
        const newProductData = {
            ...productData,
            offerPrice: Number(productData.offerPrice) || 0,
            originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
            stock: Number(productData.stock) || 0,
            reviewsCount: Number(productData.reviewsCount) || 0,
            rating: productData.rating ? String(productData.rating) : '0',
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(productsRef, newProductData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding product:", error);
        return null;
    }
}

export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<boolean> {
    console.log('[updateProduct Call] Value of db at function call:', db === null ? 'null' : 'VALID INSTANCE');
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot update product.");
        return false;
    }
    try {
        const productRef = doc(db, 'products', productId);
        const updateData: { [key: string]: any } = { ...productData };
        
        if (productData.offerPrice !== undefined) updateData.offerPrice = Number(productData.offerPrice);
        if (productData.originalPrice !== undefined) updateData.originalPrice = productData.originalPrice ? Number(productData.originalPrice) : null; // Allow unsetting
        if (productData.stock !== undefined) updateData.stock = Number(productData.stock);
        if (productData.reviewsCount !== undefined) updateData.reviewsCount = Number(productData.reviewsCount);
        if (productData.rating !== undefined) updateData.rating = String(productData.rating);
        
        await updateDoc(productRef, updateData);
        return true;
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        return false;
    }
}

