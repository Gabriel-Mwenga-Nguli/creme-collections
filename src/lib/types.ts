
// src/lib/types.ts
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon | React.ElementType; // Allow LucideIcon or any React component
  subLinks?: NavLink[];
  match?: 'exact' | 'partial'; // For active link matching
}
