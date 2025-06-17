
import type { Metadata } from 'next';
import { BotIcon as BotMessageSquare } from 'lucide-react'; // Renamed to avoid conflict if BotIcon is used differently

export const metadata: Metadata = {
  title: 'Chat Support - Creme Collections',
  description: 'Get instant help from our AI-powered chat support or connect with a shop manager.',
};

export default function ChatSupportPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-primary mb-8 font-headline">AI Chat Support</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Have questions? Our AI assistant, CremeBot, is here to help you 24/7. 
          You can also use the chat widget available on all pages for quick assistance.
          If needed, CremeBot can guide you on how to contact a shop manager.
        </p>
        <div className="mt-8 p-8 bg-card rounded-lg shadow-lg min-h-[400px] flex flex-col items-center justify-center">
          <BotMessageSquare className="h-16 w-16 text-primary mb-6" />
          <p className="text-xl text-foreground">Our AI Chat Widget is active!</p>
          <p className="text-muted-foreground mt-2">Click the chat icon at the bottom-right of your screen to start a conversation with CremeBot.</p>
          <p className="text-sm text-muted-foreground mt-4">This page can be used for more focused support interactions or if you prefer a larger chat window in the future.</p>
        </div>
      </div>
    </div>
  );
}
