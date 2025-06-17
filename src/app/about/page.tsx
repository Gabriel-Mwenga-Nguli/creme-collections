
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us - Creme Collections',
  description: 'Learn more about Creme Collections, our mission, vision, and values.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8 font-headline">About Creme Collections</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
          <p className="lead">
            Welcome to Creme Collections, your premier destination for finding unique and high-quality products. We are passionate about connecting customers with exceptional items that enhance their lifestyle.
          </p>

          <div className="my-12 rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/800x400.png" 
              alt="Our Team or Company Vision" 
              width={800} 
              height={400} 
              className="w-full object-cover"
              data-ai-hint="team collaboration" 
            />
          </div>

          <h2 className="text-2xl font-semibold text-foreground font-headline mt-12 mb-4">Our Mission</h2>
          <p>
            Our mission is to provide a seamless and enjoyable shopping experience, offering a curated selection of products that meet our high standards of quality, innovation, and style. We strive to build a community of satisfied customers who trust us for their shopping needs.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline mt-8 mb-4">Our Vision</h2>
          <p>
            We envision Creme Collections as a leading e-commerce platform recognized for its commitment to customer satisfaction, ethical business practices, and a diverse range of inspiring products. We aim to continuously adapt and innovate to meet the evolving needs of our customers.
          </p>

          <h2 className="text-2xl font-semibold text-foreground font-headline mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Customer Focus:</strong> We put our customers at the heart of everything we do.</li>
            <li><strong>Quality:</strong> We are committed to offering products that are built to last and perform.</li>
            <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
            <li><strong>Innovation:</strong> We embrace new ideas and technologies to improve our services.</li>
            <li><strong>Community:</strong> We believe in giving back and fostering positive relationships.</li>
          </ul>

          <p className="mt-8">
            Thank you for choosing Creme Collections. We look forward to serving you!
          </p>
        </div>
      </div>
    </div>
  );
}
