import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Api }               from '../providers/api';
import { Sessao }            from '../providers/sessao';
import { UserLogin }         from '../providers/user.login';

@Component({

    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit{

    public user: any = {};
    public erro: any = {};

    constructor(
        private api:    Api,
        private router: Router
    ){}

    public login(): void{

        if( !this.user.email ){ return; }
        if( !this.user.password ){ return; }

        this.api.login( this.user ).subscribe( data => {

            if( data.code===203 ){
                this.erro.login=data.err;
            }else{
                this.api.setToken( data.token );
                Sessao.setObjectDB( '_user_', data.user );
                this.router.navigate([ 'modulo' ]);
            }
            console.log( data );
        });
    }
    ngOnInit(){}
}
