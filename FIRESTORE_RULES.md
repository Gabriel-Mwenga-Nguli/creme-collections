
# Firestore Security Rules

Your application is likely being blocked by Firestore's default security rules. This is **expected behavior** for a new Firebase project and causes the **"Missing or insufficient permissions"** error you may see.

To fix this, you **must** update your Firestore security rules. This will allow your app to read public data like `products` and `promotions`, and allow logged-in users to access their own private data.

## **Instructions**

1.  **Go to the Firebase Console**: Open your project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Navigate to Firestore**: In the left-hand navigation pane, click on **Build > Firestore Database**.
3.  **Open the Rules Tab**: Click on the **Rules** tab at the top of the Firestore viewer.
4.  **Replace the Rules**: Delete the existing rules and replace them with the complete set of rules provided below.
5.  **Publish**: Click the **Publish** button to save and apply the new rules. The changes should take effect almost immediately.

---

### **Copy and Paste These Rules:**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Allow public read access to products and promotions so your homepage and category pages can load.
    match /products/{productId} {
      allow read: if true;
      // Allow writes only for authenticated users (admin role check would be done in backend logic)
      allow write: if request.auth != null; 
    }
    
    match /promotions/{promoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow any authenticated user to create a gift card.
    // Reading/updating should be locked down further in a real-world scenario.
    match /giftCards/{giftCardId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null; // For admin/redemption logic
    }

    // Allow users to create, read, and write their own document in the 'users' collection.
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Secure user-specific sub-collections. Only the logged-in user can access their own documents.
    // This covers wishlist, invoices, addresses, messages, etc.
    match /users/{userId}/{document=**} {
      allow read, write, create, delete: if request.auth != null && request.auth.uid == userId;
    }

    // Allow logged-in users to create orders.
    // Reading/updating should be restricted to the owner. Admins will need separate rules.
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```
---

After you publish these rules, refresh your application page. The permission errors should be resolved, and your products, promotions, and user profile data will be displayed correctly.
