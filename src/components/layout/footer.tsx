
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo'; 
import { MapPin } from 'lucide-react';

export default function Footer() {
  // The user provided a direct iframe embed, so API key logic is not needed for this specific map.
  // const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Default to a generic location if API key is not set, or use a placeholder view
  // const mapEmbedSrc = mapsApiKey 
  //   ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=Nairobi,Kenya`
  //   : `https://www.google.com/maps/embed/v1/view?zoom=12&center=-1.286389,36.817223`;


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
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-slate-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176281179212!2d36.8256143!3d-1.283277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11bfdd229f0f%3A0x1bb6f341ce62e64e!2sCreme%20Collections!5e0!3m2!1sen!2ske!4v1750153131200!5m2!1sen!2ske" 
                width="100%" 
                height="100%" 
                style={{ border:0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Creme Collections Location Map"
              >
              </iframe>
            </div>
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
