// src/app/auth/auth-form.component.ts
import { Component, inject, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MessageModule,
    RouterLink
  ],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode = computed(() => this.route.snapshot.routeConfig?.path); // 'login' or 'register'
  authError = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: [''] // Used only for register
  });

  isRegisterMode() {
    return this.mode() === 'register';
  }

  onSubmit() {
    const { email, password, confirmPassword } = this.form.getRawValue();

    if (this.isRegisterMode()) {
      if (password !== confirmPassword) {
        this.authError = true;
        return;
      }
      this.auth.register(email, password).subscribe(success => {
        this.authError = !success;
        if (success) this.router.navigateByUrl('/non-started');
      });
    } else {
      this.auth.login(email, password).subscribe(success => {
        this.authError = !success;
        if (success) this.router.navigateByUrl('/non-started');
      });
    }
  }
}

