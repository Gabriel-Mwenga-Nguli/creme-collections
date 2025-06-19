
# Firestore Data Setup for Creme Collections

For your Creme Collections application to display products correctly, especially on category and subcategory pages, you need to have well-structured data in your Firestore database, specifically in a collection named `products`.
all the reason to take th
Your project now uses local images from the `/public/images/` directory. When adding products, ensure your image paths reflect this structure (e.g., `/images/products/my-product-image.png`). For the sample data below, we'll use some generic images from `/public/images/banners/` to get you started.

Follow these steps to add sample product data through the Firebase Console:

## 1. Access Firestore Database

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your Firebase project (e.g., "cremecollections").
3.  In the left-hand navigation pane, click on **Build > Firestore Database**.
4.  If you haven't used Firestore before in this project, you might be prompted to create a database. Choose "Start in test mode" for now if you're just developing (you can secure it later with security rules). Select a Cloud Firestore location.

## 2. Create the `products` Collection (if it doesn't exist)

1.  Once in the Firestore Data viewer, click on **+ Start collection**.
2.  For "Collection ID", enter `products`. **This must be exactly `products` (lowercase).**
3.  Click "Next".

## 3. Add Product Documents

You'll now add individual product documents to this `products` collection. For each product:

1.  Click **+ Add document**.
2.  Firestore can auto-generate a Document ID, or you can specify your own (e.g., `SKU001`, `stylish-watch-123`). For simplicity, you can let it auto-generate.
3.  Add fields to the document. The field names should match the `Product` interface used in your application (`src/services/productService.ts`). **Field names are case-sensitive.**

### Example Product 1: Main Category (Electronics)

*   `name` (Type: `string`) - Example: `Modern Smartwatch Series X`
*   `description` (Type: `string`) - Example: `Sleek smartwatch with advanced health tracking and notifications.`
*   `longDescription` (Type: `string`) - Example: `Full-featured Modern Smartwatch Series X with a vibrant AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and up to 7 days battery life. Compatible with Android and iOS.`
*   `image` (Type: `string`) - Example: `/images/banners/electronics.png`
*   `images` (Type: `array`)
    *   `0` (Type: `string`) - `/images/banners/electronics.png`
    *   `1` (Type: `string`) - `/images/banners/promo1.png`
*   `dataAiHint` (Type: `string`) - Example: `smartwatch technology`
*   `offerPrice` (Type: `number`) - Example: `12999`
*   `originalPrice` (Type: `number`) - Example: `15999`
*   `rating` (Type: `string` or `number`) - Example: `4.5`
*   `reviewsCount` (Type: `number`) - Example: `150`
*   `availability` (Type: `string`) - Example: `In Stock` (Options: `In Stock`, `Out of Stock`, `Pre-order`)
*   `category` (Type: `string`) - Example: `Electronics`
*   `categorySlug` (Type: `string`) - Example: `electronics` **(Crucial: must match `CATEGORY_NAV_LINKS` in `src/lib/constants.ts` after `/products/category/`)**
*   `subCategory` (Type: `string`) - Example: `Wearable Technology`
*   `subCategorySlug` (Type: `string`) - Example: `wearables` **(Crucial: must match relevant sub-link slug from `CATEGORY_NAV_LINKS`)**
*   `brand` (Type: `string`) - Example: `TechNova`
*   `stock` (Type: `number`) - Example: `50`
*   `isFeatured` (Type: `boolean`) - Example: `true`
*   `isWeeklyDeal` (Type: `boolean`) - Example: `false`
*   `createdAt` (Type: `timestamp`) - Example: (Set current date and time, Firestore will handle this)

### Example Product 2: SubCategory (Fashion -> Men's Clothing)

*   `name` (Type: `string`) - Example: `Classic Men's Polo Shirt`
*   `description` (Type: `string`) - Example: `Comfortable and stylish polo shirt for everyday wear.`
*   `longDescription` (Type: `string`) - Example: `Made from 100% premium cotton, this classic fit polo shirt offers both comfort and durability. Features a two-button placket and ribbed collar and cuffs. Available in various colors.`
*   `image` (Type: `string`) - Example: `/images/banners/fashion.png`
*   `images` (Type: `array`)
    *   `0` (Type: `string`) - `/images/banners/fashion.png`
    *   `1` (Type: `string`) - `/images/promos/flash-sale.png`
*   `dataAiHint` (Type: `string`) - Example: `men shirt`
*   `offerPrice` (Type: `number`) - Example: `2499`
*   `originalPrice` (Type: `number`) - Example: `3200`
*   `rating` (Type: `string` or `number`) - Example: `4.7`
*   `reviewsCount` (Type: `number`) - Example: `85`
*   `availability` (Type: `string`) - Example: `In Stock`
*   `category` (Type: `string`) - Example: `Fashion`
*   `categorySlug` (Type: `string`) - Example: `fashion` **(Must be `fashion`)**
*   `subCategory` (Type: `string`) - Example: `Men's Clothing`
*   `subCategorySlug` (Type: `string`) - Example: `men-clothing` **(Must be `men-clothing`)**
*   `brand` (Type: `string`) - Example: `UrbanStyle`
*   `stock` (Type: `number`) - Example: `120`
*   `isFeatured` (Type: `boolean`) - Example: `false`
*   `isWeeklyDeal` (Type: `boolean`) - Example: `true`
*   `createdAt` (Type: `timestamp`) - Example: (Set current date and time)

### Example Product 3: Different SubCategory (Home & Living -> Kitchen & Dining)

*   `name` (Type: `string`) - Example: `Stainless Steel Cookware Set`
*   `description` (Type: `string`) - Example: `Durable 10-piece cookware set for all your culinary needs.`
*   `longDescription` (Type: `string`) - Example: `This 10-piece stainless steel cookware set includes saucepans, frying pans, and stockpot, all with ergonomic handles and tempered glass lids. Suitable for all stovetops, including induction.`
*   `image` (Type: `string`) - Example: `/images/banners/home.png`
*   `dataAiHint` (Type: `string`) - Example: `cookware kitchen`
*   `offerPrice` (Type: `number`) - Example: `7999`
*   `originalPrice` (Type: `number`) - Example: `9500`
*   `rating` (Type: `string` or `number`) - Example: `4.8`
*   `reviewsCount` (Type: `number`) - Example: `210`
*   `availability` (Type: `string`) - Example: `In Stock`
*   `category` (Type: `string`) - Example: `Home & Living`
*   `categorySlug` (Type: `string`) - Example: `home-living` **(Must be `home-living`)**
*   `subCategory` (Type: `string`) - Example: `Kitchen & Dining`
*   `subCategorySlug` (Type: `string`) - Example: `kitchen-dining` **(Must be `kitchen-dining`)**
*   `brand` (Type: `string`) - Example: `KitchenMaster`
*   `stock` (Type: `number`) - Example: `30`
*   `isFeatured` (Type: `boolean`) - Example: `true`
*   `isWeeklyDeal` (Type: `boolean`) - Example: `false`
*   `createdAt` (Type: `timestamp`) - Example: (Set current date and time)

4.  Click "Save" to add the document.

**Repeat this process to add a few more sample products.** Try to create products in different categories and subcategories as defined in `src/lib/constants.ts` (`CATEGORY_NAV_LINKS`). Vary `isFeatured` and `isWeeklyDeal` to see them populate different sections of your homepage.

### Important Field Notes:

*   **`categorySlug` and `subCategorySlug`**:
    *   These are **CRITICAL** for filtering products on category and subcategory pages.
    *   They **must** be lowercase.
    *   They **must** use hyphens for spaces (e.g., `home-living`, `mobiles-accessories`).
    *   The values you use in Firestore **must exactly match** the slugs derived from the `href` values in your `src/lib/constants.ts` file for `CATEGORY_NAV_LINKS`.
    *   Example: If a category link is `/products/category/electronics`, the `categorySlug` in Firestore for products in this category must be `electronics`.
    *   Example: If a subcategory link is `/products/category/fashion/men-clothing`, the `categorySlug` must be `fashion` and `subCategorySlug` must be `men-clothing`.
*   **`isFeatured`**: Set to `true` for products you want in the "Featured Products" section on the homepage.
*   **`isWeeklyDeal`**: Set to `true` for products you want in the "Flash Deals of the Week!" slider.
*   **Images**: Use local paths like `/images/products/your-image-name.png`. Ensure these images exist in your `/public/images/products/` directory. For the sample data, we've used generic banner images.
*   **`createdAt`**: This field (type `timestamp`) is useful for sorting new arrivals. You can set it to the current server timestamp when adding documents.

## 4. Verify in Your App

Once you've added some data:

1.  **Ensure your Firebase configuration in `.env.local` is correct and your Next.js app is running.**
2.  Navigate to your application in the browser (e.g., `http://localhost:9002`).
3.  Visit various category and subcategory pages (e.g., `/products/category/electronics`, `/products/category/fashion/men-clothing`).
4.  You should see products appearing if they have matching `categorySlug` (and `subCategorySlug` where applicable) in Firestore.

## 5. Troubleshooting Data Fetching

If products are not showing up on category/subcategory pages:

*   **Check Firestore Data**: Double-check the `categorySlug` and `subCategorySlug` values in your Firestore documents. Are they exactly matching what you expect from the URL and `constants.ts` (lowercase, hyphens)?
*   **Server/Console Logs**:
    *   Look at your Next.js server terminal logs. The `productService.ts` now logs the slugs it's using to query.
    *   Open your browser's developer console (usually F12).
    *   **Firestore Index Errors**: If Firestore requires a composite index for your query (e.g., querying on `categorySlug` and `subCategorySlug` together, or ordering by `name` while filtering on slugs), an error message will usually appear in the browser console. This error message typically includes a direct link to the Firebase Console where you can create the missing index with a single click. **If you see such a link, click it and create the index.** It might take a few minutes for the index to build.
*   **Firebase Configuration**: Ensure `.env.local` is correct and the server was restarted after any changes.
*   **Spelling and Casing**: Verify the spelling and casing of your collection name (`products`) and all field names in Firestore.

By ensuring your Firestore data accurately uses the correct `categorySlug` and `subCategorySlug` values, and by creating any necessary Firestore indexes, your category and subcategory pages should fetch and display the relevant products.
