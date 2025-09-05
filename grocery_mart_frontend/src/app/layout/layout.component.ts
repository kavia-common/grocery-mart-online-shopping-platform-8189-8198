import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Category } from '../models/types';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  private api = inject(ApiService);
  protected cart = inject(CartService);
  protected auth = inject(AuthService);
  private router = inject(Router);

  categories: Category[] = [];
  q = '';
  year = new Date().getFullYear();

  ngOnInit() {
    this.api.getCategories().subscribe((c) => this.categories = c);
  }

  search() {
    const q = this.q.trim();
    const commands = ['/products'];
    const queryParams = q ? { q } : undefined;
    this.router.navigate(commands, { queryParams });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
