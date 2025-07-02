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

  const isApiKeyError = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || error.message.includes('auth/invalid-api-key') || error.message.includes('FIREBASE_CONFIG_MISSING');
  const isPermissionError = error.message.includes('permission-denied') || error.message.includes('insufficient permissions');
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const rulesUrl = projectId 
    ? `https://console.firebase.google.com/project/${projectId}/firestore/rules`
    : `https://console.firebase.google.com/`;


  return (
    <div className="container mx-auto px-4 py-16 text-center">
        {isApiKeyError ? (
            <Card className="max-w-2xl mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <KeyRound className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-destructive text-2xl">Action Required: Configure Firebase API Keys</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-4 text-destructive-foreground">
                    <p>
                        Your app cannot connect to Firebase because the necessary API keys are missing. This is a required setup step.
                    </p>
                    <p>
                        <strong>To fix this, you must create and fill out a <code>.env.local</code> file with your project's credentials.</strong>
                    </p>
                    <div className="bg-card/50 p-4 rounded-md text-sm">
                        <h4 className="font-bold mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>In your project, find the file named <code>.env.example</code> and make a copy of it.</li>
                            <li>Rename the copy to exactly <code>.env.local</code>.</li>
                            <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Console</a>, go to <strong>Project Settings</strong>, find your web app, and copy the configuration values.</li>
                            <li>Paste the values into the corresponding variables in your <code>.env.local</code> file.</li>
                            <li>Restart the development server after saving the file.</li>
                        </ol>
                    </div>
                     <p>
                        For a complete guide, please see the **Critical Setup** section in the main <code>README.md</code> file.
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
                        Your app is correctly trying to fetch data, but it's being blocked by Firebase's default security rules. This is an expected security measure for all new projects.
                    </p>
                    <p>
                        <strong>To fix this, you must update the rules in your Firebase Console.</strong>
                    </p>
                    <div className="bg-card/50 p-4 rounded-md text-sm">
                        <h4 className="font-bold mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>
                              Click this direct link to open the 
                              <a href={rulesUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold mx-1">
                                Firestore Rules page
                              </a> 
                              for your project.
                            </li>
                            <li>Delete the existing rules in the editor.</li>
                            <li>Open the <code>FIRESTORE_RULES.md</code> file from your project's main directory.</li>
                            <li>Copy the full contents of that file and paste them into the editor in the Firebase Console.</li>
                            <li>Click <strong>Publish</strong>.</li>
                        </ol>
                    </div>
                    <p>
                        After publishing the new rules, the error will be resolved. You can then try again.
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
