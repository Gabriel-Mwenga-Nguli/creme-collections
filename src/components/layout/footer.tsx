
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo';
import { MapPin, Mail, MessageSquare, Clock, Landmark } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true" {...props}>
      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <defs>
        <radialGradient id="insta-gradient" cx="0.3" cy="1.2" r="1.2">
          <stop offset="0" stopColor="#fdf497" />
          <stop offset="0.1" stopColor="#fdf497" />
          <stop offset="0.25" stopColor="#fd5949" />
          <stop offset="0.5" stopColor="#d6249f" />
          <stop offset="0.75" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path fill="url(#insta-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/>
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6909H308.863L612.434 513.728L659.902 581.621L1076.01 1143.85H911.161L569.165 687.828Z"
      className="fill-black dark:fill-white"
    />
  </svg>
);

const MpesaIcon = () => (
    <svg role="img" viewBox="0 0 256 160" className="h-8 w-auto rounded" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#4CAF50" width="256" height="160" rx="20"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="sans-serif">M-PESA</text>
    </svg>
);
  
const MastercardIcon = () => (
    <svg role="img" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
        <circle cx="12" cy="12" r="12" fill="#EA001B" />
        <circle cx="26" cy="12" r="12" fill="#FF5F00" opacity="0.9" />
    </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900 text-slate-200 shadow-inner">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">

          {/* Column 1: Logo, Location, Social, & Map */}
          <div className="space-y-6">
            <div>
              <Logo className="text-3xl" />
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                All you want, all in one place. Shop smarter with {SITE_NAME} — Kenya's most trusted online marketplace.
              </p>
            </div>
            <div>
                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817628119932!2d36.82303937521541!3d-1.2832769987045247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11bfdd229f0f%3A0x1bb6f341ce62e64e!2sCreme%20Collections!5e0!3m2!1sen!2ske!4v1750484155537!5m2!1sen!2ske" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Creme Collections Location"
                    ></iframe>
                </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Connect With Us</h3>
              <div className="flex space-x-5">
                <a href="https://facebook.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-all duration-200 hover:scale-110">
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a href="https://instagram.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-all duration-200 hover:scale-110">
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a href="https://x.com/cremecollections" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:opacity-80 transition-all duration-200 hover:scale-110">
                  <XIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
            
          </div>

          {/* Column 2: Shop & Support Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Shop</h3>
              <ul role="list" className="space-y-2.5">
                <li><Link href="/products" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">All Products</Link></li>
                <li><Link href="/#promotions-slider" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">Promotions</Link></li>
                <li><Link href="/#weekly-deals" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">Flash Deals</Link></li>
                <li><Link href="/products?filter=new" className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Support</h3>
              <ul role="list" className="space-y-2.5">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline flex items-center"
                    >
                      {link.icon && <link.icon className="inline h-4 w-4 mr-2 text-primary/70" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-2">
                 <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">We Accept</h3>
                <div className="flex flex-wrap items-center gap-2">
                    <MpesaIcon />
                    <MastercardIcon />
                    <div className="flex items-center justify-center h-8 px-2 bg-gray-200 rounded text-gray-700" title="Direct Bank Transfer">
                    <Landmark className="h-5 w-5" />
                    </div>
                </div>
            </div>
          </div>

          {/* Column 3: Company & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
             <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Company & Legal</h3>
              <ul role="list" className="space-y-2.5">
                {FOOTER_COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-primary transition-colors hover:underline flex items-center"
                    >
                      {link.icon && <link.icon className="inline h-4 w-4 mr-2 text-primary/70" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Contact Info</h3>
              <div className="space-y-3">
                  <div className="flex items-start text-sm text-slate-300">
                    <Mail className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <a href="mailto:support@cremecollections.shop" className="hover:text-primary transition-colors hover:underline">support@cremecollections.shop</a>
                        <a href="mailto:creme.collectionlt@gmail.com" className="hover:text-primary transition-colors hover:underline">creme.collectionlt@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-slate-300">
                    <MessageSquare className="w-4 h-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <a href="https://wa.me/254742468070" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 742 468070</a>
                        <a href="https://wa.me/254743117211" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 743 117211</a>
                        <a href="https://wa.me/254717988700" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">+254 717 988700</a>
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
          </div>

        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
