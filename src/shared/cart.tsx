import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../catalog/product.model';

export interface CartLine {
  productId: string;
  title: string;
  quantity: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  add: (product: Product) => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((product: Product) => {
    setLines((current) => {
      const existing = current.find((l) => l.productId === product.id);
      return existing
        ? current.map((l) => (l === existing ? { ...l, quantity: l.quantity + 1 } : l))
        : [...current, { productId: product.id, title: product.title, quantity: 1 }];
    });
  }, []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((sum, l) => sum + l.quantity, 0), add }),
    [lines, add],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside <CartProvider>');
  return value;
}
