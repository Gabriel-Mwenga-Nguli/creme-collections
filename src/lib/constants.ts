
import type { NavLink as BaseNavLink } from '@/lib/types';
import { 
  Smartphone, Shirt, Home as HomeIcon, Tv, Laptop, Headphones, Heart, ShoppingCart, User, Search, Percent, Info, MessageSquare, Phone, Sparkles, Zap, HelpCircle, Package, BookOpen, Users, ShieldCheck, Menu as MenuIcon, ShoppingBasket, Apple, Leaf, Beaker, Baby, Sprout, VenetianMask,
  Bike, ToyBrick, Car, BookMarked, HeartPulse, Dumbbell, Tent, Gamepad2, PencilRuler, Stethoscope, Popcorn, Coffee
} from 'lucide-react';

export const SITE_NAME = "Creme Lite";

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
  { href: '/products/category/home-living', label: 'Home & Living', icon: HomeIcon },
  { href: '/products/category/food-groceries', label: 'Food & Groceries', icon: ShoppingBasket },
  { href: '/products/category/beauty-personal-care', label: 'Beauty & Care', icon: VenetianMask },
  { href: '/products/category/sports-outdoors', label: 'Sports', icon: Bike },
  { href: '/products/category/toys-kids-baby', label: 'Toys & Baby', icon: ToyBrick },
  { href: '/products?filter=offers', label: 'Offers', icon: Percent },
];


// Categories for the Mega Menu content (triggered by "All Categories")
export const CATEGORY_NAV_LINKS: NavLink[] = [
  {
    label: 'Electronics',
    href: '/products/category/electronics',
    icon: Smartphone,
    subLinks: [
      { label: 'Mobile Phones & Accessories', href: '/products/category/electronics/mobiles-accessories' },
      { label: 'Laptops & Computers', href: '/products/category/electronics/laptops-computers' },
      { label: 'TVs & Home Theater', href: '/products/category/electronics/tvs-home-theater' },
      { label: 'Audio & Headphones', href: '/products/category/electronics/audio-headphones' },
      { label: 'Cameras & Drones', href: '/products/category/electronics/cameras-drones' },
      { label: 'Gaming Consoles & Accessories', href: '/products/category/electronics/gaming' },
      { label: 'Wearable Technology', href: '/products/category/electronics/wearables' },
      { label: 'Printers & Scanners', href: '/products/category/electronics/printers-scanners' },
      { label: 'Home Appliances (Small)', href: '/products/category/electronics/small-appliances' },
      { label: 'Home Appliances (Large)', href: '/products/category/electronics/large-appliances' },
      { label: 'Data Storage', href: '/products/category/electronics/data-storage' },
      { label: 'Networking Devices', href: '/products/category/electronics/networking' },
    ],
  },
  {
    label: 'Fashion',
    href: '/products/category/fashion',
    icon: Shirt,
    subLinks: [
      { label: 'Men\'s Clothing', href: '/products/category/fashion/men-clothing' },
      { label: 'Women\'s Clothing', href: '/products/category/fashion/women-clothing' },
      { label: 'Kid\'s Fashion', href: '/products/category/fashion/kids-fashion' },
      { label: 'Men\'s Shoes', href: '/products/category/fashion/men-shoes' },
      { label: 'Women\'s Shoes', href: '/products/category/fashion/women-shoes' },
      { label: 'Kid\'s Shoes', href: '/products/category/fashion/kids-shoes' },
      { label: 'Bags & Luggage', href: '/products/category/fashion/bags-luggage' },
      { label: 'Watches', href: '/products/category/fashion/watches' },
      { label: 'Jewelry', href: '/products/category/fashion/jewelry' },
      { label: 'Eyewear', href: '/products/category/fashion/eyewear' },
      { label: 'Traditional Wear', href: '/products/category/fashion/traditional-wear' },
      { label: 'Sportswear & Activewear', href: '/products/category/fashion/sportswear' },
    ],
  },
  {
    label: 'Home & Living',
    href: '/products/category/home-living',
    icon: HomeIcon,
    subLinks: [
      { label: 'Furniture', href: '/products/category/home-living/furniture' },
      { label: 'Home Decor', href: '/products/category/home-living/decor' },
      { label: 'Kitchen & Dining', href: '/products/category/home-living/kitchen-dining' },
      { label: 'Bedding', href: '/products/category/home-living/bedding' },
      { label: 'Bath', href: '/products/category/home-living/bath' },
      { label: 'Storage & Organization', href: '/products/category/home-living/storage-organization' },
      { label: 'Lighting', href: '/products/category/home-living/lighting' },
      { label: 'Home Improvement & Tools', href: '/products/category/home-living/improvement-tools' },
      { label: 'Gardening & Outdoor', href: '/products/category/home-living/gardening-outdoor' },
      { label: 'Rugs & Carpets', href: '/products/category/home-living/rugs-carpets' },
    ],
  },
  {
    label: 'Beauty & Personal Care',
    href: '/products/category/beauty-personal-care',
    icon: VenetianMask, 
    subLinks: [
      { label: 'Skincare', href: '/products/category/beauty-personal-care/skincare' },
      { label: 'Makeup', href: '/products/category/beauty-personal-care/makeup' },
      { label: 'Hair Care', href: '/products/category/beauty-personal-care/haircare' },
      { label: 'Fragrances', href: '/products/category/beauty-personal-care/fragrances' },
      { label: 'Personal Care Appliances', href: '/products/category/beauty-personal-care/appliances' },
      { label: 'Men\'s Grooming', href: '/products/category/beauty-personal-care/mens-grooming' },
      { label: 'Oral Care', href: '/products/category/beauty-personal-care/oral-care' },
      { label: 'Feminine Hygiene', href: '/products/category/beauty-personal-care/feminine-hygiene' },
    ],
  },
  {
    label: 'Food & Groceries',
    href: '/products/category/food-groceries',
    icon: ShoppingBasket,
    subLinks: [
      { label: 'Food Cupboard', href: '/products/category/food-groceries/food-cupboard', subLinks: [
        { label: 'Grains & Rice', href: '/products/category/food-groceries/food-cupboard/grains-rice' },
        { label: 'Pasta & Noodles', href: '/products/category/food-groceries/food-cupboard/pasta-noodles' },
        { label: 'Cooking Oils', href: '/products/category/food-groceries/food-cupboard/cooking-oils' },
        { label: 'Spices & Seasoning', href: '/products/category/food-groceries/food-cupboard/spices-seasoning' },
        { label: 'Canned Goods', href: '/products/category/food-groceries/food-cupboard/canned-goods' },
        { label: 'Baking Supplies', href: '/products/category/food-groceries/food-cupboard/baking-supplies' },
      ]},
      { label: 'Fresh Food', href: '/products/category/food-groceries/fresh-food', subLinks: [
        { label: 'Meat & Poultry', href: '/products/category/food-groceries/fresh-food/meat-poultry' },
        { label: 'Seafood', href: '/products/category/food-groceries/fresh-food/seafood' },
        { label: 'Dairy & Eggs', href: '/products/category/food-groceries/fresh-food/dairy-eggs' },
        { label: 'Bakery', href: '/products/category/food-groceries/fresh-food/bakery' },
      ]},
      { label: 'Fruits & Vegetables', href: '/products/category/food-groceries/fruits-vegetables', icon: Leaf },
      { label: 'Beverages', href: '/products/category/food-groceries/beverages', icon: Coffee, subLinks: [
        { label: 'Coffee & Tea', href: '/products/category/food-groceries/beverages/coffee-tea' },
        { label: 'Juices', href: '/products/category/food-groceries/beverages/juices' },
        { label: 'Soft Drinks', href: '/products/category/food-groceries/beverages/soft-drinks' },
        { label: 'Water', href: '/products/category/food-groceries/beverages/water' },
      ]},
      { label: 'Snacks & Confectionery', href: '/products/category/food-groceries/snacks-confectionery', icon: Popcorn },
      { label: 'Breakfast Foods', href: '/products/category/food-groceries/breakfast-foods' },
      { label: 'Organic & Health Foods', href: '/products/category/food-groceries/bio-organic', icon: Sprout },
      { label: 'Frozen Foods', href: '/products/category/food-groceries/frozen-foods' },
    ],
  },
  {
    label: 'Cleaning & Household',
    href: '/products/category/cleaning-household',
    icon: HomeIcon, // Re-using HomeIcon
    subLinks: [
      { label: 'Laundry Supplies', href: '/products/category/cleaning-household/laundry' },
      { label: 'Dishwashing Supplies', href: '/products/category/cleaning-household/dishwashing' },
      { label: 'Household Cleaners', href: '/products/category/cleaning-household/household-cleaners' },
      { label: 'Air Fresheners', href: '/products/category/cleaning-household/air-fresheners' },
      { label: 'Pest Control', href: '/products/category/cleaning-household/pest-control' },
      { label: 'Paper Products & Disposables', href: '/products/category/cleaning-household/paper-disposables' },
      { label: 'Cleaning Tools', href: '/products/category/cleaning-household/cleaning-tools' },
    ],
  },
  {
    label: 'Sports & Outdoors',
    href: '/products/category/sports-outdoors',
    icon: Bike,
    subLinks: [
      { label: 'Exercise & Fitness', href: '/products/category/sports-outdoors/exercise-fitness', icon: Dumbbell },
      { label: 'Cycling', href: '/products/category/sports-outdoors/cycling' },
      { label: 'Camping & Hiking', href: '/products/category/sports-outdoors/camping-hiking', icon: Tent },
      { label: 'Team Sports Gear', href: '/products/category/sports-outdoors/team-sports' },
      { label: 'Outdoor Recreation', href: '/products/category/sports-outdoors/outdoor-recreation' },
      { label: 'Sportswear', href: '/products/category/sports-outdoors/sportswear' }, // Link to fashion or specific sportswear
      { label: 'Water Sports', href: '/products/category/sports-outdoors/water-sports' },
      { label: 'Fitness Trackers', href: '/products/category/sports-outdoors/fitness-trackers' }, // Link to electronics/wearables
    ],
  },
  {
    label: 'Toys, Kids & Baby',
    href: '/products/category/toys-kids-baby',
    icon: ToyBrick,
    subLinks: [
      { label: 'Toys & Games', href: '/products/category/toys-kids-baby/toys-games', icon: Gamepad2 },
      { label: 'Baby Care & Essentials', href: '/products/category/toys-kids-baby/baby-care', icon: Baby },
      { label: 'Baby Gear (Strollers, Carriers)', href: '/products/category/toys-kids-baby/baby-gear' },
      { label: 'Nursery Furniture & Decor', href: '/products/category/toys-kids-baby/nursery' },
      { label: 'Kids\' Books', href: '/products/category/toys-kids-baby/kids-books' }, // Link to books
      { label: 'School Supplies for Kids', href: '/products/category/toys-kids-baby/school-supplies' }, // Link to stationery
    ],
  },
  {
    label: 'Automotive',
    href: '/products/category/automotive',
    icon: Car,
    subLinks: [
      { label: 'Car Care & Cleaning', href: '/products/category/automotive/car-care' },
      { label: 'Oils & Fluids', href: '/products/category/automotive/oils-fluids' },
      { label: 'Replacement Parts', href: '/products/category/automotive/parts' },
      { label: 'Tires & Wheels', href: '/products/category/automotive/tires-wheels' },
      { label: 'Interior Accessories', href: '/products/category/automotive/interior-accessories' },
      { label: 'Exterior Accessories', href: '/products/category/automotive/exterior-accessories' },
      { label: 'Motorcycle Gear', href: '/products/category/automotive/motorcycle-gear' },
    ],
  },
  {
    label: 'Books, Office & Stationery',
    href: '/products/category/books-office-stationery',
    icon: BookMarked,
    subLinks: [
      { label: 'Books (Fiction, Non-fiction)', href: '/products/category/books-office-stationery/books' },
      { label: 'Children\'s Books', href: '/products/category/books-office-stationery/children-books' },
      { label: 'Magazines & Periodicals', href: '/products/category/books-office-stationery/magazines' },
      { label: 'Office Supplies', href: '/products/category/books-office-stationery/office-supplies', icon: PencilRuler },
      { label: 'School Supplies', href: '/products/category/books-office-stationery/school-supplies' },
      { label: 'Writing Instruments', href: '/products/category/books-office-stationery/writing' },
      { label: 'Art Supplies', href: '/products/category/books-office-stationery/art-supplies' },
    ],
  },
  {
    label: 'Health & Wellness',
    href: '/products/category/health-wellness',
    icon: HeartPulse,
    subLinks: [
      { label: 'Vitamins & Supplements', href: '/products/category/health-wellness/vitamins-supplements' },
      { label: 'First Aid Supplies', href: '/products/category/health-wellness/first-aid' },
      { label: 'Personal Hygiene', href: '/products/category/health-wellness/personal-hygiene' }, // Can overlap with beauty
      { label: 'Medical Equipment', href: '/products/category/health-wellness/medical-equipment', icon: Stethoscope },
      { label: 'Optical Care', href: '/products/category/health-wellness/optical-care' },
      { label: 'Family Planning', href: '/products/category/health-wellness/family-planning' },
      { label: 'Mobility Aids', href: '/products/category/health-wellness/mobility-aids' },
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

// Helper to get all slugs for static generation
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
// const allSlugs = getAllCategorySlugs(CATEGORY_NAV_LINKS);
// console.log(JSON.stringify(allSlugs, null, 2));
