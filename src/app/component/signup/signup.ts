import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  signupForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const signupData = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };

      const apiUrl = 'http://localhost:8080/auth/signup';
      
      this.http.post(apiUrl, signupData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // If the backend returns a token directly after signup, store it
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
          
          // Redirect to login page with success message
          this.router.navigate(['/login'], { 
            queryParams: { message: 'Registration successful! Please login.' } 
          });
        },
        error: (error) => {
          this.isLoading = false;
          
          // Handle different error scenarios
          if (error.status === 409) {
            this.errorMessage = 'Email already exists';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please try again later.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
    }
  }
}