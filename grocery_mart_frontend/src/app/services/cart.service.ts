import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/types';
import { safeStorage } from '../utils/platform';

const CART_KEY = 'gm_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>(this.loadCart());

  private loadCart(): CartItem[] {
    try {
      const raw = safeStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]) {
    safeStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  // PUBLIC_INTERFACE
  /** Observable stream of cart items */
  observe() {
    return this.items$.asObservable();
  }

  // PUBLIC_INTERFACE
  /** Get current cart items snapshot */
  getItems(): CartItem[] {
    return this.items$.getValue();
  }

  // PUBLIC_INTERFACE
  /** Add a product with quantity to the cart */
  add(product: Product, qty = 1) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
    } else {
      items.push({ product, quantity: qty });
    }
    this.items$.next([...items]);
    this.persist(this.items$.getValue());
  }

  // PUBLIC_INTERFACE
  /** Remove a product from the cart completely */
  remove(productId: string) {
    const items = this.getItems().filter(i => i.product.id !== productId);
    this.items$.next(items);
    this.persist(items);
  }

  // PUBLIC_INTERFACE
  /** Update quantity for a product; if quantity <= 0, remove item */
  updateQuantity(productId: string, qty: number) {
    const items = this.getItems()
      .map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      .filter(i => i.quantity > 0);
    this.items$.next(items);
    this.persist(items);
  }

  // PUBLIC_INTERFACE
  /** Clear the cart */
  clear() {
    this.items$.next([]);
    this.persist([]);
  }

  // PUBLIC_INTERFACE
  /** Compute subtotal */
  subtotal(): number {
    return this.getItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  // PUBLIC_INTERFACE
  /** Compute total item count */
  count(): number {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  }
}
