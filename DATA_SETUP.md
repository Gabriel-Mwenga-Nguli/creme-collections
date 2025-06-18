
# Firestore Data Setup for Creme Collections

For your Creme Collections application to display products, you need to have data in your Firestore database, specifically in a collection named `products`.

Follow these steps to add sample product data through the Firebase Console:

## 1. Access Firestore Database

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your Firebase project (e.g., "cremecollections").
3.  In the left-hand navigation pane, click on **Build > Firestore Database**.
4.  If you haven't used Firestore before in this project, you might be prompted to create a database. Choose "Start in test mode" for now if you're just developing (you can secure it later with security rules). Select a Cloud Firestore location.

## 2. Create the `products` Collection (if it doesn't exist)

1.  Once in the Firestore Data viewer, click on **+ Start collection**.
2.  For "Collection ID", enter `products`.
3.  Click "Next".

## 3. Add Product Documents

You'll now add individual product documents to this `products` collection. For each product:

1.  Click **+ Add document**.
2.  Firestore can auto-generate a Document ID, or you can specify your own (e.g., `SKU001`, `stylish-watch-123`). For simplicity, you can let it auto-generate.
3.  Add fields to the document. The field names should match the `Product` interface used in your application (`src/services/productService.ts`). Here's an example of fields for one product. **Field names are case-sensitive.**

    *   `name` (Type: `string`) - Example: `Modern Smartwatch Series X`
    *   `description` (Type: `string`) - Example: `Sleek smartwatch with advanced health tracking and notifications.`
    *   `longDescription` (Type: `string`) - Example: `Full-featured Modern Smartwatch Series X with a vibrant AMOLED display, heart rate monitoring, SpO2 sensor, GPS, and up to 7 days battery life. Compatible with Android and iOS.`
    *   `image` (Type: `string`) - Example: `https://placehold.co/600x600.png` (Replace with actual image URLs)
    *   `images` (Type: `array`) - Add multiple image URLs as strings within the array.
        *   `0` (Type: `string`) - `https://placehold.co/600x600/EFEFEF/AAAAAA.png`
        *   `1` (Type: `string`) - `https://placehold.co/600x600/CCCCCC/333333.png`
    *   `dataAiHint` (Type: `string`) - Example: `smartwatch technology`
    *   `offerPrice` (Type: `number`) - Example: `12999` (Store prices in the smallest currency unit like KES cents if dealing with cents, or as whole numbers if not. The example assumes whole KES).
    *   `originalPrice` (Type: `number`) - Example: `15999`
    *   `rating` (Type: `string` or `number`) - Example: `4.5` (Can be a string or number, your code handles both)
    *   `reviewsCount` (Type: `number`) - Example: `150`
    *   `availability` (Type: `string`) - Example: `In Stock` (Other options: `Out of Stock`, `Pre-order`)
    *   `category` (Type: `string`) - Example: `Electronics`
    *   `categorySlug` (Type: `string`) - Example: `electronics` (Lowercase, hyphenated if multiple words)
    *   `subCategory` (Type: `string`) - Example: `Wearable Technology`
    *   `subCategorySlug` (Type: `string`) - Example: `wearables`
    *   `brand` (Type: `string`) - Example: `TechNova`
    *   `stock` (Type: `number`) - Example: `50`
    *   `isFeatured` (Type: `boolean`) - Example: `true` (or `false`)
    *   `isWeeklyDeal` (Type: `boolean`) - Example: `false` (or `true`)

4.  Click "Save" to add the document.

**Repeat this process to add a few more sample products.** Try to create products in different categories and subcategories (e.g., "Fashion", "Home & Living") and vary `isFeatured` and `isWeeklyDeal` to see them populate different sections of your homepage.

### Important Field Notes:

*   **`categorySlug` and `subCategorySlug`**: These are important for the category pages to filter products correctly. Make them lowercase and use hyphens for spaces (e.g., `home-living`, `mobiles-accessories`). These slugs should match the ones defined in `src/lib/constants.ts` for your navigation links.
*   **`isFeatured`**: Set to `true` for products you want to appear in the "Featured Products" section on the homepage.
*   **`isWeeklyDeal`**: Set to `true` for products you want in the "Flash Deals of the Week!" slider.
*   **Images**: Use publicly accessible URLs for images. `https://placehold.co` is good for placeholders.

## 4. Verify in Your App

Once you've added some data:

1.  **Ensure your Firebase configuration in `.env.local` is correct and your Next.js app is running.**
2.  Navigate to your application in the browser (e.g., `http://localhost:9002`).
3.  You should see products appearing on the homepage, category pages, and product detail pages.

If products are not showing up, double-check:
*   Your Firebase configuration in `.env.local`.
*   The server terminal logs for any errors related to Firebase initialization or Firestore queries.
*   The spelling and casing of your collection name (`products`) and field names in Firestore.
*   Your Firestore Security Rules (for development, "test mode" rules allow open access, but for production, you'll need to secure them).

This setup will enable your application to fetch and display product data from Firestore.
