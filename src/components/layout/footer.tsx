
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo'; 
import { MapPin, Mail, MessageSquare, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube, Power } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900 text-slate-200 shadow-inner">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Logo, Location & Social */}
          <div className="lg:col-span-1 lg:border-r lg:border-slate-700 lg:pr-8 space-y-6">
            <div>
              <Logo />
              <p className="mt-4 text-sm text-slate-400">
                All you want, all in one place. Shop smarter with Creme Collections — Kenya's most trusted online marketplace.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> Shop Location
              </h3>
              <address className="text-sm text-slate-400 not-italic">
                Kenya<br />
                Taveta Rd, Nairobi.
              </address>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase mb-3">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-slate-400 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/company/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-400 hover:text-primary transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Shop & Company Links */}
          <div className="lg:col-span-1 lg:border-r lg:border-slate-700 lg:px-8 space-y-8 md:space-y-10">
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
          </div>
          
          {/* Column 3: Support Links & Contact Details */}
          <div className="lg:col-span-1 lg:border-r lg:border-slate-700 lg:px-8">
             <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Support</h3>
              <ul role="list" className="mt-4 space-y-2">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors"
                    >
                      {link.icon && <link.icon className="inline h-4 w-4 mr-1.5 -mt-0.5" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-700/30 space-y-3">
                  <div className="flex items-center text-sm text-slate-300">
                    <Mail className="w-4 h-4 mr-2.5 text-primary shrink-0" />
                    <div className="flex flex-col">
                        <a href="mailto:support@cremecollections.shop" className="hover:text-primary transition-colors">support@cremecollections.shop</a>
                        <a href="mailto:creme.collectionlt@gmail.com" className="hover:text-primary transition-colors">creme.collectionlt@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <MessageSquare className="w-4 h-4 mr-2.5 text-primary shrink-0" />
                    <div className="flex flex-col">
                        <a href="https://wa.me/254742468070" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+254 742 468070</a>
                        <a href="https://wa.me/254743117211" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+254 743 117211</a>
                        <a href="https://wa.me/254717988700" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+254 717 988700</a>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-slate-300">
                      <Clock className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                      <div>
                          <span>Mon – Fri: 9am – 5pm EAT</span><br/>
                          <span>Saturday: 9am – 12pm EAT</span><br/>
                          <span className="text-slate-400">Sun & Holidays: Closed</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Column 4: Map */}
          <div className="lg:col-span-1 lg:pl-8">
             <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> Our Store
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
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center">
            <Power className="w-3 h-3 mr-1" /> Powered by Google Cloud
          </p>
        </div>
      </div>
    </footer>
  );
}
