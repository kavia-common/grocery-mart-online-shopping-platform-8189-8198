export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // cents or unit currency depending on backend
  imageUrl?: string;
  categoryId: string;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardholder: string;
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  shippingAddress?: Address;
  status?: 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  token: string;
}
