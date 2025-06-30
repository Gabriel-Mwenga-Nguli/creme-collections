
'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, KeyRound } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const isPermissionError = error.message.includes('permission-denied') || error.message.includes('insufficient permissions');
  const isApiKeyError = error.message.includes('auth/invalid-api-key') || error.message.includes('FIREBASE_CONFIG_MISSING');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
        {isApiKeyError ? (
            <Card className="max-w-2xl mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <KeyRound className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-destructive text-2xl">Action Required: Configure Firebase API Key</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-4 text-destructive-foreground">
                    <p>
                        Your app is failing to connect to Firebase because the API key is missing or invalid. This is a common setup issue.
                    </p>
                    <p>
                        <strong>To fix this, you must add your Firebase project's credentials to the <code>.env.local</code> file.</strong>
                    </p>
                    <div className="bg-card/50 p-4 rounded-md text-sm">
                        <h4 className="font-bold mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Find or create the <code>.env.local</code> file in your project's root directory.</li>
                            <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a>, select your project, and go to <strong>Project Settings</strong>.</li>
                            <li>Under "Your apps", find your web app and copy its configuration object.</li>
                            <li>Paste the values into the corresponding <code>NEXT_PUBLIC_...</code> variables in your <code>.env.local</code> file.</li>
                            <li>Make sure to restart the development server after saving the file.</li>
                        </ol>
                    </div>
                     <p>
                        You can find a template for this file in <code>.env.example</code> and detailed instructions in <code>README.md</code>.
                    </p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        I've configured my keys, reload the app
                    </Button>
                </CardContent>
            </Card>
        ) : isPermissionError ? (
            <Card className="max-w-2xl mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-destructive text-2xl">Action Required: Update Firestore Security Rules</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-4 text-destructive-foreground">
                    <p>
                        Your app is correctly trying to fetch data, but it's being blocked by Firebase's default security rules. This is a standard security measure for all new projects.
                    </p>
                    <p>
                        <strong>To fix this, you must update the rules in your Firebase Console.</strong>
                    </p>
                    <div className="bg-card/50 p-4 rounded-md text-sm">
                        <h4 className="font-bold mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Open your project in the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a>.</li>
                            <li>Navigate to the <strong>Firestore Database</strong> section.</li>
                            <li>Click on the <strong>Rules</strong> tab.</li>
                            <li>Delete the existing rules and replace them with the content from the <code>src/FIRESTORE_RULES.md</code> file in your project.</li>
                            <li>Click <strong>Publish</strong>.</li>
                        </ol>
                    </div>
                    <p>
                        After publishing the new rules, the error will be resolved. You can then try reloading the page.
                    </p>
                    <Button onClick={() => reset()} className="mt-4">
                        Try Again After Updating Rules
                    </Button>
                </CardContent>
            </Card>
        ) : (
             <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle>Something went wrong!</CardTitle>
                    <CardDescription>{error.message || "An unexpected error occurred."}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={() => reset()}>
                        Try again
                    </Button>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
