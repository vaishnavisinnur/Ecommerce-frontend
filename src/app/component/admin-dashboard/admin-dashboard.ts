import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div class="user-info">
          <span>Hello, Admin</span>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-card">
          <h2>User Management</h2>
          <p>Manage user accounts and permissions</p>
        </div>
        
        <div class="dashboard-card">
          <h2>Product Management</h2>
          <p>Add, edit, or remove products</p>
        </div>
        
        <div class="dashboard-card">
          <h2>Order Management</h2>
          <p>View and manage all orders</p>
        </div>
        
        <div class="dashboard-card">
          <h2>Analytics</h2>
          <p>View sales and performance data</p>
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
export class AdminDashboard implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'ADMIN') {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}