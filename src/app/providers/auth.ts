import {
    Injectable,
    EventEmitter
}                           from '@angular/core';
import { Router }           from '@angular/router';
import { Sessao }           from './sessao';
import { Api }              from './api';

@Injectable()
export class Auth{

    public userIsLoged = new EventEmitter<boolean>();

    constructor(
        private router: Router,
        private api: Api
    ){}

    public isLoged(){

        let token = Sessao.getObjectDB( '_token_' );
        return this.api.checkSession({ token:token }).map( res => {
            this.userIsLoged.emit( res.auth );
            return res.auth;
        });
    }
}
