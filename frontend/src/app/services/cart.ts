import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Cart, CartItem, AddToCartRequest } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({ items: [], totalPrice: 0, totalItems: 0 });
  public cart$ = this.cartSubject.asObservable();
  
  // Signals for reactive UI
  public cartItems = signal<CartItem[]>([]);
  public totalPrice = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  public totalItems = computed(() => 
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations on server
    }

    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const cart: Cart = JSON.parse(cartData);
        this.cartItems.set(cart.items);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage operations on server
    }

    const cart: Cart = {
      items: this.cartItems(),
      totalPrice: this.totalPrice(),
      totalItems: this.totalItems()
    };
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product._id === product._id);

    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = { product, quantity };
      this.cartItems.set([...currentItems, newItem]);
    }

    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems();
    const updatedItems = currentItems.filter(item => item.product._id !== productId);
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
    this.cartSubject.next({ items: [], totalPrice: 0, totalItems: 0 });
  }

  getCart(): Cart {
    return {
      items: this.cartItems(),
      totalPrice: this.totalPrice(),
      totalItems: this.totalItems()
    };
  }

  isInCart(productId: string): boolean {
    return this.cartItems().some(item => item.product._id === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems().find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }
}
