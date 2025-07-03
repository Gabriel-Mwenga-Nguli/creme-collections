
# Admin Setup Guide: Using Custom Claims

This guide explains how to assign an "admin" role to a user in your Firebase project. This method is more secure and flexible than hardcoding an admin email address.

We will use **Firebase Custom Claims**, which are secure properties attached to a user's account. Our application is now configured to check for a claim named `admin` to determine if a user has administrative privileges.

To set this claim for the first time, you need to use the **Firebase Admin SDK**. The easiest way to do this is with a simple, one-time Node.js script that you run on your local machine.

---

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed on your computer.
2.  **User Account**: The user you want to make an admin must already have an account in your Firebase project (e.g., they have signed up through your website).

---

## Step 1: Get Your Firebase Service Account Key

A service account key is a JSON file that gives a script administrative access to your Firebase project.

1.  **Go to the Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select Your Project**: Choose the Firebase project connected to this application.
3.  **Go to Project Settings**: Click the gear icon ⚙️ next to "Project Overview" and select **Project settings**.
4.  **Go to Service Accounts Tab**: Click on the **Service accounts** tab.
5.  **Generate New Private Key**: Click the **Generate new private key** button. A confirmation popup will appear.
6.  **Confirm and Download**: Click **Generate key**. A JSON file will be downloaded to your computer. Keep this file secure and do not commit it to your git repository.

---

## Step 2: Set Up the Admin Script

1.  **Create a Folder**: On your local computer (outside of this project's directory), create a new folder. For example, name it `firebase-admin-scripts`.
2.  **Move Key File**: Move the JSON key file you just downloaded into this new folder. For easier use, you can rename it to `serviceAccountKey.json`.
3.  **Create Script File**: Inside the same folder, create a new file named `setAdmin.js`.
4.  **Install Firebase Admin SDK**: Open your terminal, navigate into the `firebase-admin-scripts` folder, and run the following command to install the necessary package:
    ```bash
    npm install firebase-admin
    ```
5.  **Edit the Script**: Open `setAdmin.js` in a text editor and paste the following code:

    ```javascript
    const admin = require('firebase-admin');

    // --- CONFIGURATION ---
    // 1. UPDATE THIS PATH:
    //    Replace './serviceAccountKey.json' with the actual path to your downloaded key file.
    const serviceAccount = require('./serviceAccountKey.json');

    // 2. UPDATE THIS EMAIL:
    //    Replace with the email address of the user you want to make an admin.
    //    This user MUST already exist in your Firebase Authentication.
    const userEmail = 'your-admin-email@example.com'; 
    // ---------------------

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    async function setAdminClaim() {
      if (!userEmail || userEmail === 'your-admin-email@example.com') {
        console.error('Error: Please edit setAdmin.js and specify the userEmail.');
        return;
      }

      try {
        const user = await admin.auth().getUserByEmail(userEmail);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`Success! The admin role has been set for ${userEmail}.`);
        console.log('They will get their new permissions the next time they log in.');
        process.exit(0);
      } catch (error) {
        console.error('Error setting custom claim:', error.message);
        process.exit(1);
      }
    }

    setAdminClaim();
    ```

---

## Step 3: Run the Script

1.  **Update the Script**: Before running, make sure you have updated the `serviceAccount` path and the `userEmail` variable in the `setAdmin.js` file.
2.  **Execute from Terminal**: In your terminal, still inside the `firebase-admin-scripts` folder, run the script with Node.js:
    ```bash
    node setAdmin.js
    ```
3.  **Check the Output**:
    *   If successful, you will see a message like: `Success! The admin role has been set for your-admin-email@example.com.`
    *   If it fails, it will show an error message. The most common error is not finding the user, so double-check that the email is correct and the user account exists.

That's it! The specified user now has admin privileges. The next time they log into your application, they will be able to access the Admin Panel. You can repeat this process for any other users you wish to make admins.
