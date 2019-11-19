import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { ExcelService } from '../providers/excel.service';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-poi',
    templateUrl: './poi.component.html',
    styleUrls: ['./poi.component.scss']
})

export class PoiComponent implements OnInit, OnDestroy{

    public ifilter: any = {
        time_a: moment().format('YYYY-MM-DD'),
        time_b: moment().format('YYYY-MM-DD'),
        pedagio: ""
    };
    public order: string = 'linha';
    public reverse: boolean = false;
    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];
    public list: Array<any> = [];
    public searchText: String = '';
    public carros: any = {};
    public loading: Boolean = false;
    public breadcrumb: Boolean = false;
    public listPedagio: Array<any> = [];

    public _linha: String = '';
    public _motorista: String = '';
    public _carro: String = '';
    public _data: String = '';

    public _count: Number = 0;

    public site: string = 'poi';

    constructor(
        private api:      Api,
        private router:   Router,
        private actroute: ActivatedRoute,
        private orderPipe: OrderPipe,
        private excelService: ExcelService
    ){
        this.breadcrumb = true;
    }

    public logoof(){
        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    public countSelect(): void{
        let elem:NodeListOf<Element> = document.querySelectorAll("tr.registros");
        this._count = Array.from(elem).length;
    }

    public gerar( params:any ){

        this.loading = true;
        this.list = [];

        this.api.getPedagio( params ).subscribe( docs => {

            if( !docs || !docs.length ){ this.loading = false }else{

                for( let i=0; i < docs.length; i++ ){

                    if( !docs[i].alocacao ){

                        docs[i]['motorista'] = 'não informado';
                        docs[i]['carro']     = (!this.carros[ docs[i].veiculo ])?'não informado':this.carros[ docs[i].veiculo ].placa;
                        docs[i]['linha']     = 'não informado';

                    }else{

                        docs[i]['motorista'] = docs[i].alocacao.nome_motorista;
                        docs[i]['carro']     = docs[i].alocacao.numero_carro;
                        docs[i]['linha']     = docs[i].alocacao.numero_linha;

                    }

                    if( !docs[i].geofence ){

                        docs[i]['cerca'] = 'não informado';
                    }else{
                        docs[i]['cerca'] = docs[i].geofence.nome;
                    }
                    docs[i]['datetime'] = moment( docs[i].datetime ).format( 'DD/MM/YYYY HH:mm:ss' );
                    this.list.push( docs[i] );
                }

                setTimeout(()=>{

                    this.countSelect();
                    this.loading = false;

                },1000);
            }
        });
    }

    public sunKeys( key: string ): number{

        let total = 0;
        Object.keys( this.list[ key ] ).forEach( i => {
            if( i=='name' ){}else{
                total += this.list[ key ][ i ].length;
            }
        });
        return total;
    }

    public setOrder( value: string ){
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    public exportToExcel(){

        let PEDAGIO = [];

        if( !Object.keys( this.list ).length ){ alert('Não há dados para exportação!'); return }

        Object.keys( this.list ).forEach( i => {

            let object = {};

            Object.keys( this.list[ i ] ).forEach( o => {

                if( o=='name' ){}else{

                    PEDAGIO.push({
                        'Veículo': this.list[ i ][ o ][0].placa,
                        'Data': this.list[ i ][ o ][0].datetime,
                        'Quantidade': this.list[ i ][ o ].length,
                    });
                }
            });
        });
        this.excelService.exportAsExcelFile( PEDAGIO, 'pedagio', { BKB: '010' });
    }

    private loadVeiculos(){

        this.api.getVehicles().subscribe((res) => {
            res.map( i => {
                this.carros[i.mixID] = i;
            });
        });
    }

    private loadFences(){

        this.api.getCerca({ type: 'PEDAGIO' }).subscribe( res => {
            this.listPedagio = res;
            console.log( res );
        });
    }

    private secondsTohhmmss( totalSeconds ){

        let hours   = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        seconds = Math.round(seconds * 100) / 100;

        let result = (hours < 10 ? "0" + hours : hours);
            result += ":" + (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds  < 10 ? "0" + seconds : seconds);

        return result;
    }

    ngOnInit(){

        this.loadVeiculos();
        this.loadFences();
    }

    ngOnDestroy(){

        this.breadcrumb = false;
    }
}
