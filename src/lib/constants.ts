
import type { NavLink as BaseNavLink } from '@/lib/types';
import { Smartphone, Shirt, Home as HomeIcon, Tv, Laptop, Headphones, Heart, ShoppingCart, User, Search, Percent, Info, MessageSquare, Phone, Sparkles, Zap, HelpCircle, Package, BookOpen, Users, ShieldCheck, Menu as MenuIcon, ShoppingBasket, Apple, Leaf, Beaker, Baby, Sprout, VenetianMask } from 'lucide-react';

export const SITE_NAME = "Creme Lite";

export interface NavLink extends BaseNavLink {
  icon?: React.ElementType;
  subLinks?: NavLink[];
  isMegaMenuTrigger?: boolean;
}

// Links for the SECOND ROW of the header (mimicking Carrefour's blue bar)
export const MAIN_NAV_LINKS: NavLink[] = [
  { href: '#', label: 'All Categories', icon: MenuIcon, isMegaMenuTrigger: true },
  { href: '/products/category/food-cupboard', label: 'Food Cupboard', icon: ShoppingBasket },
  { href: '/products/category/fresh-food', label: 'Fresh Food', icon: Apple },
  { href: '/products/category/fruits-vegetables', label: 'Fruits & Vegetables', icon: Leaf },
  { href: '/products/category/beverages', label: 'Beverages', icon: Beaker },
  { href: '/products/category/cleaning-household', label: 'Cleaning & Household', icon: HomeIcon },
  { href: '/products/category/baby-products', label: 'Baby Products', icon: Baby },
  { href: '/products/category/bio-organic', label: 'Bio & Organic', icon: Sprout },
  { href: '/products/category/beauty-personal-care', label: 'Beauty & Personal Care', icon: VenetianMask },
];


// Categories for the Mega Menu content (triggered by "All Categories")
export const CATEGORY_NAV_LINKS: NavLink[] = [
  {
    label: 'Electronics',
    href: '/products/category/electronics',
    icon: Smartphone,
    subLinks: [
      { label: 'Mobile Phones', href: '/products/category/electronics/mobiles' },
      { label: 'Laptops & Computers', href: '/products/category/electronics/laptops' },
      { label: 'TVs & Audio', href: '/products/category/electronics/tvs-audio' },
      { label: 'Cameras & Drones', href: '/products/category/electronics/cameras' },
      { label: 'Gaming Consoles', href: '/products/category/electronics/gaming' },
      { label: 'Headphones & Earbuds', href: '/products/category/electronics/headphones' },
      { label: 'Wearable Technology', href: '/products/category/electronics/wearables' },
      { label: 'Small Appliances', href: '/products/category/electronics/small-appliances' },
      { label: 'Large Appliances', href: '/products/category/electronics/large-appliances' },
      { label: 'Accessories', href: '/products/category/electronics/accessories' },
    ],
  },
  {
    label: 'Fashion',
    href: '/products/category/fashion',
    icon: Shirt,
    subLinks: [
      { label: 'Men\'s Clothing', href: '/products/category/fashion/men-clothing' },
      { label: 'Women\'s Clothing', href: '/products/category/fashion/women-clothing' },
      { label: 'Kid\'s Fashion', href: '/products/category/fashion/kids' },
      { label: 'Shoes & Footwear', href: '/products/category/fashion/footwear' },
      { label: 'Accessories (Bags, Wallets)', href: '/products/category/fashion/accessories' },
      { label: 'Jewelry & Watches', href: '/products/category/fashion/jewelry-watches' },
      { label: 'Sportswear', href: '/products/category/fashion/sportswear' },
    ],
  },
  {
    label: 'Home & Living',
    href: '/products/category/home-living',
    icon: HomeIcon,
    subLinks: [
      { label: 'Furniture', href: '/products/category/home-living/furniture' },
      { label: 'Home Decor', href: '/products/category/home-living/decor' },
      { label: 'Kitchen & Dining', href: '/products/category/home-living/kitchen' },
      { label: 'Bedding', href: '/products/category/home-living/bedding' },
      { label: 'Bath', href: '/products/category/home-living/bath' },
      { label: 'Storage & Organization', href: '/products/category/home-living/storage' },
      { label: 'Lighting', href: '/products/category/home-living/lighting' },
      { label: 'Home Improvement', href: '/products/category/home-living/improvement' },
    ],
  },
  {
    label: 'Beauty & Personal Care',
    href: '/products/category/beauty-personal-care',
    icon: Heart, 
    subLinks: [
      { label: 'Skincare', href: '/products/category/beauty-personal-care/skincare' },
      { label: 'Makeup', href: '/products/category/beauty-personal-care/makeup' },
      { label: 'Hair Care', href: '/products/category/beauty-personal-care/haircare' },
      { label: 'Fragrances', href: '/products/category/beauty-personal-care/fragrances' },
      { label: 'Personal Care Appliances', href: '/products/category/beauty-personal-care/appliances' },
      { label: 'Men\'s Grooming', href: '/products/category/beauty-personal-care/mens-grooming' },
    ],
  },
   {
    label: 'Food Cupboard',
    href: '/products/category/food-cupboard',
    icon: ShoppingBasket,
    subLinks: [
      { label: 'Grains & Rice', href: '/products/category/food-cupboard/grains-rice' },
      { label: 'Pasta & Noodles', href: '/products/category/food-cupboard/pasta-noodles' },
      { label: 'Cooking Oils', href: '/products/category/food-cupboard/cooking-oils' },
      { label: 'Spices & Seasoning', href: '/products/category/food-cupboard/spices-seasoning' },
      { label: 'Canned Goods', href: '/products/category/food-cupboard/canned-goods' },
      { label: 'Breakfast Foods', href: '/products/category/food-cupboard/breakfast-foods' },
      { label: 'Snacks', href: '/products/category/food-cupboard/snacks' },
    ],
  },
  {
    label: 'Cleaning & Household',
    href: '/products/category/cleaning-household',
    icon: HomeIcon, // Re-using HomeIcon, consider a more specific one if available
    subLinks: [
      { label: 'Laundry Detergents', href: '/products/category/cleaning-household/laundry' },
      { label: 'Dishwashing Supplies', href: '/products/category/cleaning-household/dishwashing' },
      { label: 'Surface Cleaners', href: '/products/category/cleaning-household/surface-cleaners' },
      { label: 'Air Fresheners', href: '/products/category/cleaning-household/air-fresheners' },
      { label: 'Pest Control', href: '/products/category/cleaning-household/pest-control' },
      { label: 'Paper Products (Tissues, Rolls)', href: '/products/category/cleaning-household/paper-products' },
    ],
  },
];


export const FOOTER_COMPANY_LINKS: NavLink[] = [
  { href: "/about", label: "About Us", icon: Users },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/terms", label: "Terms & Conditions", icon: BookOpen },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
];

export const FOOTER_SUPPORT_LINKS: NavLink[] = [
  { href: "/chat-support", label: "Chat Support", icon: MessageSquare },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/shipping", label: "Shipping & Returns", icon: Package },
];

// Original header nav links (for reference or other uses, e.g. mobile slideout if different)
export const LEGACY_HEADER_NAV_LINKS: NavLink[] = [
  { href: "/products?filter=offers", label: "Offers", icon: Percent },
  { href: "/products?filter=new", label: "New Arrivals", icon: Sparkles },
  { href: "/#weekly-deals", label: "Flash Deals", icon: Zap },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/chat-support", label: "Support", icon: MessageSquare },
];
