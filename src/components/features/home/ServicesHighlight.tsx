
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ShieldCheck, Headphones, Award, Package } from 'lucide-react';
import React from 'react';

const services = [
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Get your orders delivered swiftly across Kenya. We prioritize speed and care.",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Shop with confidence. Our payment gateways are safe and encrypted.",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our AI assistant and support team are here to help you with any queries.",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "Hassle-free returns and exchanges for your peace of mind.",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
];

export default function ServicesHighlight() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-12">
        Our Commitment to You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((service) => (
          <Card key={service.title} className={`text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ${service.bgColor}`}>
            <CardContent className="p-6 flex flex-col items-center">
              <div className={`p-3 rounded-full bg-white mb-4 shadow`}>
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>
              <CardTitle className="text-lg font-semibold text-foreground mb-1.5 font-headline">{service.title}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    