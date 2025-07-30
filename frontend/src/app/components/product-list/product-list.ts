import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
        console.error('Error loading products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  getCartQuantity(productId: string): number {
    return this.cartService.getItemQuantity(productId);
  }
}
