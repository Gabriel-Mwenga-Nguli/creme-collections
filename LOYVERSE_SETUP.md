# Firebase Cloud Functions: Loyverse API Setup

For the `getLoyverseProducts` feature of your application to work, you must configure your Firebase project with your Loyverse API token. This is done by setting an environment variable for your Cloud Functions using the Firebase CLI.

This ensures your private API token is kept secure on the server and is not exposed in your web application's code.

## Prerequisites

1.  **Install Firebase CLI**: If you haven't already, install the Firebase command-line tools:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Select Your Project**: Ensure you are in your project's root directory in your terminal and set the correct Firebase project:
    ```bash
    firebase use [your-firebase-project-id]
    ```
    Replace `[your-firebase-project-id]` with your actual project ID from the Firebase console.

## Step 1: Get Your Loyverse API Token

1.  Log in to your [Loyverse Back Office](https://loyverse.com/login).
2.  Navigate to **Apps -> API Tokens**.
3.  Click **+ ADD TOKEN**.
4.  Give the token a name (e.g., "Creme Collections Web App").
5.  Ensure the "Read Items" permission is checked.
6.  Click **Save**.
7.  Your new API token will be displayed. **Copy this token.**

## Step 2: Set the Firebase Environment Variable

Now, use the Firebase CLI to set the Loyverse API token you just copied as an environment variable for your Cloud Functions.

Run the following command in your terminal from your project's root directory, replacing the example token with your own:

```bash
firebase functions:config:set loyverse.apitoken="PZ7WG4UKGlcJ8pCjnErY"
```

## Step 3: Deploy Your Functions

For the new configuration and function to take effect, you need to deploy your Cloud Functions.

```bash
firebase deploy --only functions
```

After deployment, your application will be able to securely call the `getLoyverseProducts` function, which can then fetch data from your Loyverse inventory.
