
import type { NavLink as BaseNavLink } from '@/lib/types';
import { 
  Smartphone, Shirt, Home as HomeIcon, Heart, ShoppingCart, User, Search, Percent, Info, MessageSquare, Phone, Sparkles, Zap, HelpCircle, Package, BookOpen, Users, ShieldCheck, Menu as MenuIcon, ShoppingBasket, VenetianMask,
  Bike, ToyBrick, Car, BookMarked, HeartPulse, Dumbbell, Tent, Gamepad2, PencilRuler, Stethoscope, Gavel, Store, Gift, ListOrdered, MapPin, Inbox, Bot, Settings, Baby, Cookie
} from 'lucide-react';
import { CATEGORY_LINKS_DATA } from './nav-data';

export const SITE_NAME = "Creme Collections";

export interface NavLink extends BaseNavLink {
  icon?: React.ElementType;
  subLinks?: NavLink[];
  isMegaMenuTrigger?: boolean;
}

// Links for the SECOND ROW of the header
export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '#', label: 'All Categories', icon: MenuIcon, isMegaMenuTrigger: true },
  { href: '/products/category/electronics', label: 'Electronics', icon: Smartphone },
  { href: '/products/category/fashion', label: 'Fashion', icon: Shirt },
  { href: '/loyverse-products', label: 'Loyverse Stock', icon: Package },
  { href: '/gift-card', label: 'Gift Cards', icon: Gift },
  { href: '/products', label: 'All Products', icon: ShoppingBasket },
];

const categoryIconMap: { [key: string]: React.ElementType } = {
  'Electronics': Smartphone,
  'Fashion': Shirt,
  'Home & Living': HomeIcon,
  'Beauty & Personal Care': VenetianMask, 
  'Sports & Outdoors': Bike,
  'Toys, Kids & Baby': ToyBrick,
  'Automotive': Car,
  'Books, Office & Stationery': BookMarked,
  'Health & Wellness': HeartPulse,
};

const subCategoryIconMap: { [key: string]: React.ElementType } = {
  'Exercise & Fitness': Dumbbell,
  'Camping & Hiking': Tent,
  'Toys & Games': Gamepad2,
  'Baby Care & Essentials': Baby,
  'Office Supplies': PencilRuler,
  'Medical Equipment': Stethoscope,
};

function addIcons(data: typeof CATEGORY_LINKS_DATA): NavLink[] {
    return data.map(category => ({
        ...category,
        icon: categoryIconMap[category.label],
        subLinks: category.subLinks?.map(subLink => ({
            ...subLink,
            icon: subCategoryIconMap[subLink.label]
        }))
    }));
}

// Categories for the Mega Menu content (triggered by "All Categories")
export const CATEGORY_NAV_LINKS: NavLink[] = addIcons(CATEGORY_LINKS_DATA);

export const PROFILE_NAV_LINKS: NavLink[] = [
  { href: "/profile", label: "Dashboard", icon: User },
  { href: "/profile/orders", label: "My Orders", icon: ListOrdered },
  { href: "/profile/address", label: "Address Book", icon: MapPin },
  { href: "/profile/inbox", label: "Inbox", icon: Inbox },
  { href: "/profile/support", label: "AI Support", icon: Bot },
  { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];


export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { href: "/about", label: "About Us", icon: Users },
  { href: "/sell-on-creme", label: "Sell on Creme Collections", icon: Store },
  { href: "/terms", label: "Terms & Conditions", icon: BookOpen },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  { href: "/legal", label: "Legal Notice", icon: Gavel },
];

export const FOOTER_SUPPORT_LINKS: NavLink[] = [
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/chat-support", label: "Chat Support", icon: MessageSquare },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/shipping", label: "Shipping & Returns", icon: Package },
];

export const LEGACY_HEADER_NAV_LINKS: NavLink[] = [
  { href: "/products", label: "Offers", icon: Percent }, // Note: Actual filtering not implemented
  { href: "/products", label: "New Arrivals", icon: Sparkles }, // Note: Actual filtering not implemented
  { href: "/#weekly-deals", label: "Flash Deals", icon: Zap },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/chat-support", label: "Support", icon: MessageSquare },
];

export function getAllCategorySlugs(navLinks: NavLink[]): string[][] {
  const slugs: string[][] = [];
  function generateSlugs(links: NavLink[], currentPath: string[] = []) {
    for (const link of links) {
      const pathParts = link.href.split('/').filter(p => p && p !== 'products' && p !== 'category');
      if (pathParts.length > 0) {
        slugs.push(pathParts);
      }
      if (link.subLinks) {
        generateSlugs(link.subLinks, currentPath.concat(pathParts));
      }
    }
  }
  generateSlugs(navLinks);
  return slugs;
}
