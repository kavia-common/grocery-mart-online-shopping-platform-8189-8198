import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category, Product, Order, Address, PaymentInfo, AuthUser } from '../models/types';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { safeStorage, buildUrl } from '../utils/platform';

// Simple token storage (can be replaced by more secure storage)
const TOKEN_KEY = 'gm_auth_token';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  private get headers(): HttpHeaders {
    const token = safeStorage.getItem(TOKEN_KEY);
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  // PUBLIC_INTERFACE
  /** Fetch all categories */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Fetch products, optionally by category or search term */
  getProducts(params?: { categoryId?: string; q?: string }): Observable<Product[]> {
    const url = buildUrl(`${this.base}/products`, {
      categoryId: params?.categoryId,
      q: params?.q
    });
    return this.http.get<Product[]>(url, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Authenticate user and receive token */
  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.base}/auth/login`, { email, password }, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Register a new user account */
  register(name: string, email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.base}/auth/register`, { name, email, password }, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Get current user profile using stored token */
  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.base}/auth/me`, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Place an order */
  checkout(payload: {
    items: { productId: string; quantity: number }[];
    shippingAddress: Address;
    payment: PaymentInfo;
  }): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders`, payload, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Get order history for current user */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/orders/my`, { headers: this.headers });
  }

  // PUBLIC_INTERFACE
  /** Save authentication token */
  setToken(token: string) {
    safeStorage.setItem(TOKEN_KEY, token);
  }

  // PUBLIC_INTERFACE
  /** Clear auth token and session */
  clearToken() {
    safeStorage.removeItem(TOKEN_KEY);
  }
}
