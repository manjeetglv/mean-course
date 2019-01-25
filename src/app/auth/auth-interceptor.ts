import { HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * To add this interceptor to the every request you nee to add this in app module providers array.
 * providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthIncerceptor, multi: true}]
 * Do not forget to add multi: true. You can add multiple interceptor at a time.
 * Also multi true will provide new layer of interceptor intead of overriding the older interceptor.
 *
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept (req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    // Cloneing the request and forwarding the cloned reques.
    const authRequest = req.clone({
      headers: req.headers.set('AuthorIzation', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
