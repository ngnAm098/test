import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { environment } from '@env/environment';
import { LoadingOverlayRef, LoadingService } from '../loading.service';
import { catchError, map } from 'rxjs/operators';

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let loadingRef: LoadingOverlayRef;
    Promise.resolve(null).then(() => (loadingRef = this.loadingService.open()));

    const savedCredentials = sessionStorage.getItem('credentials') || localStorage.getItem('credentials');
    const credentials = JSON.parse(savedCredentials);

    if (!!credentials) {
      const basicAuthHeaderString = credentials.token;
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + basicAuthHeaderString,
        },
      });
    }

    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.serverUrl + request.url });
    }

    return next
      .handle(request)
      .pipe(
        catchError((err) => {
          loadingRef.close();
          return err;
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            loadingRef.close();
          }
          return evt;
        })
      );
  }
}
