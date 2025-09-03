import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <div class="user-info">
          <span>Hello, {{ userEmail }}</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-card">
          <h2>Your Account</h2>
          <p>Manage your profile and settings</p>
        </div>
        
        <div class="dashboard-card">
          <h2>Order History</h2>
          <p>View your past orders</p>
        </div>
        
        <div class="dashboard-card">
          <h2>Wishlist</h2>
          <p>Items you've saved for later</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logout-btn {
      padding: 8px 16px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .dashboard-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .dashboard-card {
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      background-color: white;
    }
  `]
})
export class UserDashboard implements OnInit {
  userEmail: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Get user email
    this.userEmail = localStorage.getItem('userEmail') || 'User';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}