
# Firebase Studio

This is a NextJS starter in Firebase Studio.

## ⚠️ Important First Steps to Avoid Errors

Before you can see products or other data, you must configure your Firebase project correctly.

### 1. Set Up Environment Variables
Create a `.env.local` file in the root of your project and add your Firebase project configuration. You can find these values in your Firebase project settings. See `src/lib/firebase.ts` for the expected variable names.
Example:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... and other Firebase config values

# The reCAPTCHA key is for your *production* site.
# For local development, see the App Check section below.
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### 2. Update Firestore Security Rules (Critical for Fixing "Permissions Error")
Your app is likely showing a **"Missing or insufficient permissions"** error when trying to display products or access user data. This is expected for a new project. To fix it, you **must** update your Firestore security rules.

**Please see the [FIRESTORE_RULES.md](./src/FIRESTORE_RULES.md) file for instructions and the rules to copy.**

### 3. Authorize Your Domain for Google Login (Critical for Fixing "unauthorized-domain" Error)
If you are using Google Sign-In, you **must** authorize the domain where your app is running. When running your app in Firebase Studio, you will see an `auth/unauthorized-domain` error in the browser console.

1.  **Copy the domain** from the console error message. It will look like `your-long-project-id.cloudworkstations.dev`.
2.  Go to the **Firebase Console** and select your project.
3.  Navigate to **Authentication > Settings > Authorized domains**.
4.  Click **Add domain** and paste the domain you copied.
5.  Click **Add**.

### 4. Fix App Check Errors (appCheck/recaptcha-error)

App Check protects your backend resources, but it requires specific configuration for the domain your app is running on. If you see an `appCheck/recaptcha-error` in your browser console, it's because this configuration is missing for your development environment.

This project is now configured to use **App Check Debug Mode** during local development (`npm run dev`). This is the recommended way to bypass reCAPTCHA errors locally.

**Here's how to fix it permanently for local development:**

1.  **Run your application** locally (`npm run dev`).
2.  **Open your browser's Developer Console** (usually F12).
3.  Look for a message that says:
    > `Firebase App Check debug token: [A LONG DEBUG TOKEN]...`
4.  **Copy that entire debug token.**
5.  Go to the **Firebase Console** and select your project.
6.  Navigate to **Build > App Check**.
7.  In the **Apps** tab, find your web app and click the overflow menu (three dots), then select **Manage debug tokens**.
8.  Click **Add debug token** and paste the token you copied from the console.

Once you add the debug token, the `appCheck/recaptcha-error` will be resolved for your local development environment. You will still need to configure the reCAPTCHA provider for your live, production site.

### 5. Add Sample Data
For the application to display products and promotions, you'll need to add data to your Firestore database.
- For products, see [DATA_SETUP.md](./DATA_SETUP.md).
- For promotions, see [PROMOTIONS_SETUP.md](./PROMOTIONS_SETUP.md).


## Running the Project

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:9002`.

3.  **(Optional) Run Genkit development server:**
    If you are working with Genkit AI flows, you can run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```

## Firebase Services

*   **Authentication**: Uses Firebase Auth for user login and registration.
*   **Firestore**: Used as the primary database for products, user data, etc.
*   **Cloud Functions**: Backend logic can be deployed using Firebase Functions (see the `functions` directory).
*   **Genkit**: AI flows are managed with Genkit (see the `src/ai` directory).

Remember to check your server terminal for logs, especially related to Firebase initialization, if you encounter issues.
