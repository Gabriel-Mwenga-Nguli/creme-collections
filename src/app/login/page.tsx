
import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login - Creme Collections',
  description: 'Sign in to your Creme Collections account.',
};

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/forms/login-banner.png')" }}
      data-ai-hint="secure access"
    >
      <LoginForm />
    </div>
  );
}
