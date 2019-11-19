import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { ExcelService } from '../providers/excel.service';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-telemetria',
    templateUrl: './telemetria.component.html',
    styleUrls: ['./telemetria.component.scss']
})

export class TelemetriaComponent implements OnInit, OnDestroy{

    public telemetry: any = {
        time_a: moment().format('DD-MM-YYYY'),
        time_b: moment().format('DD-MM-YYYY'),
        events: [],
        exvel: 1,
        exrot: 2,
        fread: 3,
        faixa: 4,
        exlent: 5,
        acel: 7
    };
    public order: string = 'aproveitamento';
    public reverse: boolean = false;
    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];
    public list: Array<any> = [];
    public listB: Array<any> = [];
    public searchText: String = '';
    public carros: Array<any> = [];
    public loading: Boolean = false;

    constructor(
        private api:      Api,
        private router:   Router,
        private actroute: ActivatedRoute,
        private orderPipe: OrderPipe,
        private excelService: ExcelService
    ){}

    public back(){
        this.router.navigate( ['maps'] );
    }

    public gerar( params ){

        this.loading = true;
        params.time_a = moment(params.time_a,'DD-MM-YYYY').format('YYYY-MM-DD');
        params.time_b = moment(params.time_b,'DD-MM-YYYY').format('YYYY-MM-DD');
        params.eventos=this.loadEvents( params );

        this.api.getTelemetria( params ).subscribe( result => {

            if( !result || result.carga==null || !result.carga ){
                this.loading = false;
                return;
            }

            this.list = [];
            this.listB = [];
            let cargasH = {};

            for( let o of result.carga ){
                cargasH[ o._id.matricula ] = o.carga;
            }

            Object.keys( result.motorista ).forEach( i => {

                if( !cargasH[i] )return;

                let soma1 = 0;
                let events = [];
                let carros_envolvidos = {};
                let listaB = {};

                listaB['motorista']=result.motorista[i].motorista;
                listaB['jornada']=result.motorista[i].motorista;

                listaB['1']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };
                listaB['2']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };
                listaB['3']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };
                listaB['4']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };
                listaB['5']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };
                listaB['7']={

                    totaloccurs:0,
                    totaltime:0,
                    erros:0,
                    totaltimeS:0
                };

                Object.keys( result.motorista[i].vehicle ).forEach( e => {

                    let __data = _.find( this.carros, obj => { return parseInt( result.motorista[i].vehicle[e] ) == parseInt( obj.mixID ) });
                    carros_envolvidos[ result.motorista[i].vehicle[e] ] = __data.placa;
                });

                Object.keys( result.motorista[i].eventos ).forEach( z => {

                    let peso = result.motorista[i].eventos[z].peso;
                    let coif = result.motorista[i].eventos[z].coif;

                    result.motorista[i].eventos[z]['erro'] = parseFloat( ( ( result.motorista[i].eventos[z].totaltime / cargasH[i] ) * 100 ).toFixed( 2 ) );
                    result.motorista[i].eventos[z]['parcAprov'] = 0;
                    result.motorista[i].eventos[z]['totaltimeS'] = this.secondsTohhmmss( result.motorista[i].eventos[z].totaltime );

                    if(!listaB[z])listaB[z]={};

                    listaB[z]['totaloccurs']=result.motorista[i].eventos[z].totaloccurs;
                    listaB[z]['totaltime']=this.secondsTohhmmss( result.motorista[i].eventos[z].totaltime );
                    listaB[z]['totaltimeS']=result.motorista[i].eventos[z].totaltime;
                    listaB[z]['erros']=result.motorista[i].eventos[z]['erro'];

                    soma1 += result.motorista[i].eventos[z].erro;
                    events.push( result.motorista[i].eventos[z] );
                });

                Object.keys( carros_envolvidos ).forEach( e => {

                    if( !result.motorista[i]['carros'] ){

                        result.motorista[i]['carros']='';
                        result.motorista[i]['carros']+=`${ carros_envolvidos[e] }`;
                    }else{
                        result.motorista[i]['carros']+=`, ${ carros_envolvidos[e] }`;
                    }
                });

                result.motorista[i]['cargaH'] = this.secondsTohhmmss( cargasH[i] );
                result.motorista[i].eventos = events;
                result.motorista[i]['aproveitamento'] = parseFloat( ( 100 - soma1 ).toFixed( 2 ) );

                this.list.push( result.motorista[i] );
                this.listB.push( listaB );
                this.loading = false;
            });
        });
    }

    public setOrder( value: string ){
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    public loadEvents(params){

        let array = [];
        if(params.exvel!==false)array.push(params.exvel);
        if(params.exrot!==false)array.push(params.exrot);
        if(params.fread!==false)array.push(params.fread);
        if(params.faixa!==false)array.push(params.faixa);
        if(params.exlent!==false)array.push(params.exlent);
        if(params.acel!==false)array.push(params.acel);
        return array;
    }

    public exportToExcel(){

        let RANKING = [];
        if( !this.list.length ){ alert('Não há dados para exportação!'); return; }

        for( let o of this.list ){

            let object = {};
            object['motorista']=o.motorista;
            object['jornada']=o.cargaH;
            object['aproveitamento']=o.aproveitamento;

            for( let i of o.eventos ){

                object[ `${i.eventName}:ocorrencias` ]=i.totaloccurs;
                object[ `${i.eventName}:tempo` ]=i.totaltimeS;
                object[ `${i.eventName}:erros` ]=i.erro;
            }
            RANKING.push( object );
        }
        this.excelService.exportAsExcelFile( RANKING, 'telemetria', {BKB: '003'});
    }

    private loadVeiculos(){

        this.api.getVehicles().subscribe((res) => {
            this.carros = res;
        });
    }

    private secondsTohhmmss(totalSeconds){

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
    }

    ngOnDestroy(){}
}
