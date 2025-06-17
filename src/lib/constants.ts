
import type { NavLink as BaseNavLink } from '@/lib/types'; // Assuming NavLink type is in types.ts
import { Smartphone, Shirt, Home as HomeIcon, Tv, Laptop, Headphones, Heart, ShoppingCart, User, Search, Percent, Info, MessageSquare, Phone, Sparkles, Zap, HelpCircle, Package, BookOpen, Users, ShieldCheck } from 'lucide-react';

export const SITE_NAME = "Creme Lite";

export interface NavLink extends BaseNavLink {
  icon?: React.ElementType;
  subLinks?: NavLink[];
}

// Links for the bottom row of the header, next to categories
export const HEADER_NAV_LINKS: NavLink[] = [
  { href: "/products?filter=offers", label: "Offers", icon: Percent },
  { href: "/products?filter=new", label: "New Arrivals", icon: Sparkles },
  { href: "/#weekly-deals", label: "Flash Deals", icon: Zap },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/chat-support", label: "Support", icon: MessageSquare },
];

// Categories for the "Shop by Category" dropdown
export const CATEGORY_NAV_LINKS: NavLink[] = [
  {
    label: 'Electronics',
    href: '/products/category/electronics',
    icon: Smartphone,
    subLinks: [
      { label: 'Mobile Phones', href: '/products/category/electronics/mobiles', icon: Smartphone },
      { label: 'Laptops & Computers', href: '/products/category/electronics/laptops', icon: Laptop },
      { label: 'TVs & Audio', href: '/products/category/electronics/tvs-audio', icon: Tv },
      { label: 'Cameras & Drones', href: '/products/category/electronics/cameras' },
      { label: 'Gaming Consoles', href: '/products/category/electronics/gaming' },
      { label: 'Headphones & Earbuds', href: '/products/category/electronics/headphones', icon: Headphones },
      { label: 'Wearable Technology', href: '/products/category/electronics/wearables' },
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
      { label: 'Accessories', href: '/products/category/fashion/accessories' },
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
      { label: 'Bedding & Bath', href: '/products/category/home-living/bedding-bath' },
      { label: 'Home Appliances', href: '/products/category/home-living/appliances' },
    ],
  },
  {
    label: 'Beauty & Personal Care',
    href: '/products/category/beauty-personal-care',
    icon: Heart, 
    subLinks: [
      { label: 'Skincare', href: '/products/category/beauty/skincare' },
      { label: 'Makeup', href: '/products/category/beauty/makeup' },
      { label: 'Hair Care', href: '/products/category/beauty/haircare' },
      { label: 'Fragrances', href: '/products/category/beauty/fragrances' },
    ],
  },
  {
    label: 'Sports & Outdoors',
    href: '/products/category/sports-outdoors',
    // icon: Dumbbell, // Example, ensure icon exists
    subLinks: [
      { label: 'Fitness Equipment', href: '/products/category/sports/fitness' },
      { label: 'Outdoor Gear', href: '/products/category/sports/outdoor' },
      { label: 'Sportswear', href: '/products/category/sports/sportswear' },
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


export const LEGACY_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/search-page", label: "Search Page Link", icon: Search }, 
];
