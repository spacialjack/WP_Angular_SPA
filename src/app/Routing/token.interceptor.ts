import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {HttpResponse } from 'selenium-webdriver/http';
import { AuthService } from '../Services/AuthService/auth.service';



@Injectable()

// Interceptor grabs the http request and appends the header with the auth token
export class TokenInterceptor implements HttpInterceptor {
    private token: string;
    constructor(private authService: AuthService) {
        this.authService.tokenSubject.subscribe(
            data => this.token = data
        );
    }

        intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            if (this.token) {
                request =   request.clone({
                                setHeaders: {
                                    'Authorization': `Bearer ${this.token}`
                                }
                            });
            }
            return next.handle(request);
        }
}
