import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { ExcelService } from '../providers/excel.service';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-telemetria-erro',
    templateUrl: './telemetria-erro.component.html',
    styleUrls: ['./telemetria-erro.component.scss']
})

export class TelemetriaErroComponent implements OnInit, OnDestroy{

    public telemetry: any = {

        time_a: moment().format('YYYY-MM-DD'),
        time_b: moment().format('YYYY-MM-DD'),
        events: [],
        exvel: 1,
        exrot: 2,
        fread: 3,
        faixa: 4,
        exlent: 5,
        acel: 7
    };
    public abaixoD: Number = 70;
    public acimaD:  Number = 90;
    public order: string = 'aproveitamento';
    public reverse: boolean = false;
    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];
    public list: Array<any> = [];
    public listB: Array<any> = [];
    public searchText: String = '';
    public carros: Array<any> = [];
    public loading: Boolean = false;
    public breadcrumb: Boolean = false;

    public site: string = 'erros';

    constructor(
        private api:      Api,
        private router:   Router,
        private actroute: ActivatedRoute,
        private orderPipe: OrderPipe,
        private excelService: ExcelService
    ){
        this.actroute.params.subscribe( params => {

            if( !params || params==null || !Object.keys( params ).length ){}else{

                this.breadcrumb = true;
                this.abaixoD = params.abaixo;
                this.acimaD  = params.acima;
                this.telemetry.time_a = params.periodoA;
                this.telemetry.time_b = params.periodoB;
                this.searchText = params.motorista;

                this.gerar( this.telemetry );
            }
        });
    }

    public logoof(){

        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    public gotoRank(){
        this.router.navigate(['telemetria-ranking', {
            abaixo:this.abaixoD,acima:this.acimaD,periodoA:this.telemetry.time_a,periodoB:this.telemetry.time_b
        }]);
    }

    public gerar( params:any ){

        this.loading   = true;
        params.eventos = this.loadEvents( params );

        this.api.getTelemetria( params ).subscribe( result => {

            if( !result || result.carga==null || !result.carga ){
                this.loading = false;
                return;
            }

            this.listB  = [];
            let cargasH = {};

            for( let o of result.carga ){
                cargasH[ o._id.matricula ] = o.carga;
            }
            Object.keys( result.motorista ).forEach( i => {

                if( !cargasH[i] )return;

                let listaB = {};

                listaB['motorista'] = result.motorista[i].motorista;
                listaB['matricula'] = i;
                listaB['jornada']   = this.secondsTohhmmss( cargasH[i] );
                listaB['jornadaB']  = cargasH[i];
                listaB['total']     = 0;
                listaB['1']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Excesso de Velocidade'
                };
                listaB['2']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Rotação Excessiva'
                };
                listaB['3']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Freada Acentuada'
                };
                listaB['4']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Fora da Faixa Econômica'
                };
                listaB['5']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Marcha Lenta Excessiva'
                };
                listaB['7']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    nome: 'Aceleração Brusca'
                };

                Object.keys( result.motorista[i].eventos ).forEach( z => {

                    listaB[z].occor = result.motorista[i].eventos[z].totaloccurs;
                    listaB[z].time  = this.secondsTohhmmss(result.motorista[i].eventos[z].totaltime);
                });
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

        let ERRORS = [];
        if( !this.listB.length ){ alert('Não há dados para exportação!'); return }

        for( let o of this.listB ){

            let object = {};
            object['Matricula']=o.matricula;
            object['Motorista']=o.motorista;
            object['Jornada']=o.jornada;

            object[ `${o['1'].nome}:ocorrencias` ]=o['1'].occor;
            object[ `${o['1'].nome}:tempo` ]=o['1'].time;

            object[ `${o['2'].nome}:ocorrencias` ]=o['2'].occor;
            object[ `${o['2'].nome}:tempo` ]=o['2'].time;

            object[ `${o['3'].nome}:ocorrencias` ]=o['3'].occor;
            object[ `${o['3'].nome}:tempo` ]=o['3'].time;

            object[ `${o['4'].nome}:ocorrencias` ]=o['4'].occor;
            object[ `${o['4'].nome}:tempo` ]=o['4'].time;

            object[ `${o['5'].nome}:ocorrencias` ]=o['5'].occor;
            object[ `${o['5'].nome}:tempo` ]=o['5'].time;

            object[ `${o['7'].nome}:ocorrencias` ]=o['7'].occor;
            object[ `${o['7'].nome}:tempo` ]=o['7'].time;

            ERRORS.push( object );
        }
        this.excelService.exportAsExcelFile( ERRORS, 'telemetria', {BKB: '004'});
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

    ngOnDestroy(){
        this.breadcrumb = false;
    }
}
