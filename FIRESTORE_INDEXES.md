# Firestore Index Setup

For your application to perform complex queries, such as filtering products by category and sorting them, or filtering promotions by their active status, you need to create corresponding indexes in Firestore.

**Why are indexes needed?**
Firestore uses indexes to make querying your data fast. For simple queries, Firestore can use single-field indexes, which are created automatically. However, for more complex queries (e.g., filtering on one field and sorting on another), you must create a **composite index**.

**How do I know if I need an index?**
If an index is missing, the query will **fail silently** in your app (it will return no data), but Firebase will log a very helpful error message in your **browser's developer console**.

This is the easiest way to create the required indexes.

## Instructions

1.  **Run Your Application**: Start your development server (`npm run dev`).
2.  **Open Developer Tools**: In your browser (like Chrome or Firefox), press `F12` or right-click on the page and select "Inspect" to open the developer tools.
3.  **Navigate and Look for Errors**:
    *   Go to a page that performs a complex query, for example:
        *   The **Homepage** (to load promotions).
        *   Any **Category page** (e.g., `/products/category/electronics`).
    *   In the developer tools, click on the **Console** tab.
    *   Look for an error message from Firebase that looks like this:
        ```
        [FirebaseError]: The query requires an index. You can create it here: [a long URL]
        ```
4.  **Click the Link to Create the Index**:
    *   This is the most important step. **Click the long URL** in the error message.
    *   It will take you directly to the Firebase Console page with all the details for the required index pre-filled.
    *   Review the details and click the **Create Index** button.
5.  **Wait for the Index to Build**:
    *   The index will start building. This might take a few minutes. You can see the status in the Firebase Console.
    *   Once the status shows as "Enabled", the index is ready.
6.  **Refresh Your App**: Go back to your application and refresh the page. The content should now load correctly.

## Common Indexes Needed for This App

You will likely need to create indexes for the following queries:

### 1. Promotions Slider on Homepage

*   **Collection**: `promotions`
*   **Fields to Index**:
    1.  `isActive` (Ascending)
    2.  `displayOrder` (Ascending)
*   **Query Scope**: Collection

This allows the app to fetch only active promotions and sort them in the correct order.

### 2. Product Category Pages

*   **Collection**: `products`
*   **Fields to Index**:
    1.  `categorySlug` (Ascending)
    2.  `createdAt` (Descending) - or whatever field you sort by, e.g., `name` (Ascending).
*   **Query Scope**: Collection

### 3. Product Sub-Category Pages

*   **Collection**: `products`
*   **Fields to Index**:
    1.  `categorySlug` (Ascending)
    2.  `subCategorySlug` (Ascending)
    3.  `createdAt` (Descending) - or another sort field.
*   **Query Scope**: Collection

Remember, the easiest way is to let the error message in the console guide you by providing the creation link.
