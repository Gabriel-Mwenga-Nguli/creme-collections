
# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Running the Project in Simulation Mode

This project is currently configured to run in a **frontend-only simulation mode**. All backend features, including user authentication and database connections, have been disabled to provide a stable environment for UI development without requiring a backend setup.

Product data and other content are served from local mock files.

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:9002`.

## AI-Powered Features

AI flows are managed with Genkit. To work with them locally, you can run the Genkit development UI in a separate terminal. This allows you to test and debug your AI flows independently.

```bash
# Start the Genkit development server
npm run genkit:dev

# Or run in watch mode to automatically reload on changes
npm run genkit:watch
```
