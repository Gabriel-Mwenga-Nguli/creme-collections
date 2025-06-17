import Link from 'next/link';
import { SITE_NAME, FOOTER_LINKS } from '@/lib/constants';
import Logo from '@/components/logo'; // Re-using Logo for consistency

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background shadow-inner">
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Your favorite products, delivered with care.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Shop</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
                <li><Link href="/#promotions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Promotions</Link></li>
                <li><Link href="/#new-arrivals" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
              <ul role="list" className="mt-4 space-y-2">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                 <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Support</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="/chat-support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Chat Support</Link></li>
                <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
