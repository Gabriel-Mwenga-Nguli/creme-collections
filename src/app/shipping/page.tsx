
"use client";
import type { Metadata } from 'next';
import { Package, Undo } from 'lucide-react';
import { useState, useEffect } from 'react';

// export const metadata: Metadata = { // Cannot be used in client components this way
//   title: 'Shipping & Returns - Creme Lite',
//   description: 'Learn about Creme Lite\'s shipping policies, delivery times, and returns process.',
// };

export default function ShippingReturnsPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Shipping & Returns - Creme Lite';
    setLastUpdatedDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Package className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">Shipping & Returns</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Information about how we get your products to you and our returns process.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground font-headline !mb-4 flex items-center">
              <Package className="mr-3 h-6 w-6 text-primary" /> Shipping Policy
            </h2>
            <p>
              We are committed to delivering your order accurately, in good condition, and always on time.
              Please note our shipping policy as follows:
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Processing Time</h3>
            <p>
              Orders are typically processed within 1-2 business days (excluding weekends and holidays)
              after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Shipping Rates & Delivery Estimates</h3>
            <p>
              Shipping charges for your order will be calculated and displayed at checkout. Delivery times vary depending on your location within Kenya:
            </p>
            <ul className="list-disc pl-5">
              <li><strong>Nairobi & Environs:</strong> 1-2 business days.</li>
              <li><strong>Other Major Towns:</strong> 2-4 business days.</li>
              <li><strong>Remote Areas:</strong> 3-5 business days.</li>
            </ul>
            <p>Delivery delays can occasionally occur due to unforeseen circumstances.</p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Shipment Confirmation & Order Tracking</h3>
            <p>
              You will receive a shipment confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within 24 hours.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Damages</h3>
            <p>
              Creme Lite is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier or our support team directly to file a claim. Please save all packaging material and damaged goods before filing a claim.
            </p>
          </section>

          <hr className="my-10" />

          <section>
            <h2 className="text-2xl font-semibold text-foreground font-headline !mb-4 flex items-center">
              <Undo className="mr-3 h-6 w-6 text-primary" /> Returns & Exchanges Policy
            </h2>
            <p>
              We want you to be completely satisfied with your purchase. If you are not, you can return most items for a refund or exchange within 14 days of delivery.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Return Window</h3>
            <p>You have 14 calendar days from the date of delivery to initiate a return.</p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Eligibility</h3>
            <p>To be eligible for a return, your item must be:</p>
            <ul className="list-disc pl-5">
              <li>Unused and in the same condition that you received it.</li>
              <li>In its original packaging with all tags and accessories.</li>
              <li>Accompanied by a proof of purchase (order number or receipt).</li>
            </ul>
            <p>Certain items like perishables, intimate apparel, or custom-made products may not be eligible for return. Please check the product page for specific return information.</p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Return Process</h3>
            <p>
              To initiate a return, please contact our customer support team with your order number and reason for return. We will provide you with instructions on how to send back your item. Customers are typically responsible for return shipping costs unless the item was received damaged or incorrect.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Refunds</h3>
            <p>
              Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Exchanges</h3>
            <p>
              If you need to exchange an item for a different size or color, please contact us. Exchanges are subject to product availability.
            </p>
            <h3 className="text-xl font-semibold text-foreground font-headline !mt-6 !mb-2">Contact Us</h3>
            <p>
              If you have any questions about our Shipping & Returns Policy, please contact us at <a href="mailto:support@cremelite.com" className="text-primary hover:underline">support@cremelite.com</a>.
            </p>
          </section>
          {lastUpdatedDate && (
            <p className="text-sm text-muted-foreground pt-6">Last updated: {lastUpdatedDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}
