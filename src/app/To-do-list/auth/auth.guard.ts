// src/app/To-do-list/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Inicia la verificación de ruta.');
  const isAuthenticated = auth.isAuthenticated();
  console.log('AuthGuard: Resultado de auth.isAuthenticated():', isAuthenticated);
  console.log('AuthGuard: Intentando activar ruta:', state.url);

  if (!isAuthenticated) {
    console.log('AuthGuard: No autenticado. Redirigiendo a /login.');
    router.navigate(['/login']);
    return false;
  }
  console.log('AuthGuard: Autenticado. Permitiendo acceso.');
  return true;
};