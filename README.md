
# Creme Collections - Next.js E-Commerce Platform

This is a Next.js e-commerce starter project built for Firebase Studio, featuring a modern tech stack and AI-powered capabilities.

## Getting Started

Follow these steps to set up and run the project with a live Firebase backend.

### 1. Prerequisites

*   Node.js (v20 or later recommended)
*   A Firebase project. If you don't have one, create one at [firebase.google.com](https://firebase.google.com).
*   Firebase CLI: `npm install -g firebase-tools`

### 2. Environment Setup

#### **For Local Development**

1.  **Create `.env.local` file**:
    *   In the root directory of your project, create a new file named exactly `.env.local`.
    *   Copy the entire contents from the `.env.example` file and paste it into your new `.env.local` file.

2.  **Get Firebase Configuration**:
    *   Open your project in the [Firebase Console](https://console.firebase.google.com/).
    *   Click the **gear icon** ⚙️ next to "Project Overview" and select **Project settings**.
    *   In the "General" tab, scroll down to the "Your apps" section.
    *   Find your web app (if you don't have one, click "Add app" and select the Web icon `</>`).
    *   In your web app's settings, find the `firebaseConfig` object. It looks like this:
        ```javascript
        const firebaseConfig = {
          apiKey: "AIza...",
          authDomain: "your-project.firebaseapp.com",
          projectId: "your-project-id",
          // ...and so on
        };
        ```
    *   Copy the value for each key from this object and paste it into the corresponding `NEXT_PUBLIC_FIREBASE_...` variable in your `.env.local` file.

3.  **Get Genkit (Vertex AI) API Key**:
    *   This key is required for all AI features.
    *   Open the [Google Cloud Console](https://console.cloud.google.com/) and make sure your Firebase project is selected.
    *   In the navigation menu, go to **APIs & Services > Credentials**.
    *   Click **+ CREATE CREDENTIALS** at the top and select **API key**.
    *   A new API key will be created. Copy this key.
    *   Paste the key into your `.env.local` file for the `GOOGLE_API_KEY` variable.
    *   **Important**: Make sure the **Vertex AI API** is enabled for your project. You can do this in the "APIs & Services > Library" section of the Google Cloud Console.

4.  **Restart the Development Server**:
    *   If your server is running, you **must stop it and restart it** for the changes in `.env.local` to take effect.
    *   Run `npm run dev` in your terminal.

#### **For Production Deployment (App Hosting)**

When you deploy your application, the variables in `.env.local` **are not used**. You must configure secrets in your App Hosting environment. See the "Production Deployment" section in `README.md` for full instructions.


### 3. Firebase Backend Setup

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

### 4. Running the Development Server

Once the local setup is complete, you can run the app:

```bash
npm run dev
```

This will start the Next.js app on `http://localhost:9002` (or another port if 9002 is busy).

### 5. Accessing the Admin Dashboard

Your project includes a fully-featured, simulated admin dashboard.

*   **URL**: Navigate to `/admin/login` on your local or hosted site.
*   **Login**: The login is **for demonstration purposes only**. You can enter **any email and password** to access the dashboard.
*   **Functionality**: The dashboard UI is fully built, but actions like adding products or managing users are simulated and will not save data permanently until connected to a live backend.

### 6. Running Genkit AI Flows Locally

To test and debug AI flows, run the Genkit development UI in a separate terminal:

```bash
# Start the Genkit development server
npm run genkit:dev
```

This will typically start on `http://localhost:4000`.
