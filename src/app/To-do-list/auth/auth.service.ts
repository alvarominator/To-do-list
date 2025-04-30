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
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
  
    const isValid = user && user.password === password;
  
    if (isValid) {
      localStorage.setItem(this.tokenKey, 'dummy-token');
      this.tokenSignal.set('dummy-token');
      return of(true).pipe(delay(300));
    }
  
    return of(false).pipe(delay(300));
  }
  
  register(email: string, password: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
  
    if (users[email]) {
      return of(false).pipe(delay(300));
    }
  
    users[email] = { email, password };
    localStorage.setItem('users', JSON.stringify(users));
  
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
