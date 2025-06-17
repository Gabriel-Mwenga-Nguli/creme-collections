import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Creme Lite',
  description: 'Read the Terms and Conditions for using the Creme Lite website and services.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            Welcome to Creme Lite! These terms and conditions outline the rules and regulations for the use of Creme Lite's Website, located at [Your Website URL].
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Creme Lite if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Definitions</h2>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. 
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Creme Lite, you agreed to use cookies in agreement with the Creme Lite's Privacy Policy. Most interactive websites use cookies to let us retrieve the user’s details for each visit.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. License</h2>
          <p>
            Unless otherwise stated, Creme Lite and/or its licensors own the intellectual property rights for all material on Creme Lite. All intellectual property rights are reserved. You may access this from Creme Lite for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5">
            <li>Republish material from Creme Lite</li>
            <li>Sell, rent or sub-license material from Creme Lite</li>
            <li>Reproduce, duplicate or copy material from Creme Lite</li>
            <li>Redistribute content from Creme Lite</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. User Account</h2>
          <p>
            If you create an account on Creme Lite, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Product Information and Pricing</h2>
          <p>
            We strive to ensure that all details, descriptions, and prices which appear on this Website are accurate, however, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Creme Lite, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Creme Lite, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Governing Law & Jurisdiction</h2>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws of the State of [Your State/Country], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State/Country] for the resolution of any disputes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">8. Changes to Terms</h2>
          <p>
            Creme Lite reserves the right to revise these terms and conditions at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.
          </p>
          
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
