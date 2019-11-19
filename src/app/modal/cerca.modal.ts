import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';

import { Api } from '../providers/api';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'cerca-modal-content',
    templateUrl: './cerca.modal.html',
    styleUrls: ['./alocacao.modal.scss']
})

export class CercaModal implements OnInit, OnDestroy{

    @Input() name;
    public cerca: any = {};
    public list: Array<any> = [];

    constructor(
        public activeModal: NgbActiveModal,
        private api: Api
    ){}

    public open( data:any ): void{

        if(!this.name.geometry){}else{

            data['geometry'] = this.name.geometry;
            this.activeModal.close({ value: data });
        }
    }

    private loadLinhas(){
        this.api.getLines().subscribe( res => {
            this.list = res;
        });
    }

    private checkUpdate(): void{
        if( !this.name._id ){}else{
            this.cerca = this.name;
        }
    }

    ngOnInit(){
        this.checkUpdate();
        this.loadLinhas();
        console.log( this.name );
    }

    ngOnDestroy(){}
}
