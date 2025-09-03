import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      return true; // Allow navigation
    } else {
      this.router.navigate(['/login']); // Redirect to login
      return false; // Block navigation
    }
  }
}