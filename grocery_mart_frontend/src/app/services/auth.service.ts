import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthUser } from '../models/types';
import { ApiService } from './api.service';
import { safeStorage } from '../utils/platform';

const USER_KEY = 'gm_user_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private user$ = new BehaviorSubject<AuthUser | null>(this.loadUser());

  private loadUser(): AuthUser | null {
    try {
      const raw = safeStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private persist(user: AuthUser | null) {
    if (user) safeStorage.setItem(USER_KEY, JSON.stringify(user));
    else safeStorage.removeItem(USER_KEY);
  }

  // PUBLIC_INTERFACE
  /** Observable stream for authenticated user */
  observe() {
    return this.user$.asObservable();
  }

  // PUBLIC_INTERFACE
  /** Current user snapshot */
  current(): AuthUser | null {
    return this.user$.getValue();
  }

  // PUBLIC_INTERFACE
  /** Perform login and set token/user */
  login(email: string, password: string) {
    return this.api.login(email, password).pipe(
      tap(user => {
        this.api.setToken(user.token);
        this.user$.next(user);
        this.persist(user);
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Register new user and set session */
  register(name: string, email: string, password: string) {
    return this.api.register(name, email, password).pipe(
      tap(user => {
        this.api.setToken(user.token);
        this.user$.next(user);
        this.persist(user);
      })
    );
  }

  // PUBLIC_INTERFACE
  /** Logout and clear session */
  logout() {
    this.api.clearToken();
    this.user$.next(null);
    this.persist(null);
  }

  // PUBLIC_INTERFACE
  /** Whether user is authenticated */
  isAuthenticated(): boolean {
    return !!this.user$.getValue();
  }
}
