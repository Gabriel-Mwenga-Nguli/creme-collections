
// src/lib/types.ts
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon | React.ElementType; // Allow LucideIcon or any React component
  subLinks?: NavLink[];
  match?: 'exact' | 'partial'; // For active link matching
}

export interface TieredDiscount {
  amount: number;
  spend: number;
  maxSpend?: number;
}

export interface PromoSlideProps {
  // Required fields from Firestore
  type: 'firstOrder' | 'tieredDiscount' | 'revealCode';
  title: string;
  href: string;
  dataAiHint: string;
  displayOrder: number;
  isActive: boolean;
  
  // Optional fields for different types
  subtitle?: string;
  code?: string;
  terms?: string;
  productImage?: string;
  tiers?: TieredDiscount[];
  actionText?: string;
  codePlaceholder?: string;
  
  // Styling fields
  backgroundColor?: string;
  foregroundColor?: string;
  accentColor?: string;
}
