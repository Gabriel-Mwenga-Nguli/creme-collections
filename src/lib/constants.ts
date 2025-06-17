export const SITE_NAME = "Creme Lite";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/search-page", label: "Search" },
  { href: "/contact", label: "Contact Us" },
  { href: "/chat-support", label: "Support" },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export type NavLink = {
  href: string;
  label: string;
  icon?: React.ElementType;
  subLinks?: NavLink[];
};
