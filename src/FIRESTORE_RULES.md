
# Firestore Security Rules Fix

Your application is currently being blocked by Firestore's default security rules, causing a "Missing or insufficient permissions" error when trying to fetch user data after login or display products/promotions.

To fix this, you need to update your Firestore security rules to allow public read access for your `products` and `promotions` collections while also allowing a logged-in user to access their own data.

## **Instructions**

1.  **Go to the Firebase Console**: Open your project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Navigate to Firestore**: In the left-hand navigation pane, click on **Build > Firestore Database**.
3.  **Open the Rules Tab**: Click on the **Rules** tab at the top of the Firestore viewer.
4.  **Replace the Rules**: Delete the existing rules and replace them with the following code.
5.  **Publish**: Click the **Publish** button to save and apply the new rules. The changes should take effect almost immediately.

---

### **Copy and Paste These Rules:**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Allow public read access to products so your homepage and category pages can load.
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // For admin panel (lock down further in production)
    }

    // Allow public read access to promotions for the homepage slider.
    match /promotions/{promoId} {
      allow read: if true;
      allow write: if request.auth != null; // For admin panel
    }
    
    // Allow users to read and write their own document in the 'users' collection.
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
      allow read, update: if request.auth != null && (request.auth.uid == resource.data.userId);
    }
  }
}
```

---

After you publish these rules, refresh your application page. The error should be resolved, and your products, promotions, and user profile data will be displayed correctly.
