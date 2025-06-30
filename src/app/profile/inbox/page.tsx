
"use client";

import { useAuth } from '@/context/AuthContext';
import InboxView from '@/components/features/profile/InboxView';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function InboxPage() {
    const { user, isLoading } = useAuth();

    if(isLoading) {
        return (
            <Card className="shadow-lg h-full flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }
    
    // The InboxView component will handle the case where user is null
    return <InboxView userId={user?.uid || null} userEmail={user?.email || null} />;
}
