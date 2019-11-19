import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { ExcelService } from '../providers/excel.service';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-pedagio',
    templateUrl: './pedagio.component.html',
    styleUrls: ['./pedagio.component.scss']
})

export class PedagioComponent implements OnInit, OnDestroy{

    public ifilter: any = {
        time_a: moment().format('YYYY-MM-DD'),
        time_b: moment().format('YYYY-MM-DD'),
        pedagio: ""
    };
    public order: string = 'aproveitamento';
    public reverse: boolean = false;
    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];
    public list: any = {};
    public searchText: String = '';
    public carros: any = {};
    public loading: Boolean = false;
    public breadcrumb: Boolean = false;
    public listPedagio: Array<any> = [];

    public site: string = 'pedagio';

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

    public gerar( params:any ){

        this.loading = true;
        this.list = [];
        let mapa = {};

        this.api.getPedagio( params ).subscribe( docs => {

            if( !docs || !docs.length ){ this.loading = false } else {

                for( let doc of docs ){

                    if( !this.carros[ doc.veiculo ] ){}else{

                        if( !mapa[ doc.geofence._id ] ){

                            mapa[ doc.geofence._id ] = { 'name': doc.geofence.nome };

                            if( !mapa[ doc.geofence._id ][ doc.veiculo ] ){
                                mapa[ doc.geofence._id ][ doc.veiculo ] = [];
                            }

                        }else{

                            if( !mapa[ doc.geofence._id ][ doc.veiculo ] ){
                                mapa[ doc.geofence._id ][ doc.veiculo ] = [];
                            }
                        }

                        mapa[ doc.geofence._id ][ doc.veiculo ].push({

                            veiculo:  doc.veiculo,
                            placa:    this.carros[ doc.veiculo ].placa,
                            datetime: moment(doc.datetime).format('DD/MM/YYYY HH:mm:ss'),
                            geofence: doc.geofence.nome
                        });
                    }
                }
                this.list = mapa;
                this.loading = false;
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
