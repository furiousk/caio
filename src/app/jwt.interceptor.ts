import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle( request ).do(( event: HttpEvent<any> ) => {

            console.log( event );
            if( event instanceof HttpResponse ){
                console.log( event );
            }

        }, (err: any) => {

            if( err instanceof HttpErrorResponse ){
                console.log( err.status );
            }
        });
    }
}
