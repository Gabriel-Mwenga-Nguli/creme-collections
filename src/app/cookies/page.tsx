
"use client";
import { useState, useEffect } from 'react';

export default function CookiesPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Cookie Policy - Creme Collections';
    setLastUpdatedDate(new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Cookie Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="text-muted-foreground">
            This Cookie Policy explains how Creme Collections ("Company", "we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          <p className="lead text-sm">
            In some cases, we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, Creme Collections) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Why do we use cookies?</h2>
          <p>We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.</p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Types of Cookies We Use</h2>
          <ul className="list-disc pl-5">
            <li>
                <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our Website and to enable you to use some of its features, such as access to secure areas.
            </li>
            <li>
                <strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your login details or items in your shopping cart) may become unavailable.
            </li>
            <li>
                <strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
            </li>
            <li>
                <strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">How can I control cookies?</h2>
          <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser. Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version.</p>
          <p>Please note that if you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Where can I get further information?</h2>
          <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@cremecollections.shop" className="text-primary hover:underline">privacy@cremecollections.shop</a>.</p>

          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
