
"use client";
import { useState, useEffect } from 'react';

export default function LegalNoticePage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Legal Notice - Creme Collections';
    setLastUpdatedDate(new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">Legal Notice (Impressum)</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-6">
          <p className="lead">
            This legal notice provides information about the provider of this website in accordance with legal requirements.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Provider Information</h2>
          <p>
            Creme Collections<br />
            Taveta Road<br />
            Nairobi, Kenya
          </p>
          <p>
            <strong>Represented by:</strong><br />
            [Your Name/Company's Legal Representative Name]
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Contact Information</h2>
          <p>
            <strong>Telephone:</strong> <a href="tel:+254742468070" className="text-primary hover:underline">+254 742 468070</a><br />
            <strong>Email:</strong> <a href="mailto:legal@cremecollections.shop" className="text-primary hover:underline">legal@cremecollections.shop</a>
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Company Registration</h2>
          <p>
            <strong>Business Registration Number:</strong> [Your Business Registration Number]<br />
            <strong>Kenya Revenue Authority (KRA) PIN:</strong> [Your KRA PIN]
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Disclaimer of Liability</h2>
          <p>
            <strong>Accountability for content:</strong><br />
            The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness, or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.
          </p>
          <p>
            <strong>Accountability for links:</strong><br />
            Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of the linked pages. No violations were evident to us at the time of linking. Should any legal infringement become known to us, we will remove the respective link immediately.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline pt-4">Copyright</h2>
          <p>
            Our web pages and their contents are subject to Kenyan copyright law. Unless expressly permitted by law, every form of utilizing, reproducing, or processing works subject to copyright protection on our web pages requires the prior consent of the respective owner of the rights. Individual reproductions of a work are onlyallowed for private use. The materials from these pages are copyrighted and any unauthorized use may violate copyright laws.
          </p>

          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
