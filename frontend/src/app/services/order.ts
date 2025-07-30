import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  // Create new order
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  // Get user's orders
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  // Get order by ID
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Get all orders (Admin only)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin`);
  }

  // Update order status (Admin only)
  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Cancel order
  cancelOrder(id: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
