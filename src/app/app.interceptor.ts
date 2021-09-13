import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS, HttpParams
} from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { Md5 } from 'ts-md5';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    // TUTORIAL PARA IMPLEMENTAR EL INTERCEPTOR Y REFRESH https://dev-academy.com/angular-jwt/#refresh-token
    jwt: any;
    isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let interceptedRequest = request;
        
        const md5 = new Md5();
        const ts = Date.now();
        const hash = md5.appendStr(`${ts + environment.privateKey.toString() + environment.publicKey.toString()}`).end();

        let params: HttpParams;
        
        // = ? new HttpParams() : interceptedRequest.params;

        if (interceptedRequest.params.keys().length === 0) {
          params = new HttpParams()
            .set('ts', ts.toString())
            .set('hash', hash.toString())
            .set('apikey', environment.publicKey);
        } else {
          params = interceptedRequest.params.append('ts', ts.toString())
            .append('hash', hash.toString())
            .append('apikey', environment.publicKey);
        }

        interceptedRequest = request.clone({params});

        return next.handle(interceptedRequest).pipe(catchError(error => {
            if (error.status === 0) { // errores con status 0 son debido a CORS
              throw {error: 'An error has happened, try again.'};
            } else {
              return throwError(error);
            }
          }
        ));
    }
}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, multi: true}];