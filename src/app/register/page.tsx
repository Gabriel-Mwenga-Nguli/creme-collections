
import type { Metadata } from 'next';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'Create Account - Creme Collections',
  description: 'Sign up for an account with Creme Collections.',
};

export default function RegisterPage() {
  return (
     <div 
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/forms/register-banner.png')" }}
      data-ai-hint="new user registration"
    >
      <RegisterForm />
    </div>
  );
}
