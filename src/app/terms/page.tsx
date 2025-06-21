
"use client";
import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Terms & Conditions - Creme Collections';
    setLastUpdatedDate(new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            Welcome to Creme Collections. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Creme Collections's relationship with you in relation to this website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Introduction</h2>
          <p>
            The term 'Creme Collections' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user or viewer of our website. These Terms and Conditions apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. Your Account</h2>
          <p>
            To access certain services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password, and you agree to accept responsibility for all activities that occur under your account. Creme Collections reserves the right to refuse service, terminate accounts, remove or edit content, or cancel orders in its sole discretion.
          </p>
          <p>You must be at least 18 years of age to use this website. By using this website and by agreeing to these terms and conditions, you warrant and represent that you are at least 18 years of age.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. Product Information and Orders</h2>
          <p>
            We endeavor to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
          </p>
          <p>
            All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.
          </p>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. Intellectual Property</h2>
          <p>
            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions. All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable Kenyan law, Creme Collections shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the services; (b) any conduct or content of any third party on the services; (c) any content obtained from the services; and (d) unauthorized access, use, or alteration of your transmissions or content.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Creme Collections and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns, and employees, from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the Republic of Kenya.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">8. Changes to Terms of Service</h2>
          <p>
            You can review the most current version of the Terms of Service at any time on this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
          </p>
          
          <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
            <p><strong>Disclaimer:</strong> This is a sample Terms & Conditions document. It is not legal advice. You should consult with a legal professional to ensure your terms are compliant and tailored to your specific business needs.</p>
          </div>

          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
