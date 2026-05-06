import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { MaterialModule } from '../../../shared/material.module';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    department: ['', [Validators.required]],
    role: ['EMPLOYEE' as 'EMPLOYEE' | 'MANAGER', [Validators.required]]
  });

  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const request: RegisterRequest = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      department: this.registerForm.value.department!,
      role: this.registerForm.value.role!
    };

    this.authService.register(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.parseError(err);
      }
    });
  }

  private parseError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Cannot connect to the server. Make sure the backend is running on localhost:8080.';
    }
    if (typeof err.error === 'string' && err.error.length > 0) {
      return err.error;
    }
    if (err.error?.message) return err.error.message;
    if (err.error?.error) return err.error.error;
    return `Registration failed (HTTP ${err.status}). Please try again.`;
  }
}

