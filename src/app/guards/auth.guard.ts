import { Injectable }   from '@angular/core';
import {
    CanActivate,
    CanActivateChild,CanLoad,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,Route,
    NavigationStart,
    Event as NavigationEvent
}                       from '@angular/router';
import { Observable }   from 'rxjs/Rx';
import { Auth }         from '../providers/auth';

@Injectable()
export class AuthGuard implements CanActivate,CanActivateChild,CanLoad {

    constructor(
        private auth: Auth,
        private router: Router
    ){}

    canActivate(

        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot

    ): Observable<boolean> | boolean{

        return this.auth.isLoged();
    }

    canActivateChild(

        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot

    ): Observable<boolean> | boolean {

        return this.canActivate(route, state);
    }

    canLoad(

        route: Route

    ):boolean {

        this.router.events.forEach((event: NavigationEvent) => {
            if(event instanceof NavigationStart){
                console.log(event,'<---- a porra do evento');
            }
            // NavigationEnd
            // NavigationCancel
            // NavigationError
            // RoutesRecognized
        });
        //let url = `/${ route.path }`;
        //console.log( route, '<-----a porra do ACL' );
        return true;
    }
}
