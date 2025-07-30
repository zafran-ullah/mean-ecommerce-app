import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}
