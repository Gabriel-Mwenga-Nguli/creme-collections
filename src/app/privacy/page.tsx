
"use client"; 
import { useState, useEffect } from 'react';

export default function PrivacyPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Privacy Policy - Creme Collections';
    setLastUpdatedDate(new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            At Creme Collections ("we", "us", "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, in compliance with Kenya's Data Protection Act, 2019. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Information We Collect</h2>
          <p>
            We may collect personal information from you in a variety of ways, including when you register on the site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The types of personal information collected may include:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, physical address, ID number.</li>
            <li><strong>Financial Information:</strong> Credit/debit card details, mobile money information (e.g., M-Pesa phone number). Payment information is processed securely by our third-party payment gateways and not stored on our servers.</li>
            <li><strong>Transactional Information:</strong> Details about products you purchase, order history, shipping details.</li>
            <li><strong>Technical Data:</strong> IP address, browser type and version, location data, time zone setting, operating system, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
            <li><strong>Marketing and Communications Data:</strong> Your preferences for receiving marketing from us and your communication preferences.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. How We Use Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul className="list-disc pl-5">
            <li>Create and manage your account.</li>
            <li>Process your transactions and deliver the products and services you request.</li>
            <li>Email you regarding your account or order.</li>
            <li>Send you a newsletter or other marketing materials, from which you can opt-out at any time.</li>
            <li>Request feedback and contact you about your use of the Site.</li>
            <li>Improve our website and offerings to enhance your user experience.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            <li>Comply with legal and regulatory requirements as per Kenyan law.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. Disclosure of Your Information</h2>
          <p>
            We do not sell, trade, or rent your personally identifiable information to others. We may share information we have collected about you in certain situations:
          </p>
          <ul className="list-disc pl-5">
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing (e.g., DPO Group, Pesapal), data analysis, email delivery, hosting services, and customer service.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. Data Security & Retention</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Your Data Protection Rights under the Kenyan DPA</h2>
          <p>
            As a data subject under the Data Protection Act, 2019, you have the following rights:
          </p>
          <ul className="list-disc pl-5">
            <li>The right to be informed of the use to which your personal data is to be put.</li>
            <li>The right to access your personal data in our custody.</li>
            <li>The right to object to the processing of all or part of your personal data.</li>
            <li>The right to the correction of false or misleading data.</li>
            <li>The right to the deletion of false or misleading data about you.</li>
          </ul>
          <p>If you wish to exercise any of these rights, please contact us using the contact information provided below. We may need to verify your identity before processing your request.</p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Policy for Children</h2>
          <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at:
          </p>
          <p>
            Email: <a href="mailto:privacy@cremecollections.shop" className="text-primary hover:underline">privacy@cremecollections.shop</a><br />
            Address: Creme Collections, Attn: Data Protection Officer, Taveta Road, Nairobi, Kenya.
          </p>

          <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
            <p><strong>Disclaimer:</strong> This is a sample Privacy Policy. It is not a substitute for legal advice from a qualified professional. You should consult with a legal expert to ensure your policy is fully compliant with all applicable laws, including the Kenyan Data Protection Act.</p>
          </div>
          
          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
