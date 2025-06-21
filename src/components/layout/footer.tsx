
import Link from 'next/link';
import { SITE_NAME, FOOTER_COMPANY_LINKS, FOOTER_SUPPORT_LINKS } from '@/lib/constants';
import Logo from '@/components/logo';
import { MapPin, Mail, MessageSquare, Clock, Facebook, Instagram, Landmark } from 'lucide-react';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1227"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6909H308.863L612.434 513.728L659.902 581.621L1076.01 1143.85H911.161L569.165 687.828Z"
      fill="currentColor"
    />
  </svg>
);

const MpesaIcon = () => (
    <svg role="img" viewBox="0 0 256 160" className="h-8 w-auto rounded" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#4CAF50" width="256" height="160" rx="20"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="sans-serif">M-PESA</text>
    </svg>
);
  
const VisaIcon = () => (
    <svg role="img" viewBox="0 0 77.37 25" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto">
        <path d="M62.94,25.06H72.3s.59-.28.34-.78L65.23,1.35C65,.76,64.21,0,62.65,0H49.82c-1.33,0-2.31.6-2.65,1.88L36.8,24.28c-.34.78.34,1.27.34,1.27h9.54s.59.09.83-.59l1.64-4.89h9.2l1.17,4.89c.25.68.83,1.08.83,1.08Z" fill="#1a1f71"/>
        <path d="M22.06.3h-9.54C11.45.3,11,.66,10,1.88L2.65,24.28c-.34.78.34,1.27.34,1.27h9.54s.59.09.83-.59l4.57-12.7L22.2,25c.25.68.83.59.83.59h8.3s.59-.09.34-.59L22.9,1.1c-.25-.8-.73-1.05-1.08-1.05Z" fill="#1a1f71"/>
        <path d="M77.37,1.1a1.2,1.2,0,0,0-1.25-.83H72.1c-.5,0-.83.25-1.08.75L65.5,14.6l-1.56-6.42c-.42-1.33-1.42-2-2.83-2H51.4L49.82,0H41.89s-1.08.25-.83,1.08l6.9,23.49c.34.59.92.75.92.75h9.2s1.17-.34.92-1.27L56.1,13.82,60.36,1.2zM28.7,14.07l-6.81,4.24L26.79,6.42,28.43.92A.51.51,0,0,1,29,.3h6.58c1.33,0,2.15.5,2.31,1.56L42,24.45c.16.59.58,1.1,1.33,1.1h.25c.59,0,1-.25,1.08-.5.59-1.17.34-10.79.34-10.79,0-5.74-3.32-8.4-7.56-8.4-2.23,0-4.32.76-5.83,2.05Z" fill="#f7b600"/>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Logo, Location, Social, & Payments */}
          <div className="space-y-6">
            <div>
              <Logo className="text-3xl" />
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                All you want, all in one place. Shop smarter with {SITE_NAME} — Kenya's most trusted online marketplace.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" /> Our Location
              </h3>
              <address className="text-sm text-slate-400 not-italic">
                Taveta Rd, Nairobi, Kenya.
              </address>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">Connect With Us</h3>
              <div className="flex space-x-5">
                {[
                  { href: "https://facebook.com/cremecollections", label: "Facebook", icon: Facebook },
                  { href: "https://instagram.com/cremecollections", label: "Instagram", icon: Instagram },
                  { href: "https://x.com/cremecollections", label: "X", icon: XIcon },
                ].map(social => (
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} key={social.label} className="text-slate-400 hover:text-primary transition-transform duration-200 hover:scale-110">
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4">We Accept</h3>
              <div className="flex flex-wrap items-center gap-2">
                <MpesaIcon />
                <VisaIcon />
                <MastercardIcon />
                <div className="flex items-center justify-center h-8 px-2 bg-gray-200 rounded text-gray-700" title="Direct Bank Transfer">
                  <Landmark className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Links (Combined for better flow on some screens) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
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
            <div>
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


          {/* Column 4: Map */}
          <div className="lg:col-span-1">
             <h3 className="text-base font-semibold text-slate-100 tracking-wider uppercase mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" /> Find Us
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
        </div>
      </div>
    </footer>
  );
}
