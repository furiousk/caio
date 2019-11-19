import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { OrderPipe } from 'ngx-order-pipe';
import { Angular2Txt } from 'angular2-txt/Angular2-txt';

import { Api } from '../providers/api';
import { ExcelService } from '../providers/excel.service';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-telemetria-ranking',
    templateUrl: './telemetria-ranking.component.html',
    styleUrls: ['./telemetria-ranking.component.scss'],
    providers: [NgbTooltipConfig]
})

export class TelemetriaRankingComponent implements OnInit, OnDestroy{

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

    public order: string = 'aproveitamento';
    public reverse: boolean = false;
    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ];
    public list: Array<any> = [];
    public listB: Array<any> = [];
    public searchText: String = '';
    public carros: Array<any> = [];
    public loading: Boolean = false;

    public site: string = 'rank';

    public param: any = {
        abaixoD: 70,
        acimaD: 90,
        entreD: '',
        pEv1: 0.1,
        pEv2: 0.1,
        pEv3: 0.1,
        pEv4: 0.1,
        pEv5: 0.1,
        pEv7: 0.1
    };

    public vopen: number = 0;

    private txtOptions = {

        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showTitle: false,
        useBom: true
    };

    constructor(
        private api:      Api,
        private router:   Router,
        private actroute: ActivatedRoute,
        private orderPipe: OrderPipe,
        private excelService: ExcelService
    ){
        this.actroute.params.subscribe( params => {

            if( !params || params==null || !Object.keys( params ).length ){}else{

                this.param.abaixoD = params.abaixo;
                this.param.acimaD  = params.acima;
                this.telemetry.time_a = params.periodoA;
                this.telemetry.time_b = params.periodoB;

                this.gerar( this.telemetry );
            }
        });
    }

    public logoof():void{

        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    public gerar( params:any ){

        this.loading = true;
        params.eventos=this.loadEvents( params );

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
            //console.log( Object.keys( result.motorista ).length );
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
                    peso: this.param.pEv1,
                    nome: 'Excesso de Velocidade'
                };
                listaB['2']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    peso: this.param.pEv2,
                    nome: 'Rotação Excessiva'
                };
                listaB['3']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    peso: this.param.pEv3,
                    nome: 'Freada Acentuada'
                };
                listaB['4']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    peso: this.param.pEv4,
                    nome: 'Fora da Faixa Econômica'
                };
                listaB['5']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    peso: this.param.pEv5,
                    nome: 'Marcha Lenta Excessiva'
                };
                listaB['7']={
                    erros:100,
                    occor: 0,
                    time: 0,
                    peso: this.param.pEv7,
                    nome: 'Aceleração Brusca'
                };

                Object.keys( result.motorista[i].eventos ).forEach( z => {

                    let _par1  = ( result.motorista[i].eventos[z].totaltime / cargasH[i] ) * 100;
                    let _peso  = result.motorista[i].eventos[z].totaloccurs * 0.02 * 0.05 * listaB[z].peso;// _par1.toFixed( 2 )
                    let _aprov = 100-_par1;
                    let _erro  = _aprov * _peso;
                    let _fill  = _aprov - _erro;

                    if( _fill < 1 )_fill=0;
                    let _error = 100-_fill;
                    if(!listaB[z])listaB[z]={};

                    listaB['total'] += _error;
                    listaB[z].erros = parseFloat( _fill.toFixed( 2 ) );
                    listaB[z].occor = result.motorista[i].eventos[z].totaloccurs;
                    listaB[z].time  = this.secondsTohhmmss(result.motorista[i].eventos[z].totaltime);
                });

                listaB['total'] = ( 600-listaB['total'] ) / 6;
                listaB['total'] = parseFloat( listaB['total'].toFixed( 2 ) );
                this.listB.push( listaB );
                this.loading = false;
            });
        });
    }

    public linkErros( motorista:any ):void{
        this.router.navigate(['telemetria-erro', {
            abaixo:this.param.abaixoD,acima:this.param.acimaD,periodoA:this.telemetry.time_a,periodoB:this.telemetry.time_b,motorista:motorista.motorista
        }]);
    }

    public gotoIndicadores():void{
        this.router.navigate(['telemetria-grafico', {
            abaixo:this.param.abaixoD,acima:this.param.acimaD,periodoA:this.telemetry.time_a,periodoB:this.telemetry.time_b
        }]);
    }

    public ajustar(param:any):void{
        this.param.entreD = `${ this.param.abaixoD } / ${ this.param.acimaD }`;
        Sessao.setObjectDB( 'adjust', param );
    }

    public readAjuste():void{
        if( !Sessao.getObjectDB('adjust') || Sessao.getObjectDB('adjust')==null || !Object.keys( Sessao.getObjectDB('adjust') ).length ){}else{
            this.param = Sessao.getObjectDB('adjust');
        }
    }

    public setOrder( value: string ):void{
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    public loadEvents(params:any):Array<any>{

        let array = [];
        if(params.exvel!==false)array.push(params.exvel);
        if(params.exrot!==false)array.push(params.exrot);
        if(params.fread!==false)array.push(params.fread);
        if(params.faixa!==false)array.push(params.faixa);
        if(params.exlent!==false)array.push(params.exlent);
        if(params.acel!==false)array.push(params.acel);
        return array;
    }

    public exportToExcel():void{

        let RANKING = [];
        if( !this.listB.length ){ alert('Não há dados para exportação!'); }else{
            for( let o of this.listB ){

                let object = {};

                object['Matricula']=o.matricula;
                object['Motorista']=o.motorista;
                object['Jornada']=o.jornada;
                object['Excesso de Velocidade']=o['1'].erros;
                object['Rotação Excessiva']=o['2'].erros;
                object['Freada Acentuada']=o['3'].erros;
                object['Fora da Faixa Econômica']=o['4'].erros;
                object['Marcha Lenta Excessiva']=o['5'].erros;
                object['Aceleração Brusca']=o['7'].erros;
                object['total']=o.total;

                RANKING.push( object );
            }
            this.excelService.exportAsExcelFile( RANKING, 'telemetria', {BKB: '005'});
        }
    }

    public exportToText():void{

        let RANKING = [];
        if( !this.listB.length ){ alert('Não há dados para exportação!'); }else{
            for( let o of this.listB ){

                let object = {};

                object['Matricula']=o.matricula;
                object['Motorista']=o.motorista;
                object['Jornada']=o.jornada;
                object['Excesso de Velocidade']=o['1'].erros;
                object['Rotação Excessiva']=o['2'].erros;
                object['Freada Acentuada']=o['3'].erros;
                object['Fora da Faixa Econômica']=o['4'].erros;
                object['Marcha Lenta Excessiva']=o['5'].erros;
                object['Aceleração Brusca']=o['7'].erros;
                object['total']=o.total;

                RANKING.push( object );
            }
            new Angular2Txt( RANKING, `telemetria-${ moment().format('DD/MM/YYYY HH:mm:ss') }`, this.txtOptions );
        }
    }

    private loadVeiculos():void{
        this.api.getVehicles().subscribe((res) => {
            this.carros = res;
        });
    }

    private secondsTohhmmss(totalSeconds:any):string|number{

        let hours   = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        seconds = Math.round(seconds * 100) / 100;

        let result = (hours < 10 ? "0" + hours : hours);
            result += ":" + (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds  < 10 ? "0" + seconds : seconds);

        return result;
    }

    public open( type:any ):void{

        switch( type ){

            case 'vopen':
                (this.vopen > 0)?this.vopen=0:this.vopen=370;
            break;
        }
    }

    public show( open:number ):boolean{
        return (open > 0) ? false : true;
    }

    ngOnInit(){
        this.readAjuste();
        this.param.entreD = `${ this.param.abaixoD } / ${ this.param.acimaD }`;
    }

    ngOnDestroy(){}
}
