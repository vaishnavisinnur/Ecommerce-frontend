import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Attempting login with:', loginData);
      
      // Set proper headers
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const apiUrl = 'http://localhost:8080/auth/login';
      
      this.http.post(apiUrl, loginData, { headers, observe: 'response' }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login successful:', response);
          
          // Extract the response body
          const responseBody = response.body;
          
          // Store session data
          if (responseBody && responseBody.sessionId) {
            sessionStorage.setItem('sessionId', responseBody.sessionId);
            sessionStorage.setItem('userId', responseBody.id);
            sessionStorage.setItem('userName', responseBody.name);
            sessionStorage.setItem('userEmail', responseBody.email);
            
            // Add debug logging
            console.log('Stored session data, attempting navigation...');
            
            // Navigate to user dashboard
            this.router.navigate(['/user/dashboard'])
              .then(navigationSuccess => {
                console.log('Navigation successful:', navigationSuccess);
                if (!navigationSuccess) {
                  this.errorMessage = 'Failed to navigate to dashboard. Route may not be configured.';
                }
              })
              .catch(navigationError => {
                console.error('Navigation error:', navigationError);
                this.errorMessage = 'An error occurred during navigation to dashboard.';
              });
          } else {
            this.errorMessage = 'Invalid response format from server';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else if (error.status === 403) {
            this.errorMessage = 'Account locked or disabled';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server';
          } else {
            this.errorMessage = error.error?.message || 'Login failed';
          }
        }
      });
    }
  }

ngOnInit(): void {
    // Check if user is already logged in
    const sessionId = sessionStorage.getItem('sessionId');
    
    if (sessionId) {
      console.log('User already logged in, redirecting to dashboard');
      console.log('Session ID found:', sessionId);
      
      this.router.navigate(['/user-dashboard']).then(success => {
        console.log('Auto-redirect navigation result:', success);
        if (!success) {
          console.log('Auto-redirect failed. Current URL:', this.router.url);
        }
      }).catch(err => {
        console.error('Auto-redirect error:', err);
      });
    } else {
      console.log('No session found, user needs to login');
    }
}
}