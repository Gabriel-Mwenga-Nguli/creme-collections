
import type { Metadata } from 'next';
import LoginForm from './login-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login - Creme Collections',
  description: 'Sign in to your Creme Collections account.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
