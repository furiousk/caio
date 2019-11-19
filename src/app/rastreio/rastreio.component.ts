import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Api }               from '../providers/api';
import { Sessao }            from '../providers/sessao';
import { Leaflet }           from '../providers/leaflet';
import { Icon }              from '../providers/util';
import { Baloon }            from '../providers/util';
import { ExcelService }      from '../providers/excel.service';

import * as _       from "lodash";
import * as moment  from 'moment-timezone';
import * as async   from 'async';

declare var L:any;

export enum KEY_CODE{

    F5 = 116,
    ESC = 27
}

@Component({
    selector: 'app-rastreio',
    templateUrl: './rastreio.component.html',
    styleUrls: ['./rastreio.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RastreioComponent implements OnInit, OnDestroy{

/*
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent){
        console.log( event );
    }
*/
    private _session_:  Object = {};
    private veiculos:   Object = {
        carkey: [],
        time_a: '',
        time_b: ''
    };

    private linhas:         Object = {};
    private driveModel:     Object = {};

    private bound:          Array<any> = [];
    private points:         Array<any> = [];
    private cars:           Object = {};
    public listv:           Array<any> = [];
    public listl:           Array<any> = [];
    public loading:         boolean = false;

    public _play:           any = {};

    public parDateIni: string = moment().format('YYYY-MM-DD');
    public parDateFim: string = moment().format('YYYY-MM-DD');
    public parHoraIni: string = moment().subtract( 1, 'h' ).format('HH:mm');
    public parHoraFim: string = moment().format('HH:mm');

    public vopen: number = 0;
    public lopen: number = 0;

    public rveiculos:   Array<any> = [];
    public rlinhas:     Array<any> = [];

    public findVeiculo:     string = '';
    public findLinha:       string = '';
    public rastreioPorTipo: string = 'linha';
    public rastreando:      any = {
        veiculo:{},
        linha:{}
    };

    constructor(
        private api:            Api,
        private __map:          Leaflet,
        private _icon:          Icon,
        private _baloon:        Baloon,
        private router:         Router,
        private excelService:   ExcelService,
        private titulo:         Title,
    ){}

    private setTitle( newTitle: string ){
        this.titulo.setTitle( newTitle );
    }

    private loadLinePos( params ){

        this.loading = true;

        this.api.getAllLoadPosLineSnap( params ).subscribe( result => {

            if( result.err ){ this.loading = false; alert( result.err ); return; }
            if( result.length > 0 ){}else{ this.loading = false; alert( "dados não encontrados" ); return; }

            this.clearRastreio();

            for( let i of result ){

                const { veiculoMixID, datetime, velocity, altitude,
                    heading, hdop, isavl, _id, geometry:{ coordinates },
                    direction=null, alocacao=null, linha=null
                } = i;

                if( !this.cars[ veiculoMixID ] ){}else{

                    if( !this.driveModel[ veiculoMixID ] ){

                        this.driveModel[ veiculoMixID ] = {

                            "type": "Feature",
                            "geometry": {
                                "type": "MultiPoint",
                                "coordinates": []
                            },
                            "properties": {
                                "popupContent":[],
                                "title": [],
                                "time": [],
                                "speed": [],
                                "altitude": [],
                                "heading": [],
                                "horizontal_accuracy": [],
                                "vertical_accuracy": [],
                                "isavl": [],
                                "direction": [],
                                "raw": [],
                                "pid": []
                            },
                            "bbox": {},
                            "cbox": [],
                            "dbox": [],
                            "color": "#000"
                        };

                    }else{

                        this.bound.push([
                            coordinates[1],
                            coordinates[0]
                        ]);

                        let time = moment( datetime ).valueOf();

                        this.driveModel[ veiculoMixID ].geometry.coordinates.push( coordinates );
                        this.driveModel[ veiculoMixID ].properties.title = veiculoMixID;
                        this.driveModel[ veiculoMixID ].properties.time.push( time );
                        this.driveModel[ veiculoMixID ].properties.speed.push( velocity );
                        this.driveModel[ veiculoMixID ].properties.heading.push( heading );
                        this.driveModel[ veiculoMixID ].properties.altitude.push( altitude );
                        this.driveModel[ veiculoMixID ].properties.horizontal_accuracy.push( hdop );
                        this.driveModel[ veiculoMixID ].properties.vertical_accuracy.push( 0 );
                        this.driveModel[ veiculoMixID ].properties.isavl.push( isavl );
                        this.driveModel[ veiculoMixID ].properties.pid.push( _id.toString() );
                        this.driveModel[ veiculoMixID ].properties.direction.push( direction );
                        this.driveModel[ veiculoMixID ].bbox = this.cars[ veiculoMixID ];
                        this.driveModel[ veiculoMixID ].cbox = alocacao;
                        this.driveModel[ veiculoMixID ].dbox = linha;
                    }
                }
            }
            this.points = result;
            this._play  = this.__map.setPlayback( this.driveModel );
            this.__map.loadMap().fitBounds( this.bound );
            this.loading = false;
        });
    }

    private loadPos( params ){

        this.loading = true;

        this.api.getAllLoadPosSnap( params ).subscribe( result => {

            if( result.err ){ this.loading = false; alert( result.err ); return; }
            if( result.length > 0 ){}else{ this.loading = false; alert( "dados não encontrados" ); return; }

            this.clearRastreio();

            for( let i of result ){

                const { veiculoMixID, datetime, velocity, altitude,
                    heading, hdop, isavl, _id, geometry:{ coordinates }
                } = i;

                if( !this.driveModel[ veiculoMixID ] ){

                    this.driveModel[ veiculoMixID ] = {

                        "type": "Feature",
                        "geometry": {
                            "type": "MultiPoint",
                            "coordinates": []
                        },
                        "properties": {
                            "title": [],
                            "time": [],
                            "speed": [],
                            "altitude": [],
                            "heading": [],
                            "horizontal_accuracy": [],
                            "vertical_accuracy": [],
                            "isavl": [],
                            "raw": [],
                            "pid": []
                        },
                        "bbox": {},
                        "color": "#000"
                    };

                }else{

                    this.bound.push([coordinates[ 1 ], coordinates[ 0 ]]);

                    let time = moment(`${ datetime }`,'DD/MM/YYYY HH:mm:ss').valueOf();

                    this.driveModel[ veiculoMixID ].geometry.coordinates.push( coordinates );
                    this.driveModel[ veiculoMixID ].properties.title = veiculoMixID;
                    this.driveModel[ veiculoMixID ].properties.time.push( time );
                    this.driveModel[ veiculoMixID ].properties.speed.push( velocity );
                    this.driveModel[ veiculoMixID ].properties.heading.push( heading );
                    this.driveModel[ veiculoMixID ].properties.altitude.push( altitude );
                    this.driveModel[ veiculoMixID ].properties.horizontal_accuracy.push( hdop );
                    this.driveModel[ veiculoMixID ].properties.vertical_accuracy.push( 0 );
                    this.driveModel[ veiculoMixID ].properties.isavl.push( isavl );
                    this.driveModel[ veiculoMixID ].properties.pid.push( _id.toString() );
                    this.driveModel[ veiculoMixID ].bbox = this.cars[ veiculoMixID ];
                }
            }
            this.points = result;
            this._play  = this.__map.setPlayback( this.driveModel );
            this.__map.loadMap().fitBounds( this.bound );
            this.loading = false;
        });
    }

    private clearRastreio(){

        if( !this._play.options ){}else{
            this._play.clearData();
            this._play.clearAllLayers();
            this.driveModel = {};
        }
    }

    private loadVeiculos(){

        this.api.getAllVehicles().subscribe( res => {
            this.listv = res;
            res.map( i => this.cars[i.mixID] = i);
        });
    }

    private loadLinhas(){

        this.api.getLines().subscribe( res => this.listl = res);
    }

    public slider( ev ){

        this._play.setCursor(ev.target.value);
    }

    public getTime(){

        if( !Object.keys( this._play ).length ){
            return 0;
        }else{
            return this._play.getTime();
        }
    }

    public imprimir(){

        this.loading = true;

        if( this.parDateIni === '' ){alert('selecione uma data inicial!');return;}
        if( this.parDateFim === '' ){alert('selecione uma data final!');return;}

        if( this.parHoraIni === '' ){alert('selecione uma hora inicial!');return;}
        if( this.parHoraFim === '' ){alert('selecione uma hora final!');return;}

        let a = moment(`${ this.parDateIni } ${ this.parHoraIni }`,'YYYY-MM-DD HH:mm');
        let b = moment(`${ this.parDateFim } ${ this.parHoraFim }`,'YYYY-MM-DD HH:mm');

        if( a.toString()==='Invalid date' ){ alert('O formato da data inicial, deve ser DD/MM/YYYY HH:mm!');return; }
        if( a.toString()==='Invalid date' ){ alert('O formato da data final, deve ser DD/MM/YYYY HH:mm!');return; }

        let duration = b.diff( moment( a ), 'hours' );
        let interval = b.diff( moment( a ), 'milliseconds' );

        let ini;
        let fim;

        if( duration > 3 ){alert('limite de 3h excedido!');this.loading = false;return;}
        if( interval < 1 ){

            ini = moment(`${ this.parDateFim } ${ this.parHoraFim }`).format('YYYY-MM-DD HH:mm');
            fim = moment(`${ this.parDateIni } ${ this.parHoraIni }`).format('YYYY-MM-DD HH:mm');

        }else{

            fim = moment(`${ this.parDateFim } ${ this.parHoraFim }`).format('YYYY-MM-DD HH:mm');
            ini = moment(`${ this.parDateIni } ${ this.parHoraIni }`).format('YYYY-MM-DD HH:mm');
        }
        let carkey = Object.keys( this.rastreando.veiculo ).map( i => i ).join(',');

        this.api.getAllLoadPosSnap({

            'carkey':  carkey,
            'time_a':  ini,
            'time_b':  fim

        }).subscribe( result => {

            let RASTREAR = [];
            let TYPE = {};
            let _self = this;

            if( !result || result==null || !result.length ){

                this.loading = false;
                alert('Dados não encontrados!');

            }else{

                async.eachSeries( result, ( item, callback ) => {

                    _self.api.reverse({ lat:item.geometry.coordinates[1], lng:item.geometry.coordinates[0] }).subscribe(_res => {

                        if( !item.alocacao ){

                            RASTREAR.push({

                                'Endereço': _res,
                                'Velocidade': item.velocity,
                                'Sentido': item.direction,
                                'Data': moment( item.datetime ).format( 'DD/MM/YYYY HH:mm:ss' )
                            });

                            TYPE = {
                                'Veículo': this.rastreando.veiculo[ item.veiculoMixID ].placa,
                                'Motorista': '',
                                'Linha': '',
                                'BKB': '001'
                            }

                        }else{

                            RASTREAR.push({

                                'Endereço': _res,
                                'Velocidade': item.velocity,
                                'Sentido': item.direction,
                                'Data': moment( item.datetime ).format( 'DD/MM/YYYY HH:mm:ss' )
                            });

                            TYPE = {
                                'Veículo': this.rastreando.veiculo[ item.veiculoMixID ].placa,
                                'Motorista': item.alocacao.nome_motorista,
                                'Linha': item.alocacao.numero_linha,
                                'BKB': '001'
                            }
                        }
                        callback();
                    });

                }, function done(){
                    _self.excelService.exportAsExcelFile( RASTREAR, 'Rastreamento por endereços', TYPE );
                    _self.loading = false;
                });
            }
        });
    }

    public rastreamento(type){

        if( this.parDateIni === '' ){alert('selecione uma data inicial!');return;}
        if( this.parDateFim === '' ){alert('selecione uma data final!');return;}

        if( this.parHoraIni === '' ){alert('selecione uma hora inicial!');return;}
        if( this.parHoraFim === '' ){alert('selecione uma hora final!');return;}

        let a = moment(`${ this.parDateIni } ${ this.parHoraIni }`,'YYYY-MM-DD HH:mm');
        let b = moment(`${ this.parDateFim } ${ this.parHoraFim }`,'YYYY-MM-DD HH:mm');

        if( a.toString()==='Invalid date' ){ alert('O formato da data inicial, deve ser DD/MM/YYYY HH:mm!');return; }
        if( a.toString()==='Invalid date' ){ alert('O formato da data final, deve ser DD/MM/YYYY HH:mm!');return; }

        let duration = b.diff( moment( a ), 'hours' );
        let interval = b.diff( moment( a ), 'milliseconds' );

        let ini;
        let fim;

        if( !Object.keys( this.rastreando.veiculo ).length
            && !Object.keys( this.rastreando.linha ).length ){alert('selecione um veículo ou linha!');return;}

        if( duration > 24 ){alert('limite de 24h excedido!');return;}
        if( interval < 1 ){

            ini = moment(`${ this.parDateFim } ${ this.parHoraFim }`).format('YYYY-MM-DD HH:mm');
            fim = moment(`${ this.parDateIni } ${ this.parHoraIni }`).format('YYYY-MM-DD HH:mm');

        }else{

            fim = moment(`${ this.parDateFim } ${ this.parHoraFim }`).format('YYYY-MM-DD HH:mm');
            ini = moment(`${ this.parDateIni } ${ this.parHoraIni }`).format('YYYY-MM-DD HH:mm');
        }

        if( type==='veiculo' ){

            let carkey = Object.keys( this.rastreando.veiculo ).map( i => i ).join(',');

            this.loadPos({ carkey: carkey, time_a: ini, time_b: fim, veiculo: {} });

        }else if( type==='linha' ){

            let linkey = Object.keys( this.rastreando.linha ).map(i => { return this.rastreando.linha[i]._id }).join(',');

            this.loadLinePos({ linhas: linkey, time_a: ini, time_b: fim, linha: {} });
        }
    }

    public open( type ){

        switch( type ){

            case 'vopen':
                (this.vopen > 0)?this.vopen=0:this.vopen=370;
                this.lopen = 0;
            break;

            case 'lopen':
                this.vopen = 0;
                (this.lopen > 0)?this.lopen=0:this.lopen=370;
            break;
        }
    }

    public show( open ){

        return (open > 0) ? false : true;
    }

    private rloadObject( obj ){

        this.rlinhas   = [];
        this.rveiculos = [];

        if( !Object.keys( obj.linha ).length ){

            if( !obj.veiculo || !Object.keys( obj.veiculo ).length ){ return; }

            Object.keys( obj.veiculo ).forEach( v => {
                this.rveiculos.push( obj.veiculo[ v ] );
            });

        }else{

            Object.keys( obj.linha ).forEach( v => {
                this.rlinhas.push( obj.linha[ v ] );
            });
        }
    }

    public rlselect( linha ){

        if( !this.rastreando.linha ){
            this.rastreando.linha = {}
        }

        if( !this.rastreando.linha[ linha.numero_linha ] ){

            this.rastreando.linha[ linha.numero_linha ] = linha;
            this.findLinha = '';
            this.rastreando.veiculo = {};
            this.rloadObject( this.rastreando );

        }else{

            this.findLinha = '';
        }
    }

    public rselect( veiculo ){

        if( !this.rastreando.veiculo ){
            this.rastreando.veiculo = {}
        }

        if( !this.rastreando.veiculo[ veiculo.mixID ] ){

            this.rastreando.veiculo[ veiculo.mixID ] = veiculo;
            this.findVeiculo = '';
            this.rastreando.linha = {};
            this.rloadObject( this.rastreando );

        }else{

            this.findVeiculo = '';
        }
    }

    public rremove(ID,model){

        if( model=='linha' ){

            if(!!this.rastreando.linha[ID]){
                delete this.rastreando.linha[ID];
            }
        }else if( model=='veiculo' ){

            if(!!this.rastreando.veiculo[ID]){
                delete this.rastreando.veiculo[ID];
            }
        }
        this.rloadObject( this.rastreando );
        this.clearRastreio();
        this.rastreamento(model);
    }

    public maxLength( text, length ){
        return text.substring( 0, length );
    }

    public logoof(){
        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    ngOnInit(){
        this.setTitle( 'ITS - Histórico' );
        this.loadVeiculos();
        this.loadLinhas();
        this.__map.setMap();
        this.__map.setOptionsMap();
        this.__map.setCtrlPlay();
    }
    ngOnDestroy(){}
}
