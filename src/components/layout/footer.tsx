
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo'; 
import { MapPin } from 'lucide-react';

export default function Footer() {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Default to a generic location if API key is not set, or use a placeholder view
  const mapEmbedSrc = mapsApiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=Nairobi,Kenya`
    : `https://www.google.com/maps/embed/v1/view?zoom=12&center=-1.286389,36.817223`;


  return (
    <footer className="border-t border-slate-700 bg-slate-900 text-slate-200 shadow-inner">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-400">
              Your favorite products, delivered with care.
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Our Location</h3>
              <address className="mt-2 text-sm text-slate-400 not-italic">
                123 Creme Lite Street<br />
                Commerce City, NBO 00100<br />
                Kenya
              </address>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Shop</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="/products" className="text-sm text-slate-300 hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/#promotions" className="text-sm text-slate-300 hover:text-primary transition-colors">Promotions</Link></li>
                <li><Link href="/#new-arrivals" className="text-sm text-slate-300 hover:text-primary transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Company</h3>
              <ul role="list" className="mt-4 space-y-2">
                {FOOTER_COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Support</h3>
              <ul role="list" className="mt-4 space-y-2">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
             <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> Find Us
             </h3>
            {mapsApiKey ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-slate-700">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedSrc}
                  title="Shop Location Map"
                >
                </iframe>
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-slate-700 bg-slate-800 flex items-center justify-center">
                <p className="text-slate-400 text-sm px-4 text-center">Google Maps API key not configured. Map display is unavailable.</p>
              </div>
            )}
          </div>

        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-sm text-slate-400 text-center">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
