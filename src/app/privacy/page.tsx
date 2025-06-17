import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Creme Lite',
  description: 'Read the Creme Lite Privacy Policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            At Creme Lite ("we", "us", "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Information We Collect</h2>
          <p>
            We may collect personal information from you in a variety of ways, including when you register on the site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The types of personal information collected may include:
          </p>
          <ul className="list-disc pl-5">
            <li>Name</li>
            <li>Contact information (email address, phone number, shipping address)</li>
            <li>Payment information (credit card details, billing address - processed securely by third-party payment gateways)</li>
            <li>Demographic information (age, gender, preferences)</li>
            <li>Usage data (browsing history, IP address, device information)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-5">
            <li>To provide, operate, and maintain our website and services</li>
            <li>To process your transactions and manage your orders</li>
            <li>To improve customer service and personalize your experience</li>
            <li>To send periodic emails, including newsletters, promotions, and updates (you can opt-out at any time)</li>
            <li>To communicate with you, respond to inquiries, and provide support</li>
            <li>To analyze website usage and improve our offerings</li>
            <li>To prevent fraudulent activities and ensure the security of our platform</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information except in the following circumstances:
          </p>
          <ul className="list-disc pl-5">
            <li>With trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</li>
            <li>When we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</li>
            <li>In connection with a merger, acquisition, or sale of all or a portion of our assets.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Your Rights</h2>
          <p>
            You have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us if you wish to exercise these rights.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Cookies</h2>
          <p>
            Our website uses cookies to enhance your experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@cremelite.com" className="text-primary hover:underline">privacy@cremelite.com</a>.
          </p>
          
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
