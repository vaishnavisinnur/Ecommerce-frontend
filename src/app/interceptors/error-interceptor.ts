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
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
          
          // Handle specific error codes
          switch (error.status) {
            case 401: // Unauthorized
              // Auth interceptor will handle this
              break;
            case 403: // Forbidden
              this.router.navigate(['/unauthorized']);
              break;
            case 404: // Not Found
              // Handle not found errors
              break;
            case 500: // Internal Server Error
              // Handle server errors
              break;
            default:
              // Handle other errors
          }
        }
        
        console.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}