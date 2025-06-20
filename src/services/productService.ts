
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import { db } from '@/lib/firebase';
import { getProductsFromLoyverse, getProductByIdFromLoyverse } from './loyverseService'; // Import Loyverse functions
import { collection, query, where, getDocs, limit, doc, getDoc, addDoc, updateDoc, serverTimestamp, Timestamp, type DocumentSnapshot, type QueryDocumentSnapshot, orderBy } from 'firebase/firestore';

// Initial check for db initialization
if (!db) {
  const errorMessage = "[ProductService Critical Error] Firestore 'db' object is NULL or undefined at module load. This means Firebase did not initialize correctly in 'firebase.ts' or the import failed. Product service cannot function.";
  console.error(errorMessage);
  throw new Error(errorMessage);
}

console.log('[ProductService Module Load] Value of db imported from firebase.ts:', db === null ? 'null (ERROR - Should have been caught by check above)' : 'VALID INSTANCE (Firebase should be working)');


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
  loyverseId?: string; // To store Loyverse item ID
  sku?: string;
}


function mapDocToProduct(document: DocumentSnapshot | QueryDocumentSnapshot): Product {
  const data = document.data();
  if (!data) {
    console.error(`[mapDocToProduct] Document data is undefined for document ID: ${document.id}`);
    throw new Error(`Document data is undefined for document ID: ${document.id}`);
  }
  return {
    id: document.id,
    name: data.name || 'Unnamed Product',
    description: data.description || '',
    longDescription: data.longDescription || data.description || 'No detailed description available for this product.',
    image: data.image || '/images/banners/electronics.png',
    images: data.images && Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : (data.image ? [data.image] : ['/images/banners/electronics.png']),
    dataAiHint: data.dataAiHint || 'product',
    offerPrice: typeof data.offerPrice === 'number' ? data.offerPrice : 0,
    originalPrice: typeof data.originalPrice === 'number' ? data.originalPrice : undefined,
    rating: data.rating !== undefined ? String(data.rating) : '0',
    reviewsCount: typeof data.reviewsCount === 'number' ? data.reviewsCount : 0,
    availability: data.availability || 'Availability Unknown',
    category: data.category || 'Uncategorized',
    categorySlug: data.categorySlug || (data.category ? data.category.toLowerCase().replace(/\s+/g, '-') : 'uncategorized'),
    subCategory: data.subCategory || undefined,
    subCategorySlug: data.subCategorySlug || (data.subCategory ? data.subCategory.toLowerCase().replace(/\s+/g, '-') : undefined),
    brand: data.brand || 'Unbranded',
    stock: typeof data.stock === 'number' ? data.stock : 0,
    isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : false,
    isWeeklyDeal: typeof data.isWeeklyDeal === 'boolean' ? data.isWeeklyDeal : false,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
    loyverseId: data.loyverseId || undefined,
    sku: data.sku || undefined,
  };
}

async function fetchProductsFromFirestore(
  categorySlugParam?: string,
  subCategorySlugParam?: string,
  customQueryConstraints: any[] = [], // For isFeatured, isWeeklyDeal
  limitParam?: number
): Promise<Product[]> {
  console.log('[fetchProductsFromFirestore Call] Value of db at function call:', db === null ? 'null (ERROR)' : 'VALID');
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch products from Firestore.");
    return [];
  }
  let queryDescription = "products from Firestore";
  try {
    const productsRef = collection(db, 'products');
    let qConstraints = [orderBy('createdAt', 'desc')]; // Default sort
    
    if (categorySlugParam) {
      qConstraints.push(where('categorySlug', '==', categorySlugParam));
      queryDescription += ` with categorySlug='${categorySlugParam}'`;
    }
    if (subCategorySlugParam) {
      qConstraints.push(where('subCategorySlug', '==', subCategorySlugParam));
      queryDescription += ` and subCategorySlug='${subCategorySlugParam}'`;
    }
    
    qConstraints.push(...customQueryConstraints); // Add constraints for featured/weekly deals
    
    if (limitParam) {
      qConstraints.push(limit(limitParam));
      queryDescription += ` limited to ${limitParam}`;
    }

    const q = query(productsRef, ...qConstraints);
    console.log(`[fetchProductsFromFirestore Call] Constructed query for: ${queryDescription}`);
    
    const querySnapshot = await getDocs(q);
    console.log(`[fetchProductsFromFirestore Call] Firestore query returned ${querySnapshot.docs.length} documents.`);
    
    const products = querySnapshot.docs.map(docSn => mapDocToProduct(docSn));
    if (products.length === 0) {
        console.warn(`[fetchProductsFromFirestore Call] No products found in Firestore for query: ${queryDescription}.`);
    }
    return products;
  } catch (error: any) {
    console.error(`[fetchProductsFromFirestore Call] Error fetching ${queryDescription}: `, error.message);
    // Handle specific Firestore errors if needed
    return [];
  }
}


export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  console.log('[getFeaturedProducts Call] Attempting to fetch from Loyverse first.');
  try {
    const loyverseProducts = await getProductsFromLoyverse({ featured: true, limit: 8 });
    if (loyverseProducts && loyverseProducts.length > 0) {
      console.log(`[getFeaturedProducts Call] Fetched ${loyverseProducts.length} featured products from Loyverse.`);
      return loyverseProducts.map(p => ({
        id: p.id, name: p.name, description: p.description, image: p.image,
        dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
        rating: p.rating, reviewsCount: p.reviewsCount,
      }));
    }
    console.log('[getFeaturedProducts Call] No featured products from Loyverse or service returned empty. Falling back to Firestore.');
  } catch (e) {
    console.error('[getFeaturedProducts Call] Error fetching from Loyverse, falling back to Firestore:', e);
  }

  // Fallback to Firestore
  const firestoreProducts = await fetchProductsFromFirestore(undefined, undefined, [where('isFeatured', '==', true)], 8);
  return firestoreProducts.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image,
    dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  console.log('[getWeeklyDeals Call] Attempting to fetch from Loyverse first.');
  try {
    const loyverseProducts = await getProductsFromLoyverse({ weeklyDeal: true, limit: 8 });
    if (loyverseProducts && loyverseProducts.length > 0) {
      console.log(`[getWeeklyDeals Call] Fetched ${loyverseProducts.length} weekly deals from Loyverse.`);
      return loyverseProducts.map(p => ({
        id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
        fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
        rating: p.rating, reviewsCount: p.reviewsCount,
      }));
    }
    console.log('[getWeeklyDeals Call] No weekly deals from Loyverse or service returned empty. Falling back to Firestore.');
  } catch (e) {
    console.error('[getWeeklyDeals Call] Error fetching from Loyverse, falling back to Firestore:', e);
  }

  // Fallback to Firestore
  const firestoreProducts = await fetchProductsFromFirestore(undefined, undefined, [where('isWeeklyDeal', '==', true)], 8);
  return firestoreProducts.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
    fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2, // Ensure original price for deals
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export interface ProductDetailsPageData extends Product {}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  console.log(`[getProductDetailsById Call - ID: ${productId}] Attempting to fetch from Loyverse first.`);
  if (!productId || typeof productId !== 'string') {
    console.error("Invalid productId provided to getProductDetailsById:", productId);
    return null;
  }
  try {
    const loyverseProduct = await getProductByIdFromLoyverse(productId);
    if (loyverseProduct) {
      console.log(`[getProductDetailsById Call - ID: ${productId}] Fetched product from Loyverse.`);
      return loyverseProduct as ProductDetailsPageData;
    }
    console.log(`[getProductDetailsById Call - ID: ${productId}] Product not found in Loyverse or service returned null. Falling back to Firestore.`);
  } catch (e) {
    console.error(`[getProductDetailsById Call - ID: ${productId}] Error fetching from Loyverse, falling back to Firestore:`, e);
  }

  // Fallback to Firestore
  console.log(`[getProductDetailsById Call - ID: ${productId}] Fetching from Firestore.`);
  if (!db) {
    console.error("Firestore 'db' object is not initialized. Cannot fetch product details for ID:", productId);
    return null;
  }
  try {
    const productDocRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productDocRef);

    if (productSnap.exists()) {
      return mapDocToProduct(productSnap) as ProductDetailsPageData;
    } else {
      console.warn(`[getProductDetailsById Call - ID: ${productId}] No such product document in Firestore.`);
      return null;
    }
  } catch (error) {
    console.error(`[getProductDetailsById Call - ID: ${productId}] Error fetching product details from Firestore: `, error);
    return null;
  }
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  console.log(`[getAllProducts Call] Params: category='${categorySlugParam}', subCategory='${subCategorySlugParam}'. Attempting Loyverse first.`);
  // Note: Loyverse filtering for category/subcategory might be complex (e.g., by category_id).
  // The conceptual getProductsFromLoyverse might not support this level of filtering yet.
  // For now, if categorySlugParam exists, we might primarily rely on Firestore,
  // or the Loyverse service would need to implement robust filtering.
  // For this example, we'll assume getProductsFromLoyverse does its best and we post-filter or it handles it.

  let loyverseProducts: Product[] = [];
  try {
    // A more advanced Loyverse service might take category/subcategory slugs as filters
    loyverseProducts = await getProductsFromLoyverse({ 
        // categoryId: categorySlugParam, // If Loyverse API supports filtering by slug or needs ID mapping
        // subCategoryId: subCategorySlugParam 
    });

    if (loyverseProducts && loyverseProducts.length > 0) {
      console.log(`[getAllProducts Call] Fetched ${loyverseProducts.length} products from Loyverse.`);
      // Apply filtering if not handled by the Loyverse service itself (conceptual)
      let filteredLoyverseProducts = loyverseProducts;
      if (categorySlugParam) {
        filteredLoyverseProducts = filteredLoyverseProducts.filter(p => p.categorySlug === categorySlugParam);
      }
      if (subCategorySlugParam) {
        filteredLoyverseProducts = filteredLoyverseProducts.filter(p => p.subCategorySlug === subCategorySlugParam);
      }
      if (filteredLoyverseProducts.length > 0) {
        return filteredLoyverseProducts;
      }
      console.log('[getAllProducts Call] Loyverse products fetched, but none matched filters. Falling back to Firestore for specific category.');
    } else {
      console.log('[getAllProducts Call] No products from Loyverse or service returned empty. Falling back to Firestore.');
    }
  } catch (e) {
    console.error('[getAllProducts Call] Error fetching from Loyverse, falling back to Firestore:', e);
  }

  // Fallback to Firestore
  return fetchProductsFromFirestore(categorySlugParam, subCategorySlugParam, [], undefined);
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
    // For now, product additions/updates will go to Firestore.
    // A full Loyverse integration would need to decide if products are also pushed to Loyverse.
    console.log('[addProduct Call] Adding product to Firestore. Loyverse sync not implemented for add.');
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
        console.error("Error adding product to Firestore:", error);
        return null;
    }
}

export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<boolean> {
    // Similar to addProduct, updates go to Firestore. Loyverse sync would be an additional step.
    console.log(`[updateProduct Call - ID: ${productId}] Updating product in Firestore. Loyverse sync not implemented for update.`);
    if (!db) {
        console.error("Firestore 'db' object is not initialized. Cannot update product.");
        return false;
    }
    try {
        const productRef = doc(db, 'products', productId);
        const updateData: { [key: string]: any } = { ...productData };

        if (productData.offerPrice !== undefined) updateData.offerPrice = Number(productData.offerPrice);
        if (productData.originalPrice !== undefined) {
          updateData.originalPrice = productData.originalPrice === null || productData.originalPrice === undefined ? null : Number(productData.originalPrice);
        }
        if (productData.stock !== undefined) updateData.stock = Number(productData.stock);
        if (productData.reviewsCount !== undefined) updateData.reviewsCount = Number(productData.reviewsCount);
        if (productData.rating !== undefined) updateData.rating = String(productData.rating);

        await updateDoc(productRef, updateData);
        return true;
    } catch (error) {
        console.error(`Error updating product ${productId} in Firestore:`, error);
        return false;
    }
}
