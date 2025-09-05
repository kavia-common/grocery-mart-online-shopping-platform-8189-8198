import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/types';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);

  products: Product[] = [];
  title = 'All Products';

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.load());
    this.route.queryParamMap.subscribe(() => this.load());
  }

  private load() {
    const slug = this.route.snapshot.paramMap.get('slug') || undefined;
    const q = this.route.snapshot.queryParamMap.get('q') || undefined;
    this.title = q ? `Search: ${q}` : (slug ? `Category: ${slug}` : 'All Products');
    this.api.getProducts({ categoryId: slug, q }).subscribe((prods) => {
      this.products = prods;
    });
  }

  addToCart(p: Product) {
    this.cart.add(p, 1);
  }
}
