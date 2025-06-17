import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Support - Creme Lite',
  description: 'Get instant help from our AI-powered chat support or connect with a shop manager.',
};

export default function ChatSupportPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary mb-8 font-headline">AI Chat Support</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Have questions? Our AI assistant is here to help you 24/7. If needed, you can be connected to a shop manager.
        </p>
        {/* Chat interface component will be added here */}
        <div className="mt-8 p-8 bg-card rounded-lg shadow-lg min-h-[400px] flex flex-col items-center justify-center">
          <p className="text-xl text-foreground">Interactive AI chat support coming soon!</p>
          <p className="text-muted-foreground mt-2">Get intelligent assistance for all your product queries.</p>
        </div>
      </div>
    </div>
  );
}
