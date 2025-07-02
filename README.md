
# Creme Collections - Next.js E-Commerce Platform

This is a Next.js e-commerce starter project built for Firebase Studio, featuring a modern tech stack and AI-powered capabilities.

---
## ⚠️ Critical Setup: Read This First If Your App Fails to Start

If you see an error page after running the app, it's almost always one of two common setup issues. Please check them in order.

### Problem 1: "Action Required: Update Firestore Security Rules"

If your error page mentions **"Missing or insufficient permissions"**, this is expected. Your database is currently locked down.

**➡️ The Fix: Update Your Firestore Rules**

1.  **Go to your Firebase project:** [Firebase Console](https://console.firebase.google.com/)
2.  Navigate to **Build > Firestore Database**.
3.  Click the **Rules** tab.
4.  **Delete** the existing default rule (it will look something like `allow read, write: if false;`).
5.  Open the file named **`FIRESTORE_RULES.md`** in the root of this project.
6.  **Copy the entire contents** of that file.
7.  **Paste** the new rules into the editor in the Firebase Console.
8.  Click **Publish**. The changes are almost instant.
9.  Go back to your running application and **reload the page**. The error should be gone.

---
### Problem 2: "Authentication Not Configured" or "Invalid API Key"

If the login/register page shows an **"Authentication Not Configured"** message, or your error page mentions **"auth/invalid-api-key"**, it means your app can't connect to your Firebase backend. This happens for two different reasons depending on where you are running the app.

**➡️ The Fix (For Local Development): Create your `.env.local` file**

1.  In the root of your project, find the file `.env.example` and **make a copy of it**.
2.  Rename the copy to **`.env.local`**. (This file is ignored by git and is where your secret keys go).
3.  Follow the instructions in the "Getting Your API Keys" section below to get your keys from the Firebase and Google Cloud consoles and paste them into your new `.env.local` file.
4.  **Important**: You must **stop and restart** your development server (`npm run dev`) after creating or changing the `.env.local` file.

**➡️ The Fix (For a Deployed App on App Hosting): Configure Production Secrets**

Your live, deployed application **does not** use the `.env.local` file. You must set the API keys as secrets in your hosting environment. See the **Production Deployment** section for full instructions.

---

## Getting Started

Follow these steps to set up and run the project with a live Firebase backend.

### 1. Prerequisites

*   Node.js (v20 or later recommended)
*   A Firebase project. If you don't have one, create one at [firebase.google.com](https://firebase.google.com).
*   Firebase CLI: `npm install -g firebase-tools`

### 2. Getting Your API Keys

#### **A) Firebase Web SDK Keys**

1.  Open your project in the [Firebase Console](https://console.firebase.google.com/).
2.  Click the **gear icon** ⚙️ next to "Project Overview" and select **Project settings**.
3.  In the "General" tab, scroll down to the "Your apps" section.
4.  Find your web app (if you don't have one, click "Add app" and select the Web icon `</>`).
5.  In your web app's settings, find the `firebaseConfig` object. It looks like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      // ...and so on
    };
    ```
6.  You will use these values to configure your local development and production environments.

#### **B) Genkit (Vertex AI) API Key**

1.  Open the [Google Cloud Console](https://console.cloud.google.com/) and make sure your Firebase project is selected.
2.  In the navigation menu, go to **APIs & Services > Credentials**.
3.  Click **+ CREATE CREDENTIALS** at the top and select **API key**.
4.  A new API key will be created. Copy this key. This will be your `GOOGLE_API_KEY`.
5.  **Important**: Make sure the **Vertex AI API** is enabled for your project. You can do this in the "APIs & Services > Library" section of the Google Cloud Console.

### 3. Environment Setup for Local Development

1.  **Create `.env.local` file**:
    *   As mentioned in the "Critical Setup" section, copy `.env.example` to a new file named `.env.local`.
    *   Copy the values from your `firebaseConfig` object and your new Google API key into the corresponding variables in `.env.local`.
2.  **Restart the Development Server**:
    *   If your server is running, you **must stop it and restart it** for the changes in `.env.local` to take effect.
    *   Run `npm run dev` in your terminal.

### 4. Firebase Backend Setup

Your application will not work correctly until you set up your Firestore database and security rules.

1.  **Set Up Firestore Database**:
    *   Go to your [Firebase Console](https://console.firebase.google.com/).
    *   Navigate to **Build > Firestore Database**.
    *   Click **Create database**. Start in **production mode**. Choose a location.
    *   Follow the instructions in `DATA_SETUP.md` to create the necessary collections (`products`, `promotions`) and add sample data. This is crucial for the app to display content.

2.  **Set Up Firestore Security Rules**:
    *   This is the most critical step to avoid permission errors.
    *   In the Firestore Database section of your console, click the **Rules** tab.
    *   Open the `FIRESTORE_RULES.md` file in this project.
    *   Copy the entire rules content and paste it into the rules editor in your console, replacing the default rules.
    *   Click **Publish**.

3.  **Set Up Cloud Functions for Email**:
    *   This project includes a Cloud Function for sending emails. To make it work, you need to provide it with email credentials.
    *   Follow the detailed instructions in the `EMAIL_SETUP.md` file to configure this feature.

4.  **Set Up Firestore Indexes**:
    *   Your app requires specific database indexes to filter and sort data correctly.
    *   Run the app locally (`npm run dev`) and navigate to pages like `/products`.
    *   Open your browser's developer console. You will likely see errors from Firebase with a message like `The query requires an index.`
    *   **Click the link provided in the error message.** It will take you directly to the Firebase console to create the required index. Click "Create Index".
    *   Repeat this process for any other index-related errors you see as you navigate the site.

### 5. Running the Development Server

Once the local setup is complete, you can run the app:

```bash
npm run dev
```

This will start the Next.js app on `http://localhost:9002` (or another port if 9002 is busy).

---

## Production Deployment (on App Hosting)

When you deploy your application, the variables in `.env.local` **are not used**. You must configure secrets in your App Hosting environment.

1.  **Set the Genkit API Key Secret**:
    ```bash
    firebase apphosting:secrets:set GOOGLE_API_KEY
    ```
    When prompted, paste your `GOOGLE_API_KEY` value.

2.  **Set the Firebase Web SDK Secrets**:
    Run the `set` command for each of the `NEXT_PUBLIC_FIREBASE_` variables. For example:
    ```bash
    firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
    firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    # ... and so on for all the keys from your firebaseConfig object.
    ```

3.  **Update `apphosting.yaml`**:
    *   Open the `apphosting.yaml` file.
    *   **Uncomment** all the lines under the `env:` section for the Firebase variables. Your file should look like this:

    ```yaml
    # ... (other settings) ...
    env:
      - variable: GOOGLE_API_KEY
        secret: GOOGLE_API_KEY
    
      - variable: NEXT_PUBLIC_FIREBASE_API_KEY
        secret: NEXT_PUBLIC_FIREBASE_API_KEY
        availability:
          - BUILD
          - RUNTIME
      - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        # ... (and so on for all variables, uncommented)
    ```

4.  **Deploy Your App**:
    After setting all the secrets and updating the YAML file, deploy your application:
    ```bash
    firebase deploy --only hosting
    ```

---

## Other Features

### Accessing the Admin Dashboard
*   **URL**: Navigate to `/admin/login` on your local or hosted site.
*   **Setup**: Follow the `ADMIN_SETUP.md` guide to create your first admin user via custom claims.

### Running Genkit AI Flows Locally
To test and debug AI flows, run the Genkit development UI in a separate terminal:
```bash
# Start the Genkit development server
npm run genkit:dev
```
This will typically start on `http://localhost:4000`.
