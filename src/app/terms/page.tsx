
"use client";
import type { Metadata } from 'next';
import { useState, useEffect } from 'react';

// export const metadata: Metadata = { // Cannot be used in client components this way
//   title: 'Terms & Conditions - Creme Collections',
//   description: 'Read the Terms and Conditions for using the Creme Collections website and services.',
// };

export default function TermsPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Terms & Conditions - Creme Collections';
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            Welcome to Creme Collections! These terms and conditions outline the rules and regulations for the use of Creme Collections's Website, located at https://cremelite.com (or your actual domain).
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Creme Collections if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">1. Definitions</h2>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company, Creme Collections. "Party", "Parties", or "Us", refers to both the Client and ourselves. 
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">2. Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Creme Collections, you agreed to use cookies in agreement with the Creme Collections's Privacy Policy. Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">3. License</h2>
          <p>
            Unless otherwise stated, Creme Collections and/or its licensors own the intellectual property rights for all material on Creme Collections. All intellectual property rights are reserved. You may access this from Creme Collections for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-5">
            <li>Republish material from Creme Collections</li>
            <li>Sell, rent or sub-license material from Creme Collections</li>
            <li>Reproduce, duplicate or copy material from Creme Collections</li>
            <li>Redistribute content from Creme Collections</li>
          </ul>
          <p>This Agreement shall begin on the date hereof.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">4. User Account</h2>
          <p>
            If you create an account on Creme Collections, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by You, including any damages of any kind incurred as a result of such acts or omissions.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">5. Product Information and Pricing</h2>
          <p>
            We strive to ensure that all details, descriptions, and prices which appear on this Website are accurate, however, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it. If we are unable to contact you we will treat the order as cancelled. If you cancel and you have already paid for the goods, you will receive a full refund.
          </p>
          <p>All prices are inclusive of VAT (where applicable) at the current rates and are correct at the time of entering the information onto the system. Shipping costs will be charged in addition; such additional charges are clearly displayed where applicable and included in the 'Total Cost'.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">6. Orders and Payment</h2>
          <p>
            All orders are subject to availability and confirmation of the order price. Dispatch times may vary according to availability and any guarantees or representations made as to delivery times are subject to any delays resulting from postal delays or force majeure for which we will not be responsible.
          </p>
          <p>
            In order to contract with Creme Collections you must be over 18 years of age and possess a valid credit or debit card issued by a bank acceptable to us, or a valid mobile money account. Creme Collections retains the right to refuse any request made by you.
          </p>


          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">7. Limitation of Liability</h2>
          <p>
            In no event shall Creme Collections, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Creme Collections, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">8. Indemnification</h2>
          <p>You hereby indemnify to the fullest extent Creme Collections from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">9. Severability</h2>
          <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">10. Governing Law & Jurisdiction</h2>
          <p>
            These Terms will be governed by and interpreted in accordance with the laws of Kenya, and you submit to the non-exclusive jurisdiction of the courts located in Kenya for the resolution of any disputes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">11. Changes to Terms</h2>
          <p>
            Creme Collections reserves the right to revise these terms and conditions at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.
          </p>
          
          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
