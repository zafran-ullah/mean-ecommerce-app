import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then(m => m.Register)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductList)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/product-details/product-details').then(m => m.ProductDetails)
  },
  
  // Protected routes (requires authentication)
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then(m => m.Cart),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard]
  },
  
  // Admin routes (requires admin role)
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadComponent: () => import('./admin/product-management/product-management').then(m => m.ProductManagement)
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin/order-management/order-management').then(m => m.OrderManagement)
      }
    ]
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/products' }
];
