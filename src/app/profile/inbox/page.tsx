
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

export default function InboxPage() {
  return (
    <Card className="shadow-lg h-full flex flex-col min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Inbox className="mr-2 h-5 w-5 text-primary" /> My Inbox
        </CardTitle>
        <CardDescription>View messages from sellers and customer support.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p>Your inbox is empty.</p>
           <p className="text-sm">This feature is for demonstration purposes.</p>
        </div>
      </CardContent>
    </Card>
  );
}
