
'use server';

import { db, isConfigured } from '@/lib/firebase';
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
  createdAt?: Timestamp | Date;
  sku?: string;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Modern Smartwatch Series X', description: 'Sleek smartwatch with advanced health tracking.',
        longDescription: 'Full-featured Modern Smartwatch Series X with a vibrant AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and up to 7 days battery life. Compatible with Android and iOS.',
        image: 'https://placehold.co/600x400.png', images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        dataAiHint: 'smartwatch technology', offerPrice: 12999, originalPrice: 15999, rating: '4.5', reviewsCount: 150,
        availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Wearable Technology', subCategorySlug: 'wearables',
        brand: 'TechNova', stock: 50, isFeatured: true, isWeeklyDeal: false, createdAt: new Date()
    },
    {
        id: '2', name: 'Classic Men\'s Polo Shirt', description: 'Comfortable and stylish polo shirt.',
        longDescription: 'Made from 100% premium cotton, this classic fit polo shirt offers both comfort and durability. Features a two-button placket and ribbed collar and cuffs. Available in various colors.',
        image: 'https://placehold.co/600x400.png', images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        dataAiHint: 'men shirt', offerPrice: 2499, originalPrice: 3200, rating: '4.7', reviewsCount: 85,
        availability: 'In Stock', category: 'Fashion', categorySlug: 'fashion', subCategory: 'Men\'s Clothing', subCategorySlug: 'men-clothing',
        brand: 'UrbanStyle', stock: 120, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '3', name: 'Stainless Steel Cookware Set', description: 'Durable 10-piece cookware set.',
        longDescription: 'This 10-piece stainless steel cookware set includes saucepans, frying pans, and stockpot, all with ergonomic handles and tempered glass lids. Suitable for all stovetops, including induction.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'cookware kitchen', offerPrice: 7999, originalPrice: 9500, rating: '4.8',
        reviewsCount: 210, availability: 'In Stock', category: 'Home & Living', categorySlug: 'home-living', subCategory: 'Kitchen & Dining', subCategorySlug: 'kitchen-dining',
        brand: 'KitchenMaster', stock: 30, isFeatured: true, isWeeklyDeal: false, createdAt: new Date()
    },
    {
        id: '4', name: 'Wireless Noise-Cancelling Headphones', description: 'Immersive audio experience, free from distractions.',
        longDescription: 'Experience industry-leading noise cancellation with these wireless headphones. Enjoy up to 30 hours of battery life, crystal-clear call quality, and high-resolution audio support.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'audio headphones', offerPrice: 19999, originalPrice: 24000, rating: '4.9',
        reviewsCount: 350, availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Audio & Headphones', subCategorySlug: 'audio-headphones',
        brand: 'AudioPhile', stock: 40, isFeatured: true, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '5', name: 'Organic Green Tea', description: '25 bags of premium organic green tea.',
        longDescription: 'Sourced from the finest tea gardens, our organic green tea offers a smooth and refreshing taste. Rich in antioxidants, it\'s the perfect healthy beverage to start your day or unwind in the evening.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'tea beverage', offerPrice: 599, originalPrice: 750, rating: '4.6',
        reviewsCount: 120, availability: 'In Stock', category: 'Groceries', categorySlug: 'groceries', subCategory: 'Beverages', subCategorySlug: 'beverages',
        brand: 'PureLeaf', stock: 200, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    }
];

export interface ProductDetailsPageData extends Product {}

const fromFirestore = (doc: any): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    } as Product;
};

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  if (!isConfigured || !db) {
    const products = MOCK_PRODUCTS.filter(p => p.isFeatured);
    return products.map(p => ({
        id: p.id, name: p.name, description: p.description, image: p.image,
        dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
        rating: p.rating, reviewsCount: p.reviewsCount,
    }));
  }

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
  if (!isConfigured || !db) {
    const products = MOCK_PRODUCTS.filter(p => p.isWeeklyDeal);
    return products.map(p => ({
        id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
        fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
        rating: p.rating, reviewsCount: p.reviewsCount,
    }));
  }

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
  if (!isConfigured || !db) {
    return MOCK_PRODUCTS.find(p => p.id === productId) || null;
  }
  
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
    if (!isConfigured || !db) {
        let products = MOCK_PRODUCTS;
        if (categorySlugParam) {
            products = products.filter(p => p.categorySlug === categorySlugParam);
        }
        if (subCategorySlugParam) {
            products = products.filter(p => p.subCategorySlug === subCategorySlugParam);
        }
        return products;
    }

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
    return [];
  }
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
  if (!isConfigured || !db) {
      // In demo mode, return static data with new types
      return [
          { type: 'firstOrder', title: 'Ksh 500 Off!', subtitle: 'Your First Creme Collections Order', code: 'KARIBU500', terms: '*Min. spend Ksh 2,500. T&Cs apply.', href: '/register', dataAiHint: 'first order discount', backgroundColor: 'bg-gradient-to-br from-primary to-accent', foregroundColor: 'text-primary-foreground', accentColor: 'text-white', displayOrder: 1, isActive: true },
          { type: 'tieredDiscount', title: 'Buy More, Save More!', tiers: [{ amount: 400, spend: 5000 }, { amount: 700, spend: 8000 }, { amount: 1000, spend: 10000 }], code: 'SAVEMORE', terms: '*Limited Time Offer. T&Cs Apply.', href: '/products', dataAiHint: 'tiered discount offer', backgroundColor: 'bg-gradient-to-tr from-slate-900 to-slate-700', foregroundColor: 'text-white', accentColor: 'text-primary', displayOrder: 2, isActive: true },
          { type: 'revealCode', title: 'Fashion Finds', subtitle: 'Up to 20% Off Select Apparel', actionText: 'TAP TO REVEAL', codePlaceholder: 'CODE', productImage: '/images/banners/fashion.png', href: '/products/category/fashion', dataAiHint: 'fashion apparel sale', backgroundColor: 'bg-secondary', foregroundColor: 'text-secondary-foreground', accentColor: 'text-primary border-primary', displayOrder: 3, isActive: true },
          { type: 'revealCode', title: 'Home Essentials', subtitle: 'Save Big on Decor & More', actionText: 'TAP TO REVEAL', codePlaceholder: 'CODE', productImage: '/images/banners/home.png', href: '/products/category/home-living', dataAiHint: 'home decor sale', backgroundColor: 'bg-card', foregroundColor: 'text-card-foreground', accentColor: 'text-primary border-primary', displayOrder: 4, isActive: true },
      ];
  }
  const q = query(collection(db, "promotions"), where("isActive", "==", true), limit(10));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as PromoSlideProps);
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string | null> {
    if (!isConfigured || !db) {
        console.warn("[Demo Mode] addProduct called. No data will be saved.");
        return `mock_product_${Date.now()}`;
    }
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
    if (!isConfigured || !db) {
        console.warn(`[Demo Mode] updateProduct called for ${productId}. No data will be saved.`);
        return true;
    }
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
