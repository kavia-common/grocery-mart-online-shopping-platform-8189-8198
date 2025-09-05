import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderConfirmationComponent } from './pages/orders/order-confirmation.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'category/:slug', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
      { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
      { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [authGuard] },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];
