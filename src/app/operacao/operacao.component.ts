import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Sessao }            from '../providers/sessao';
//import { SocketService }     from "../providers/socket.service";

import * as _       from "lodash";
import * as moment  from 'moment-timezone';
import * as async   from 'async';

@Component({
    selector: 'app-operacao',
    templateUrl: './operacao.component.html',
    styleUrls: ['./operacao.component.scss']
})
export class OperacaoComponent implements OnInit,OnDestroy {

    constructor(
        private router:         Router,
        private actroute:       ActivatedRoute,
        private modalService:   NgbModal,
        private titulo:         Title
    ){}

    private setTitle( newTitle: string ){
        this.titulo.setTitle( newTitle );
    }
    public getTitle():string{
        return this.titulo.getTitle();
    }
    public logoof(){
        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    ngOnInit(){
        this.setTitle( 'ITS - Módulo Telemetria' );
    }
    ngOnDestroy(){}

}
