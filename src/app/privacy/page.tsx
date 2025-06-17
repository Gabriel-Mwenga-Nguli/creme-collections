
"use client"; 
import type { Metadata } from 'next';
import { useState, useEffect } from 'react';

// export const metadata: Metadata = { // Cannot be used in client components this way
//   title: 'Privacy Policy - Creme Lite',
//   description: 'Read the Creme Lite Privacy Policy to understand how we collect, use, and protect your personal information.',
// };

export default function PrivacyPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Privacy Policy - Creme Lite';
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            At Creme Lite ("we", "us", "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (https://cremelite.com or your actual domain) and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Information We Collect</h2>
          <p>
            We may collect personal information from you in a variety of ways, including when you register on the site, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or interact with other site features. The types of personal information collected may include:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, shipping address, billing address.</li>
            <li><strong>Payment Information:</strong> Credit/debit card details, mobile money information. Note: Payment information is processed securely by our third-party payment gateways and typically not stored on our servers.</li>
            <li><strong>Order Information:</strong> Details about products you purchase, order history.</li>
            <li><strong>Account Information:</strong> Username, password (hashed), preferences.</li>
            <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services, including browsing history and items viewed.</li>
            <li><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-5">
            <li>To provide, operate, and maintain our website and services.</li>
            <li>To process your transactions and manage your orders effectively.</li>
            <li>To improve customer service and personalize your shopping experience.</li>
            <li>To send periodic emails, including order updates, newsletters, promotions, and surveys (you can opt-out of marketing communications at any time).</li>
            <li>To communicate with you, respond to your inquiries, and provide support.</li>
            <li>To analyze website usage, monitor trends, and improve our offerings and marketing efforts.</li>
            <li>To prevent fraudulent activities, ensure the security of our platform, and comply with legal obligations.</li>
            <li>To administer contests, promotions, or other site features.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personally identifiable information to others. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>With Trusted Third-Party Service Providers:</strong> We may share your information with third parties who perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance. These service providers will only have access to your information to the extent necessary to perform their functions and are obligated to protect your information.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency), to protect and defend our rights or property, prevent or investigate possible wrongdoing in connection with the Service, protect the personal safety of users of the Service or the public, or protect against legal liability.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, financing, reorganization, or sale of all or a portion of our assets, your personal information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your personal information.</li>
            <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
          </p>
          <p>While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security. No method of transmission over the Internet, or method of electronic storage, is 100% secure.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-5">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p>If you wish to exercise these rights, please contact us using the contact information below.</p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Cookies and Tracking Technologies</h2>
          <p>
            Our website uses cookies and similar tracking technologies (like web beacons and pixels) to enhance your experience, analyze site traffic, and for marketing purposes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. You can choose to disable cookies through your browser settings, but this may affect your ability to use some features of our website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Children's Privacy</h2>
          <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: <a href="mailto:privacy@cremelite.com" className="text-primary hover:underline">privacy@cremelite.com</a><br />
            Address: 123 Creme Lite St, Suite 100, Commerce City, EC 54321, Kenya
          </p>
          
          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
