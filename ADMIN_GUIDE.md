# Admin Guide: Managing Your App's Data in Firestore

Welcome, Admin! This guide explains how to manage your application's data using the Firebase Console. For this project, the **Firestore database serves as your primary admin backend**. Here, you can manually view, add, edit, and delete products, promotions, orders, and user data.

## 1. Accessing Your Admin Backend (Firestore)

1.  **Go to the Firebase Console**: Open your project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  **Select Your Project**: Choose the Firebase project connected to this application.
3.  **Navigate to Firestore**: In the left-hand navigation menu, click on **Build > Firestore Database**.

You are now in your app's admin backend. You will see a list of "collections," which are like folders for your data (e.g., `products`, `users`). Clicking on a collection shows you the "documents" inside it.

---

## 2. Managing Your App's Data Collections

Here is an overview of the main data collections and how to manage them.

### 📦 Products

*   **Collection Name**: `products`
*   **Purpose**: This is your entire product catalog. Every document in this collection is a single product displayed in your store.
*   **How to Manage**: To add or edit products, you must follow a specific structure so that the app can display them correctly on the homepage and category pages.
*   **➡️ Detailed Instructions**: For a step-by-step guide on adding products with the correct fields (like `name`, `offerPrice`, `categorySlug`, `isFeatured`, etc.), please refer to the **`DATA_SETUP.md`** file in your project.

### 🏷️ Promotions

*   **Collection Name**: `promotions`
*   **Purpose**: This collection powers the "Today's Best Promotions" slider on your homepage. Each document is a single promotional card.
*   **How to Manage**: You can add various types of promotions (e.g., first-order discounts, tiered discounts) and control their appearance and order.
*   **➡️ Detailed Instructions**: For a step-by-step guide on adding promotions with the correct fields (`type`, `title`, `isActive`, `displayOrder`, etc.), please see the **`PROMOTIONS_SETUP.md`** file.

### 🎁 Gift Cards

*   **Collection Name**: `giftCards`
*   **Purpose**: When a user purchases an AI-generated gift card, the unique card details are stored here.
*   **How to Manage**: This collection is typically managed by the app itself, but you can view purchased cards or manually add new ones here.
*   **➡️ Detailed Instructions**: The data structure for gift cards is explained in the **`GIFT_CARD_SETUP.md`** file.

### 🧑 Users, Orders, and Other Data

*   **`users`**: When a user registers, their profile information (name, email, etc.) is stored in a document here. Their user ID will match their Firebase Authentication UID.
*   **`orders`**: When a user completes a checkout, their order details are saved here.
*   **Subcollections**: User-specific data like `invoices` or `wishlist` items are stored in subcollections inside that user's document (e.g., `/users/{someUserId}/invoices/{invoiceId}`).

By using the Firestore console, you have full control over the data that powers your e-commerce application. Always refer to the specific setup guides (`DATA_SETUP.md`, etc.) to ensure you are using the correct field names and data types.