import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ExcelService } from '../providers/excel.service';
import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';
import * as async from 'async';

@Component({
    selector: 'app-outroad',
    templateUrl: './outroad.component.html',
    styleUrls: ['./outroad.component.scss']
})
export class OutroadComponent implements OnInit, OnDestroy{

    public dia: string = moment().format('YYYY-MM-DD');
    public linha: string = '';
    public order: string = '';
    public reverse: boolean = false;
    public eventos: Array<any> = [];
    public linhas: Array<any> = [];
    public loading: Boolean = false;

    public searchMot:string = '';
    public searchCar:string = '';
    public searchDirc:string = '';
    public searchLine:string = '';
    public searchStatus:string = '';

    public site: string = 'rota';

    constructor(
        private api:            Api,
        private router:         Router,
        private actroute:       ActivatedRoute,
        private orderPipe:      OrderPipe,
        private modalService:   NgbModal,
        private titulo:         Title,
        private excelService: ExcelService
    ){}

    public logoof(){

        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    public setOrder( value: string ):void{

        if (this.order === value){
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    public onLoadEvents():void{
        this.loadEvents(this.dia, this.linha);
    }

    public ajustDate(value:any):string{
        return moment( value ).format('HH:mm:ss');
    }

    public openEventDel( data ):void{
        //this.remove( data );
    }

    public openEventMap( data:any ):void{
        this.router.navigate([ 'mapoutroad', { evento:data._id }]);
        this.remove( data._id );
    }

    private remove( id: string ):void{
        this.api.removeOccorrence({ id:id }).subscribe(res => console.log( res ));
    }

    public openEventExcel( data:any ):void{

        this.loading = true;

        this.api.getOutLines( data ).subscribe( res => {

            if( !res || res==null || !res.length ){

                this.loading = false;
                alert('Dados não encontrados!');

            }else{

                let FUGA = [];
                let _self = this;

                async.eachSeries( res, ( item, callback ) => {

                    _self.api.reverse({ lat: item.geometry.coordinates[1], lng: item.geometry.coordinates[0] }).subscribe(_res => {

                        FUGA.push({

                            'Veículo': item.alocacao.numero_carro,
                            'Linha': item.alocacao.numero_linha,
                            'Endereço': _res,
                            'Velocidade': item.velocity,
                            'Sentido': item.direction,
                            'Data': moment( item.datetime ).format( 'DD/MM/YYYY HH:mm:ss' )
                        });

                        callback();
                    });

                }, function done(){

                    _self.excelService.exportAsExcelFile( FUGA, 'Fuga de rota', {BKB: '002'});
                    _self.loading = false;
                    _self.remove( data._id );
                });
            }
        });
    }

    private loadLinhas():void{

        this.api.getLines().subscribe( res => {
            this.linhas = res;
        });
    }

    private loadEvents( day:string, linha:string ):void{

        this.loading = true;
        this.eventos=[];

        if( !day ){
            alert( 'Selecione um data válida' );
            this.loading = false;
            return;
        }
        if( !linha )linha = '';
        this.api.getEventsInRoad({ day:day, linha:linha }).subscribe( res => {

            if( res.error ){

                alert(res.error);
                this.loading = false;

            }else{

                for( let i of res ){
                    i['nome_motorista']=i.alocacao.nome_motorista;
                    i['numero_carro']=i.alocacao.numero_carro;
                    i['numero_linha']=i.alocacao.numero_linha;
                    this.eventos.push( i );
                }
                this.loading = false;
            }
        });
    }

    ngOnInit(){
        this.loadLinhas();
        this.loadEvents( this.dia, '' );
    }
    ngOnDestroy(){}
}
