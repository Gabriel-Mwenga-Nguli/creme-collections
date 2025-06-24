
'use server';

import type { ProductCardProps } from '@/components/features/home/product-card';
import type { DealProduct } from '@/components/features/home/weekly-deals-slider';
import type { PromoSlideProps } from '@/lib/types';

// Mock data to replace Firestore
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Modern Smartwatch Series X', description: 'Sleek smartwatch with advanced health tracking.',
        longDescription: 'Full-featured Modern Smartwatch Series X with a vibrant AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and up to 7 days battery life. Compatible with Android and iOS.',
        image: 'https://placehold.co/600x400.png', 
        images: [
            'https://placehold.co/600x400.png', 
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png'
        ],
        dataAiHint: 'smartwatch technology', offerPrice: 12999, originalPrice: 15999, rating: '4.5', reviewsCount: 150,
        availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Wearable Technology', subCategorySlug: 'wearables',
        brand: 'TechNova', stock: 50, isFeatured: true, isWeeklyDeal: false, createdAt: new Date()
    },
    {
        id: '2', name: 'Classic Men\'s Polo Shirt', description: 'Comfortable and stylish polo shirt.',
        longDescription: 'Made from 100% premium cotton, this classic fit polo shirt offers both comfort and durability. Features a two-button placket and ribbed collar and cuffs. Available in various colors.',
        image: 'https://placehold.co/600x400.png', 
        images: [
            'https://placehold.co/600x400.png', 
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png'
        ],
        dataAiHint: 'men shirt', offerPrice: 2499, originalPrice: 3200, rating: '4.7', reviewsCount: 85,
        availability: 'In Stock', category: 'Fashion', categorySlug: 'fashion', subCategory: 'Men\'s Clothing', subCategorySlug: 'men-clothing',
        brand: 'UrbanStyle', stock: 120, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '3', name: 'Stainless Steel Cookware Set', description: 'Durable 10-piece cookware set.',
        longDescription: 'This 10-piece stainless steel cookware set includes saucepans, frying pans, and stockpot, all with ergonomic handles and tempered glass lids. Suitable for all stovetops, including induction.',
        image: 'https://placehold.co/600x400.png', 
        images: [
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png'
        ],
        dataAiHint: 'cookware kitchen', offerPrice: 7999, originalPrice: 9500, rating: '4.8',
        reviewsCount: 210, availability: 'In Stock', category: 'Home & Living', categorySlug: 'home-living', subCategory: 'Kitchen & Dining', subCategorySlug: 'kitchen-dining',
        brand: 'KitchenMaster', stock: 30, isFeatured: true, isWeeklyDeal: false, createdAt: new Date()
    },
    {
        id: '4', name: 'Wireless Noise-Cancelling Headphones', description: 'Immersive audio experience, free from distractions.',
        longDescription: 'Experience industry-leading noise cancellation with these wireless headphones. Enjoy up to 30 hours of battery life, crystal-clear call quality, and high-resolution audio support.',
        image: 'https://placehold.co/600x400.png', 
        images: [
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png'
        ],
        dataAiHint: 'audio headphones', offerPrice: 19999, originalPrice: 24000, rating: '4.9',
        reviewsCount: 350, availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Audio & Headphones', subCategorySlug: 'audio-headphones',
        brand: 'AudioPhile', stock: 40, isFeatured: true, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '5', name: 'Organic Green Tea', description: '25 bags of premium organic green tea.',
        longDescription: 'Sourced from the finest tea gardens, our organic green tea offers a smooth and refreshing taste. Rich in antioxidants, it\'s the perfect healthy beverage to start your day or unwind in the evening.',
        image: 'https://placehold.co/600x400.png', 
        images: [
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png',
            'https://placehold.co/600x400.png'
        ],
        dataAiHint: 'tea beverage', offerPrice: 599, originalPrice: 750, rating: '4.6',
        reviewsCount: 120, availability: 'In Stock', category: 'Groceries', categorySlug: 'groceries', subCategory: 'Beverages', subCategorySlug: 'beverages',
        brand: 'PureLeaf', stock: 200, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '6', name: 'Pro Gaming Laptop', description: 'High-performance gaming laptop.',
        longDescription: 'Dominate the competition with this Pro Gaming Laptop, featuring the latest gen processor, a high-refresh-rate display, and advanced cooling system.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'gaming laptop', offerPrice: 149999, originalPrice: 165000, rating: '4.8',
        reviewsCount: 75, availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Laptops & Computers', subCategorySlug: 'laptops-computers',
        brand: 'GameRig', stock: 15, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '7', name: 'Elegant Evening Gown', description: 'A stunning dress for special occasions.',
        longDescription: 'Turn heads in this elegant evening gown, crafted from luxurious satin with intricate beadwork. Perfect for galas, weddings, and formal events.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'woman dress', offerPrice: 8999, originalPrice: 11000, rating: '4.9',
        reviewsCount: 45, availability: 'In Stock', category: 'Fashion', categorySlug: 'fashion', subCategory: 'Women\'s Clothing', subCategorySlug: 'women-clothing',
        brand: 'Elegance', stock: 25, isFeatured: true, isWeeklyDeal: true, createdAt: new Date()
    },
    {
        id: '8', name: 'Espresso Coffee Maker', description: 'Barista-quality coffee at home.',
        longDescription: 'Brew delicious espresso, cappuccinos, and lattes with this semi-automatic espresso machine. Features a 15-bar pump and a built-in milk frother.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'coffee machine', offerPrice: 15999, originalPrice: 18000, rating: '4.7',
        reviewsCount: 92, availability: 'In Stock', category: 'Home & Living', categorySlug: 'home-living', subCategory: 'Kitchen & Dining', subCategorySlug: 'kitchen-dining',
        brand: 'BrewMaster', stock: 35, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    },
     {
        id: '9', name: 'Ergonomic Gaming Mouse', description: 'Precision and comfort for gamers.',
        longDescription: 'Gain a competitive edge with this ergonomic gaming mouse, featuring an ultra-precise optical sensor, customizable buttons, and RGB lighting.',
        image: 'https://placehold.co/600x400.png', dataAiHint: 'gaming mouse', offerPrice: 4500, originalPrice: 5500, rating: '4.8',
        reviewsCount: 180, availability: 'In Stock', category: 'Electronics', categorySlug: 'electronics', subCategory: 'Gaming', subCategorySlug: 'gaming',
        brand: 'GameRig', stock: 80, isFeatured: false, isWeeklyDeal: true, createdAt: new Date()
    }
];

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
}

export interface ProductDetailsPageData extends Product {}

export async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  const products = MOCK_PRODUCTS.filter(p => p.isFeatured);
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image,
    dataAiHint: p.dataAiHint, fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getWeeklyDeals(): Promise<DealProduct[]> {
  const products = MOCK_PRODUCTS.filter(p => p.isWeeklyDeal);
  return products.map(p => ({
    id: p.id, name: p.name, description: p.description, image: p.image, dataAiHint: p.dataAiHint,
    fixedOfferPrice: p.offerPrice, fixedOriginalPrice: p.originalPrice || p.offerPrice * 1.2,
    rating: p.rating, reviewsCount: p.reviewsCount,
  }));
}

export async function getProductDetailsById(productId: string): Promise<ProductDetailsPageData | null> {
  const product = MOCK_PRODUCTS.find(p => p.id === productId);
  return product || null;
}

export async function getAllProducts(categorySlugParam?: string, subCategorySlugParam?: string): Promise<Product[]> {
  let products = MOCK_PRODUCTS;
  if (categorySlugParam) {
    products = products.filter(p => p.categorySlug === categorySlugParam);
  }
  if (subCategorySlugParam) {
    products = products.filter(p => p.subCategorySlug === subCategorySlugParam);
  }
  return products;
}

export async function getPromotions(): Promise<PromoSlideProps[]> {
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
