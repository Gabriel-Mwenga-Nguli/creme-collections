
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ShieldCheck, Headphones, Award, Package } from 'lucide-react';
import React from 'react';

const services = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Get your orders delivered swiftly across Kenya. We prioritize speed and care.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Shop with confidence. Our payment gateways are safe and encrypted.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our AI assistant and support team are here to help you with any queries.",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "Hassle-free returns and exchanges for your peace of mind.",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
];

export default function ServicesHighlight() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground md:text-5xl font-headline mb-10 md:mb-14">
        Our Commitment to You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {services.map((service, index) => (
          <Card 
            key={service.title} 
            className={`text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${service.bgColor} rounded-xl group hover:scale-105 hover:border-primary/50 border-2 border-transparent animate-in fade-in-0 slide-in-from-bottom-8`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 md:p-8 flex flex-col items-center">
              <div className={`p-4 rounded-full bg-card mb-5 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                <service.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${service.iconColor}`} />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground mb-2 font-headline">{service.title}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
