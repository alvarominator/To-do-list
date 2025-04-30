// src/app/auth/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));

  token = computed(() => this.tokenSignal());

  constructor(private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    // Simulate login (replace with real HTTP call later)
    if (email === 'admin@example.com' && password === '123456') {
      localStorage.setItem(this.tokenKey, 'dummy-token');
      this.tokenSignal.set('dummy-token');
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  register(email: string, password: string): Observable<boolean> {
    // Simulate register (replace with HTTP later)
    localStorage.setItem(this.tokenKey, 'dummy-token');
    this.tokenSignal.set('dummy-token');
    return of(true).pipe(delay(300));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }
  getToken(): string | null {
    return this.token();
  }
  
}
