import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error.component';
import { Injectable } from '@angular/core';


/**
 * To add this interceptor to the every request you nee to add this in app module providers array.
 * providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthIncerceptor, multi: true}]
 * Do not forget to add multi: true. You can add multiple interceptor at a time.
 * Also multi true will provide new layer of interceptor intead of overriding the older interceptor.
 *
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept (req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknow error occured';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    );
  }
}
