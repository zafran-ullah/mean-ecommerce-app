import { CartItem } from './cart.model';
import { User } from './user.model';

export interface Order {
  _id: string;
  userId: string;
  user?: User;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: string;
}
