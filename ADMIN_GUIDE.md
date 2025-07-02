# Admin Guide: Managing Your App's Data

Welcome, Admin! This guide explains how to manage your application's data. For this project, you have two primary ways to act as an administrator:

1.  **The Admin Dashboard UI**: A user-friendly web interface for managing products and viewing orders.
2.  **The Firestore Database**: A powerful developer tool for direct data manipulation.

---

## 1. Accessing the Admin Dashboard UI

This project includes a custom-built Admin Dashboard for managing your store.

*   **URL**: Navigate to `/admin/login` on your website.
*   **Login**: The login is currently for demonstration purposes. You can enter **any email and password** to access the dashboard.
*   **Functionality**: From the dashboard, you can view, add, and edit products, and see mock data for orders and customers. As you connect more features to the backend, this will become your primary tool for store management.

---

## 2. Accessing Your Data Backend (Firestore)

Your Firestore database serves as your primary data backend. Here, you can manually view, add, edit, and delete all of your application's data.

1.  **Go to the Firebase Console**: Open your project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2.  **Select Your Project**: Choose the Firebase project connected to this application.
3.  **Navigate to Firestore**: In the left-hand navigation menu, click on **Build > Firestore Database**.

You are now in your app's raw data backend. You will see a list of "collections," which are like folders for your data (e.g., `products`, `users`). Clicking on a collection shows you the "documents" inside it.

---

## 3. Managing Your App's Data Collections

Here is an overview of the main data collections and how to manage them.

### 📦 Products

*   **Collection Name**: `products`
*   **Purpose**: This is your entire product catalog. Every document in this collection is a single product displayed in your store.
*   **How to Manage**: To add or edit products, you can either use the **Admin Dashboard UI** or follow the specific structure in Firestore.
*   **➡️ Detailed Instructions**: For a step-by-step guide on the required data structure (`name`, `offerPrice`, `categorySlug`, `isFeatured`, etc.), please refer to the **`DATA_SETUP.md`** file.

### 🏷️ Promotions

*   **Collection Name**: `promotions`
*   **Purpose**: This collection powers the "Today's Best Promotions" slider on your homepage. Each document is a single promotional card.
*   **How to Manage**: You can add various types of promotions and control their appearance and order.
*   **➡️ Detailed Instructions**: For a step-by-step guide on adding promotions with the correct fields (`type`, `title`, `isActive`, `displayOrder`, etc.), please see the **`PROMOTIONS_SETUP.md`** file.

### 🎁 Gift Cards

*   **Collection Name**: `giftCards`
*   **Purpose**: When a user purchases an AI-generated gift card, the unique card details are stored here.
*   **How to Manage**: This collection is typically managed by the app itself, but you can view purchased cards or manually add new ones here.
*   **➡️ Detailed Instructions**: The data structure for gift cards is explained in the **`GIFT_CARD_SETUP.md`** file.

### 🧑 Users, Orders, and Other Data

*   **`users`**: When a user registers, their profile information (name, email, etc.) is stored in a document here.
*   **`orders`**: When a user completes a checkout, their order details are saved here.
*   **Subcollections**: User-specific data like `invoices` or `wishlist` items are stored in subcollections inside that user's document (e.g., `/users/{someUserId}/invoices/{invoiceId}`).

By using the Firestore console, you have full control over the data that powers your e-commerce application. Always refer to the specific setup guides (`DATA_SETUP.md`, etc.) to ensure you are using the correct field names and data types.
