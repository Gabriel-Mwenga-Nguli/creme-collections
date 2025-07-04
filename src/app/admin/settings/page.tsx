
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ServerOff } from 'lucide-react';

export default function AdminFeatureDisabledPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader>
          <ServerOff className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle className="mt-4 text-2xl font-bold">Admin Panel Disabled</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The Admin Panel is temporarily disabled as the application is running without backend services.
          </CardDescription>
          <Button asChild className="mt-6">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
