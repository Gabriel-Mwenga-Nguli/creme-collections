
# Firebase Cloud Functions: Email Setup

For the `sendBrandedEmail` feature of your application to work, you must configure your Firebase project with credentials to allow it to send emails via a Gmail account. This is done by setting environment variables for your Cloud Functions using the Firebase CLI.

**IMPORTANT:** This setup uses a Google Mail account. It is **highly recommended** to use a dedicated Gmail account for this purpose, not your personal one.

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

## Step 1: Generate a Gmail App Password

You cannot use your regular Gmail password. You must generate a special "App Password" for this service.

1.  **Enable 2-Step Verification**: Go to your [Google Account security settings](https://myaccount.google.com/security) and ensure that **2-Step Verification** is turned **ON**. You cannot create an App Password without this.

2.  **Create an App Password**:
    *   Go to the [App Passwords page](https://myaccount.google.com/apppasswords) in your Google Account.
    *   For "Select app", choose **"Mail"**.
    *   For "Select device", choose **"Other (Custom name)"**.
    *   Give it a name, like "Creme Collections App" and click **"Generate"**.

3.  **Copy the Password**:
    *   A 16-character password will be displayed in a yellow box. **This is the only time you will see this password.**
    *   **Copy this 16-character password.** You will use it in the next step. Do not include the spaces.

## Step 2: Set Firebase Environment Configuration

Now, use the Firebase CLI to set the email and the App Password you just generated as environment variables for your Cloud Functions.

Run these commands in your terminal from your project's root directory:

1.  **Set the email address:**
    ```bash
    firebase functions:config:set gmail.email="your-email@gmail.com"
    ```
    (Replace `your-email@gmail.com` with the Gmail address you are using to send mail).

2.  **Set the App Password:**
    ```bash
    firebase functions:config:set gmail.app_password="your-16-character-app-password"
    ```
    (Replace `your-16-character-app-password` with the password you copied in Step 1).

## Step 3: Deploy Your Functions

For the configuration to take effect, you need to deploy your Cloud Functions.

```bash
firebase deploy --only functions
```

After deployment, your `sendBrandedEmail` function will be able to send emails using the configured account.
