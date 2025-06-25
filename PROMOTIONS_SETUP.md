# Firestore Data Setup for Promotions

**NOTE:** The application is currently running in a **frontend-only simulation mode**. These instructions are for when you connect the application to a live Firebase backend and do not need to be followed for the current UI development phase.

---

For the "Today's Best Promotions" slider on your homepage to display correctly, you need to have a `promotions` collection in your Firestore database.

Follow these steps to add sample promotion data through the Firebase Console:

## 1. Access Firestore Database

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your Firebase project.
3.  In the left-hand navigation pane, click on **Build > Firestore Database**.

## 2. Create the `promotions` Collection

1.  Once in the Firestore Data viewer, click on **+ Start collection**.
2.  For "Collection ID", enter `promotions`. **This must be exactly `promotions` (lowercase).**
3.  Click "Next".

## 3. Add Promotion Documents

You will now add individual promotion documents to this collection. For each promotion, click **+ Add document**, let Firestore auto-generate the ID, and add the following fields.

---

### Example 1: First Order Discount

*   `type` (string) - `firstOrder`
*   `title` (string) - `Ksh 500 Off!`
*   `subtitle` (string) - `Your First Creme Collections Order`
*   `code` (string) - `KARIBU500`
*   `terms` (string) - `*Min. spend Ksh 2,500. T&Cs apply.`
*   `href` (string) - `/register`
*   `dataAiHint` (string) - `first order discount`
*   `backgroundColor` (string) - `bg-gradient-to-br from-primary to-accent`
*   `foregroundColor` (string) - `text-primary-foreground`
*   `accentColor` (string) - `text-white`
*   `displayOrder` (number) - `1`
*   `isActive` (boolean) - `true`

---

### Example 2: Tiered Discount

*   `type` (string) - `tieredDiscount`
*   `title` (string) - `Buy More, Save More!`
*   `tiers` (array)
    *   `0` (map)
        *   `amount` (number) - 400
        *   `spend` (number) - 5000
    *   `1` (map)
        *   `amount` (number) - 700
        *   `spend` (number) - 8000
    *   `2` (map)
        *   `amount` (number) - 1000
        *   `spend` (number) - 10000
*   `code` (string) - `SAVEMORE`
*   `terms` (string) - `*Limited Time Offer. T&Cs Apply.`
*   `href` (string) - `/products`
*   `dataAiHint` (string) - `tiered discount offer`
*   `backgroundColor` (string) - `bg-gradient-to-tr from-slate-900 to-slate-700`
*   `foregroundColor` (string) - `text-white`
*   `accentColor` (string) - `text-primary`
*   `displayOrder` (number) - `2`
*   `isActive` (boolean) - `true`

---

### Example 3: Reveal Code (Fashion)

*   `type` (string) - `revealCode`
*   `title` (string) - `Fashion Finds`
*   `subtitle` (string) - `Up to 20% Off Select Apparel`
*   `actionText` (string) - `TAP TO REVEAL`
*   `codePlaceholder` (string) - `CODE`
*   `productImage` (string) - `/images/banners/fashion.png`
*   `href` (string) - `/products/category/fashion`
*   `dataAiHint` (string) - `fashion apparel sale`
*   `backgroundColor` (string) - `bg-secondary`
*   `foregroundColor` (string) - `text-secondary-foreground`
*   `accentColor` (string) - `text-primary border-primary`
*   `displayOrder` (number) - `3`
*   `isActive` (boolean) - `true`

---

### Example 4: Reveal Code (Home Essentials)

*   `type` (string) - `revealCode`
*   `title` (string) - `Home Essentials`
*   `subtitle` (string) - `Save Big on Decor & More`
*   `actionText` (string) - `TAP TO REVEAL`
*   `codePlaceholder` (string) - `CODE`
*   `productImage` (string) - `/images/banners/home.png`
*   `href` (string) - `/products/category/home-living`
*   `dataAiHint` (string) - `home decor sale`
*   `backgroundColor` (string) - `bg-card`
*   `foregroundColor` (string) - `text-card-foreground`
*   `accentColor` (string) - `text-primary border-primary`
*   `displayOrder` (number) - `4`
*   `isActive` (boolean) - `true`

### Field Notes:

*   **`isActive` (boolean)**: Set to `true` for promotions you want to appear on the homepage. Set to `false` to hide them without deleting.
*   **`displayOrder` (number)**: Promotions will be sorted by this number in ascending order (1, 2, 3, etc.).
*   **Styling fields** (`backgroundColor`, `foregroundColor`, etc.): These accept Tailwind CSS class names to control the appearance of each card.
*   **`href` (string)**: The URL the card will link to when clicked.
*   **`productImage` (string)**: Use a local path to an image in your `/public` directory (e.g., `/images/banners/fashion.png`).

By following these steps, you can dynamically manage the promotions displayed on your homepage directly from Firestore.
