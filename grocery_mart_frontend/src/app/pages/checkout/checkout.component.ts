import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { Address, PaymentInfo } from '../../models/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  protected cart = inject(CartService);
  private api = inject(ApiService);
  private router = inject(Router);

  address: Address = {
    fullName: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };
  payment: PaymentInfo = {
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  };
  loading = false;
  error = '';

  placeOrder() {
    this.error = '';
    const items = this.cart.getItems().map(i => ({ productId: i.product.id, quantity: i.quantity }));
    if (!items.length) {
      this.error = 'Your cart is empty.';
      return;
    }
    this.loading = true;
    this.api.checkout({ items, shippingAddress: this.address, payment: this.payment }).subscribe({
      next: (order) => {
        this.cart.clear();
        this.loading = false;
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Checkout failed. Please try again.';
      }
    });
  }
}
