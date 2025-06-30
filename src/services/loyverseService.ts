
'use server';

import type { Product } from './productService';

// IMPORTANT: This is a conceptual service for Loyverse integration.
// You MUST implement the actual API calls based on Loyverse API documentation.

const LOYVERSE_API_BASE_URL = 'https://api.loyverse.com/v1.0'; // Replace with actual if different

/**
 * Conceptual interface for a raw product item from Loyverse API.
 * Adjust this based on the actual structure of Loyverse API responses.
 */
interface LoyverseRawProduct {
  id: string; // Loyverse item ID
  item_name: string;
  description?: string; // Loyverse might have a different field for long description
  category_name?: string;
  category_slug?: string;
  // Loyverse uses variants for different prices, stock levels per option
  variants: Array<{
    variant_id: string;
    sku?: string;
    price?: number; // Selling price
    cost?: number; // Purchase cost
    base_price?: number; // Original price before any discounts
    stock_level?: number;
    // option1_value, option2_value, option3_value for things like Size, Color
    option1_value?: string;
    option2_value?: string;
    option3_value?: string;
    // Potentially other fields like "in_stock", "track_stock"
  }>;
  image_url?: string; // Loyverse might provide a primary image URL
  image_urls?: string[]; // Or multiple
  // Fields to determine if featured or weekly deal would need to be custom fields in Loyverse
  // or managed separately if Loyverse doesn't directly support these flags.
  // For this example, we'll assume they aren't directly available from Loyverse for these flags.
  is_featured_custom_field?: boolean; // Example conceptual field
  is_weekly_deal_custom_field?: boolean; // Example conceptual field
  created_at?: string; // ISO date string
  brand?: string;
  // Add other relevant fields from Loyverse: barcode, tags, etc.
}

const MOCK_LOYVERSE_PRODUCTS: LoyverseRawProduct[] = [
    { 
        id: 'loy-1', item_name: 'Modern Smartwatch Series X', description: 'Sleek smartwatch with advanced health tracking and notifications.', 
        variants: [{variant_id: 'v1_1', sku: 'LV-SWX-01', price: 12999, stock_level: 50, base_price: 15999 }], 
        category_name: 'Electronics', category_slug: 'electronics', brand: 'TechNova',
        image_url: '/images/products/smartwatch_main.png', image_urls: ['/images/products/smartwatch_main.png', '/images/products/smartwatch_side.png'],
        is_featured_custom_field: true, is_weekly_deal_custom_field: false
    },
    { 
        id: 'loy-2', item_name: 'Classic Men\'s Polo Shirt', description: 'Comfortable and stylish polo shirt for everyday wear.', 
        variants: [{variant_id: 'v2_1', sku: 'LV-POLO-01', price: 2499, stock_level: 120, base_price: 3200 }], 
        category_name: 'Fashion', category_slug: 'fashion', brand: 'UrbanStyle',
        image_url: '/images/products/polo_shirt_blue.png', image_urls: ['/images/products/polo_shirt_blue.png', '/images/products/polo_shirt_green.png'],
        is_featured_custom_field: false, is_weekly_deal_custom_field: true
    },
    { 
        id: 'loy-3', item_name: 'Stainless Steel Cookware Set', description: 'Durable 10-piece cookware set for the modern kitchen.', 
        variants: [{variant_id: 'v3_1', sku: 'LV-COOK-01', price: 7999, stock_level: 30, base_price: 9500 }], 
        category_name: 'Home & Living', category_slug: 'home-living', brand: 'KitchenMaster',
        image_url: '/images/products/cookware_set.png',
        is_featured_custom_field: true, is_weekly_deal_custom_field: false
    },
    { 
        id: 'loy-4', item_name: 'Wireless Noise-Cancelling Headphones', description: 'Immersive audio experience, free from distractions.', 
        variants: [{variant_id: 'v4_1', sku: 'LV-HP-01', price: 19999, stock_level: 40, base_price: 24000 }], 
        category_name: 'Electronics', category_slug: 'electronics', brand: 'AudioPhile',
        image_url: '/images/products/headphones.png',
        is_featured_custom_field: true, is_weekly_deal_custom_field: true
    },
    { 
        id: 'loy-5', item_name: 'Organic Green Tea', description: '25 bags of premium organic green tea, rich in antioxidants.', 
        variants: [{variant_id: 'v5_1', sku: 'LV-TEA-01', price: 599, stock_level: 200, base_price: 750 }], 
        category_name: 'Groceries', category_slug: 'groceries', brand: 'PureLeaf',
        image_url: '/images/products/green_tea.png',
        is_featured_custom_field: false, is_weekly_deal_custom_field: true
    },
    {
        id: 'loy-6', item_name: 'Leather Messenger Bag', description: 'Stylish and durable bag for work or travel.',
        variants: [{ variant_id: 'v6_1', sku: 'LV-BAG-01', price: 6500, stock_level: 25, base_price: 8000 }],
        category_name: 'Fashion', category_slug: 'fashion', brand: 'UrbanStyle',
        image_url: 'https://placehold.co/600x400.png',
        is_featured_custom_field: true,
    },
    {
        id: 'loy-7', item_name: '4K Ultra HD Action Camera', description: 'Capture your adventures in stunning detail.',
        variants: [{ variant_id: 'v7_1', sku: 'LV-CAM-01', price: 14500, stock_level: 35, base_price: 17000 }],
        category_name: 'Electronics', category_slug: 'electronics', brand: 'TechNova',
        image_url: 'https://placehold.co/600x400.png',
        is_weekly_deal_custom_field: true,
    }
];

/**
 * Placeholder function to simulate fetching products from Loyverse API.
 * YOU NEED TO IMPLEMENT THIS with actual `fetch` calls to Loyverse endpoints,
 * including authentication (API key in headers).
 */
async function fetchProductsFromLoyverseAPI(
  apiKey: string,
  filters?: { categoryId?: string; featured?: boolean; weeklyDeal?: boolean, limit?: number, ids?: string[] }
): Promise<LoyverseRawProduct[]> {
  if (!apiKey || apiKey === "YOUR_LOYVERSE_API_KEY_PLEASE_REPLACE_IN_DOT_ENV_LOCAL") {
    console.warn("Loyverse API key is not set. Returning empty array.");
    return [];
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50)); 

  let results = MOCK_LOYVERSE_PRODUCTS;
  
  if (filters?.ids?.length) {
    results = results.filter(p => filters.ids!.includes(p.id));
  }
  
  if (filters?.featured) {
    results = results.filter(p => p.is_featured_custom_field);
  }

  if (filters?.weeklyDeal) {
    results = results.filter(p => p.is_weekly_deal_custom_field);
  }

  if (filters?.limit) {
    results = results.slice(0, filters.limit);
  }
  
  return results;
}

/**
 * Transforms a raw Loyverse product object into the application's Product interface.
 * YOU WILL NEED TO ADJUST THIS MAPPING based on your Loyverse setup and desired data.
 */
function transformLoyverseProduct(rawProduct: LoyverseRawProduct): Product {
  const primaryVariant = rawProduct.variants?.[0]; // Assuming first variant is primary or simplify for now

  return {
    id: rawProduct.id, // Using Loyverse ID as the primary ID
    loyverseId: rawProduct.id, // Explicitly store Loyverse ID
    name: rawProduct.item_name,
    description: rawProduct.description || `Description for ${rawProduct.item_name}`,
    longDescription: rawProduct.description || `Detailed description for ${rawProduct.item_name}.`,
    image: rawProduct.image_url || 'https://placehold.co/600x400.png',
    images: rawProduct.image_urls || (rawProduct.image_url ? [rawProduct.image_url] : ['https://placehold.co/600x400.png']),
    dataAiHint: rawProduct.item_name.split(' ').slice(0, 2).join(' ').toLowerCase(), // Simple hint
    offerPrice: primaryVariant?.price || 0,
    originalPrice: primaryVariant?.base_price || primaryVariant?.price || undefined,
    // Rating, reviewsCount, availability might not come directly from Loyverse basic item data
    // These might need to be managed in Firestore or a different system if Loyverse doesn't support them.
    rating: '0', 
    reviewsCount: 0,
    availability: (primaryVariant?.stock_level ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
    category: rawProduct.category_name || 'Uncategorized',
    categorySlug: rawProduct.category_slug,
    // SubCategory and Brand might also be custom fields or derived
    subCategory: undefined, 
    subCategorySlug: undefined,
    brand: rawProduct.brand,
    stock: primaryVariant?.stock_level,
    sku: primaryVariant?.sku,
    // isFeatured and isWeeklyDeal depend on how you manage this in Loyverse (e.g., tags, custom fields)
    isFeatured: rawProduct.is_featured_custom_field || false,
    isWeeklyDeal: rawProduct.is_weekly_deal_custom_field || false,
    createdAt: rawProduct.created_at ? new Date(rawProduct.created_at) : undefined,
  };
}

/**
 * Fetches products from Loyverse and transforms them.
 */
export async function getProductsFromLoyverse(
  filters?: { categoryId?: string; featured?: boolean; weeklyDeal?: boolean, limit?: number, ids?: string[] }
): Promise<Product[]> {
  const apiKey = process.env.LOYVERSE_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const rawProducts = await fetchProductsFromLoyverseAPI(apiKey, filters);
    if (!rawProducts || rawProducts.length === 0) {
        return [];
    }
    return rawProducts.map(transformLoyverseProduct);
  } catch (error) {
    return [];
  }
}

/**
 * Fetches a single product by its ID from Loyverse.
 */
export async function getProductByIdFromLoyverse(id: string): Promise<Product | null> {
  const apiKey = process.env.LOYVERSE_API_KEY;
  if (!apiKey) {
    return null;
  }
   if (!id) {
    return null;
  }
  
  try {
    const rawProducts = await fetchProductsFromLoyverseAPI(apiKey, { ids: [id] });
    if (rawProducts && rawProducts.length > 0) {
      const product = rawProducts.find(p => p.id === id);
      return product ? transformLoyverseProduct(product) : null;
    }
    return null;
  } catch (error) {
    return null;
  }
}
