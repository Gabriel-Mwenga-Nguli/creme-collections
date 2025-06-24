import { Suspense } from 'react';
import LoginForm from './login-form';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Creme Collections',
  description: 'Sign in to your Creme Collections account to access your profile, orders, and wishlist.',
};


function LoadingSpinner() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
