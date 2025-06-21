
import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Creme Collections',
  description: 'Find answers to common questions about shopping with Creme Collections.',
};

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'To place an order, simply browse our products, add your desired items to the cart, and proceed to checkout. Follow the on-screen instructions to enter your shipping and payment information.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept various payment methods, including major credit cards (Visa, MasterCard, American Express), PayPal, and mobile money options where available. All transactions are secure and encrypted.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number on our website or the courier\'s website to track the status of your delivery.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 14-day return policy for most items in new and unused condition. Please visit our Shipping & Returns page for detailed information on our return process and eligibility.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'You can contact our customer support team via email at support@cremecollections.shop, by phone at +254 742 468070, or through our live chat support on the website during business hours. Visit our Contact Us page for more details.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently, we primarily ship within Kenya. For international shipping inquiries, please contact our customer support to see if arrangements can be made for your specific location.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'You can create an account by clicking the "Register" button on our website. Fill in the required details, and you\'ll be all set to enjoy a personalized shopping experience, order tracking, and more.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-primary font-headline">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We're here to help. Find answers to common inquiries below.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="bg-card rounded-lg shadow-sm p-2">
              <AccordionTrigger className="text-left font-medium text-lg hover:no-underline px-4 py-3">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
            <p className="text-muted-foreground">
                Can't find the answer you're looking for?
            </p>
            <a href="/contact" className="text-primary hover:underline font-medium">
                Contact our support team
            </a>
        </div>
      </div>
    </div>
  );
}
