
"use client";

import type { ProductCardProps } from '@/components/features/home/product-card'; 
import { useToast } from '@/hooks/use-toast'; 
import Link from 'next/link';
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

export interface CartItem extends ProductCardProps { 
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductCardProps, quantity: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void; 
  removeItemFromCart: (productId: string) => void; 
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const currentCartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const addToCart = useCallback((product: ProductCardProps, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });

    toast({
      title: `${product.name} added to cart!`,
      description: `Quantity: ${quantity}. Total items: ${currentCartItemCount + quantity}`,
      // action: createViewCartToastAction(), // Removed action temporarily
      duration: 5000,
    });
  }, [toast, currentCartItemCount]);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => { 
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) 
    );
  }, []);

  const removeItemFromCart = useCallback((productId: string) => { 
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.fixedOfferPrice === 'number' ? item.fixedOfferPrice : 0;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateItemQuantity, removeItemFromCart, clearCart, getCartTotal, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
