import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Signup } from './component/signup/signup';
import { UserDashboard } from './component/user-dashboard/user-dashboard';
import { AdminDashboard } from './component/admin-dashboard/admin-dashboard';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { 
    path: 'user-dashboard', component: UserDashboard,
   // canActivate: [AuthGuard]  // Remove this line temporarily if you want to test without auth guard
  },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboard,
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/login' }
];