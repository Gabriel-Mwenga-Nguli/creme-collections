
# Creme Collections - Next.js E-Commerce Platform

This is a Next.js e-commerce starter project built for Firebase Studio, featuring a modern tech stack and AI-powered capabilities.

## Getting Started

Follow these steps to set up and run the project with a live Firebase backend.

### 1. Prerequisites

*   Node.js (v20 or later recommended)
*   A Firebase project. If you don't have one, create one at [firebase.google.com](https://firebase.google.com).
*   Firebase CLI: `npm install -g firebase-tools`

### 2. Environment Setup

1.  **Firebase Configuration**:
    *   Create a file named `.env.local` in the root of the project.
    *   Copy the contents of `.env.example` into `.env.local`.
    *   Go to your Firebase project settings, find your web app configuration, and copy the values into the corresponding variables in `.env.local`.

2.  **Genkit API Key**:
    *   In your Google Cloud Console (for your Firebase project), enable the "Vertex AI API".
    *   Go to "APIs & Services" > "Credentials" and create a new API key.
    *   In your terminal, set this key as a secret for App Hosting:
        ```bash
        firebase apphosting:secrets:set GOOGLE_API_KEY
        ```
        Paste your API key when prompted. This will make it available to your deployed app. For local development, add it to `.env.local`.

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

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

3.  **Set Up Firestore Indexes**:
    *   Your app requires specific database indexes to filter and sort data correctly.
    *   Run the app locally (`npm run dev`) and navigate to pages like `/products`.
    *   Open your browser's developer console. You will likely see errors from Firebase with a message like `The query requires an index.`
    *   **Click the link provided in the error message.** It will take you directly to the Firebase console to create the required index. Click "Create Index".
    *   Repeat this process for any other index-related errors you see as you navigate the site.

### 4. Running the Development Server

Once the setup is complete, you can run the app:

```bash
npm run dev
```

This will start the Next.js app on `http://localhost:9002` (or another port if 9002 is busy).

### 5. Running Genkit AI Flows Locally

To test and debug AI flows, run the Genkit development UI in a separate terminal:

```bash
# Start the Genkit development server
npm run genkit:dev
```

This will typically start on `http://localhost:4000`.
