// src/app/To-do-list/auth/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  
  private tokenSignal = signal<string | null>(null); 

  token = computed(() => this.tokenSignal()); 

  constructor(private router: Router) {
    this.tokenSignal.set(sessionStorage.getItem(this.tokenKey)); 
  }

  login(email: string, password: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];

    const isValid = user && user.password === password;

    if (isValid) {
      sessionStorage.setItem(this.tokenKey, 'dummy-token'); 
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
    sessionStorage.setItem(this.tokenKey, 'dummy-token'); 
    this.tokenSignal.set('dummy-token'); 
    return of(true).pipe(delay(300));
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey); 
    this.tokenSignal.set(null); 
    this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}