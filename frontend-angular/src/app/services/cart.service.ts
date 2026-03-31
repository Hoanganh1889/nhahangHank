import { Injectable, computed, signal } from '@angular/core';

import { CartItem, Food } from '../types';

const STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.readInitialCart());
  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addToCart(food: Food): void {
    const currentItems = this.items();
    const existingItem = currentItems.find((item) => item._id === food._id);

    const nextItems = existingItem
      ? currentItems.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [
          ...currentItems,
          {
            _id: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
          }
        ];

    this.persist(nextItems);
  }

  increaseQuantity(id: string): void {
    this.persist(
      this.items().map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  decreaseQuantity(id: string): void {
    this.persist(
      this.items().map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  removeFromCart(id: string): void {
    this.persist(this.items().filter((item) => item._id !== id));
  }

  clearCart(): void {
    this.persist([]);
  }

  private readInitialCart(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      return rawValue ? (JSON.parse(rawValue) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
