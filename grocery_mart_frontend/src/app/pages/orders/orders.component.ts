import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  private api = inject(ApiService);
  orders: Order[] = [];

  ngOnInit() {
    this.api.getMyOrders().subscribe((o) => this.orders = o);
  }
}
