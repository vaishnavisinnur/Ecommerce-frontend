import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the sessionId from sessionStorage
    const sessionId = sessionStorage.getItem('sessionId');
    
    // Clone the request and add the authorization header if sessionId exists
    if (sessionId) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${sessionId}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Clear session and redirect to login on 401
          sessionStorage.removeItem('sessionId');
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('userEmail');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}