
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const brands = [
  { name: "Brand Alpha", logo: "https://placehold.co/150x60/e2e8f0/a0aec0?text=Brand+Alpha", dataAiHint: "tech logo" },
  { name: "Brand Beta", logo: "https://placehold.co/150x60/fefcbf/e5e7eb?text=Brand+Beta", dataAiHint: "fashion logo" },
  { name: "Brand Gamma", logo: "https://placehold.co/150x60/dbeafe/93c5fd?text=Brand+Gamma", dataAiHint: "home logo" },
  { name: "Brand Delta", logo: "https://placehold.co/150x60/fee2e2/fca5a5?text=Brand+Delta", dataAiHint: "beauty logo" },
  { name: "Brand Epsilon", logo: "https://placehold.co/150x60/dcfce7/86efac?text=Brand+Epsilon", dataAiHint: "sports logo" },
  { name: "Brand Zeta", logo: "https://placehold.co/150x60/f3e8ff/d8b4fe?text=Brand+Zeta", dataAiHint: "kids logo" },
];

export default function BrandShowcase() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-foreground md:text-4xl font-headline mb-8 md:mb-12">
        Shop Your Favorite Brands
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {brands.map((brand) => (
          <Card key={brand.name} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 flex justify-center items-center aspect-[2.5/1] bg-card">
              <Image
                src={brand.logo}
                alt={`${brand.name} Logo`}
                width={120} 
                height={48} 
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={brand.dataAiHint}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

    