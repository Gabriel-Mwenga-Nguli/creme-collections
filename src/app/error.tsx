
'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

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

  const isPermissionError = error.message.includes('FIREBASE PERMISSION ERROR');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
        {isPermissionError ? (
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
                            <li>Delete the existing rules and replace them with the content from the <code>FIRESTORE_RULES.md</code> file in your project.</li>
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
