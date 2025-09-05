import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wrap">
      <h2>Thank you!</h2>
      <p>Your order <strong>#{{ id }}</strong> has been placed successfully.</p>
      <a routerLink="/orders" class="btn">View Orders</a>
      <a routerLink="/products" class="btn btn-secondary">Continue Shopping</a>
    </div>
  `,
  styles: [`
    .wrap { text-align: center; padding: 2rem 0; }
    .btn { display: inline-block; margin: 0.5rem; background: #388e3c; color: #fff; padding: 0.6rem 1rem; border-radius: 8px; text-decoration: none; }
    .btn-secondary { background: #ff7043; }
  `]
})
export class OrderConfirmationComponent {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
