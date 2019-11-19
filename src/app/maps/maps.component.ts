import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Api }               from '../providers/api';
import { Sessao }            from '../providers/sessao';
import { Leaflet }           from '../providers/leaflet';
import { Icon }              from '../providers/util';
import { Baloon }            from '../providers/util';
import { ExcelService }      from '../providers/excel.service';
//import { SocketService }     from "../providers/socket.service";

import { InfoCarsModal }     from '../modal/info_cars';
import { InfoSinoticModal }  from '../modal/info_sinotic';

import * as _       from "lodash";
import * as moment  from 'moment-timezone';
import * as async   from 'async';

declare var L:any;

export enum KEY_CODE{
    F5 = 116,
    ESC = 27
}

@Component({

    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MapsComponent implements OnInit, OnDestroy{

    @HostListener('window:keyup', ['$event'])
    //@ViewChild( InfoSinoticModal ) __sinotico;

    keyEvent(event: KeyboardEvent){
        this.eventsKeys(event.keyCode);
    }

/*================start variáveis do layout ==================*/

    public findl: string = '';
    public findv: string = '';
    public findr: string = '';
    public parDateIni: string = '';
    public parDateFim: string = '';
    public mopen: number = 0;
    public vopen: number = 0;
    public lopen: number = 0;
    public gopen: number = 0;
    public copen: number = 0;
    public smopen: number = 0;
    public emopen: number = 0;
    public wopen: any = {};
    public ropen: boolean = false;
    public linked: boolean = false;

    public listv: Array<any> = [];
    public listl: Array<any> = [];
    public rastreioPorTipo: string = 'linha';
    public allVehicles: boolean = false;
    public allLines: boolean = false;
    public eventos: any = {};

    public mask: Array<any> = [ /[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/ ];

    public rastreioPt0: boolean = true;
    public loading: Boolean = false;

/*================end variáveis do layout ==================*/

/*================start variáveis de sessao ==================*/

    private veiculos:   any = {};
    private linhas:     any = {};
    private sinoticos:  any = {};

    private postimer1:  any = null;
    private postimer2:  any = null;
    private postimer3:  any = null;
    private postimer4:  any = null;
    private bound:      any = null;

    public rveiculos:   Array<any> = [];
    public aveiculos:   Array<any> = [];
    public alinhas:     Array<any> = [];
    public rlinhas:     Array<any> = [];
    public slinhas:     Array<any> = [];

    private layers:     Object = {};
    private rastreio:   any = {};
    private termin:     Object = {};
    public _time:       number = 30;
    private _timer:     number = 10000;
    private _cercaCtrl: Object = {};
    public __show:      string = '';
    public _hidden:    boolean = true;
    public __sinotico:     any = {};
    public currentYear: string;

/*================end variáveis do sessao ==================*/

    constructor(
        private api:            Api,
        private __map:          Leaflet,
        private _icon:          Icon,
        private _baloon:        Baloon,
        private router:         Router,
        private excelService:   ExcelService,
        private modalService:   NgbModal,
        private titulo:         Title
        //private socket:  SocketService
    ){ this.currentYear=moment().format('YYYY') }

    public _close(): void{
        this._hidden = true;
    }

    public _show(): void{
        this._hidden = false;
    }

    public showMenu( data:any ){
        return this.__show === data;
    }

    public _toggle():void{
        if( !this._hidden ){
            this._close();
        }else{
            this._show();
        }
    }

    public update( obj ): void{

        let keys = {
            'short':[],
            'placa':[]
        };

        this.bound = null;

        Object.keys( obj ).forEach( v => {

            if( !!obj[v] && !!obj[v].marker ){}else{

                obj[v]['follow']  = false;
                obj[v]['bound']   = false;
                obj[v]['trip']    = {};

                let tipo = this.showIcons( obj[v].tipo );

                let Icon = this._icon.getIconWithParams({

                    speed: 0,
                    heading: '0',
                    color_seta: '#000',
                    color_inter: '#0c0770',
                    key: tipo,
                    url: "#fff",
                    follow: false
                });

                let _mico = new Icon({ labelText: obj[v].prefixo });
                let _self = this;

                obj[v]['marker'] = L.marker( [0,0], {icon: _mico} );
                obj[v]['marker'].on( 'click', () => {

                    _self.showDisplay( obj[v] );
                });

                obj[v]['marker']['type']        = tipo;
                obj[v]['marker']['speed']       = 0;
                obj[v]['marker']['heading']     = '0';
                obj[v]['marker']['color_seta']  = '#000';
                obj[v]['marker']['color_inter'] = '#0c0770';
                obj[v]['marker']['numero']      = 'Sincronizando...';

                this.__map.loadMap().addLayer( obj[v].marker );
                obj[v].marker.dragging.enable();
            }
            keys['short'].push( parseInt( obj[v].mixID ) );
            keys['placa'].push( obj[v].placa );

        });

        if( !!keys['short'].length ){

            this.mountInterval( keys, obj );
            this.seachVehicle( keys, obj );
            this.loadAloc( keys['short'] );
        }
    }

    public showDisplay( obj ){

        let modal: NgbModalRef = this.modalService.open( InfoCarsModal, { size: 'lg' });

        ( <InfoCarsModal>modal.componentInstance ).data = this.veiculos[ obj.mixID ];

        modal.result.then( result => {

            if( !result )return;
            if( !result.type )return;

            if( result.type==='rastrear' ){

                this.rastrear( this.veiculos[ result.id ], result.timer );

            }else if( result.type==='seguir' ){

                this.follow( result.id );

            }else if( result.type==='opentrip' ){

                console.log( result );

                this.openTrip( result );
            }

        }, (reason) => {

            console.log(reason);
        });
    }

    public showSinotic( obj ){
        this.__sinotico = obj;
        this._show();
    }

    private mountInterval( keys, obj ){

        if( this.postimer1===null && this.postimer2===null ){

            this.postimer1 = setInterval(() => { this.seachVehicle( keys, obj ); }, this._timer);
            this.postimer2 = setInterval(() => { this.loadAloc( keys['short'] ); }, this._timer);

        }else{

            let _self = this;
            this.clear(() => {

                _self.postimer1 = setInterval(() => { _self.seachVehicle( keys, obj ); }, _self._timer);
                _self.postimer2 = setInterval(() => { _self.loadAloc( keys['short'] ); }, _self._timer);
            });
        }
    }

    private seachVehicle( ids, obj ): void{

        this.api.getVehicle( ids ).subscribe( r => {

            if( r.length > 0 ){

                for( let pos of r ){

                    if( !obj[ pos.veiculoMixID ] ){ /*console.log( "veiculo nao instanciado", ids );*/ } else {

                        let lat = parseFloat( pos.geometry.coordinates[1] );
                        let lng = parseFloat( pos.geometry.coordinates[0] );

                        obj[ pos.veiculoMixID ].marker['heading']   = pos.heading||'0';
                        obj[ pos.veiculoMixID ].marker['speed']     = pos.velocity||0;
                        obj[ pos.veiculoMixID ].marker['posicao']   = pos;

                        obj[ pos.veiculoMixID ].marker
                            .setLatLng([ lat, lng ])
                            .update();

                        if( obj[ pos.veiculoMixID ].follow ){

                            if( obj[ pos.veiculoMixID ].bound ){

                                this.__map.loadMap().fitBounds([ obj[ pos.veiculoMixID ].marker.getLatLng() ]);
                                obj[ pos.veiculoMixID ].bound = false;
                            }

                            let bounds = this.__map.loadMap().getBounds();

                            if( obj[ pos.veiculoMixID ].marker.getLatLng().lng > bounds.getEast()-.001
                                || obj[ pos.veiculoMixID ].marker.getLatLng().lng < bounds.getWest()+.001
                                || obj[ pos.veiculoMixID ].marker.getLatLng().lat > bounds.getNorth()-.001
                                || obj[ pos.veiculoMixID ].marker.getLatLng().lat < bounds.getSouth()+.001 ){

                                this.__map.loadMap().panTo(obj[ pos.veiculoMixID ].marker.getLatLng());
                            }
                        }
                    }
                }

                if( this.bound == null ){

                    let bound = [];

                    Object.keys( obj ).forEach( e => {

                        let ll = obj[ e ].marker.getLatLng();

                        if( ll.lat == 0 ){}else{

                            bound.push( obj[ e ].marker.getLatLng() );
                        }
                    });

                    if( bound.length ){

                        this.bound = this.__map.loadMap().fitBounds( bound );
                    }
                }
            }
        });
    }

    private showVehicles( linhas ){

        this.api.getVeiculoAlocado({ linhas: linhas }).subscribe( res_ => {

            if( !res_ || !res_.data || !res_.data.length ){console.log( 'dados de veículos alocados, não encontrados!' )}else{

                for( let i of res_.data ){

                    if( !this.linhas[ res_.linha[ i.placa ] ] ){}else{

                        if( !this.veiculos[ i.mixID ] || !this.veiculos[ i.mixID ].marker || !Object.keys( this.veiculos[ i.mixID ].marker ).length ){}else{
                            this.__map.loadMap().removeLayer( this.veiculos[ i.mixID ].marker );
                        }

                        this.veiculos[ i.mixID ] = i;
                        this.veiculos[ i.mixID ]['linha'] = res_.linha[ i.placa ];

                        if( !this.linhas[ res_.linha[ i.placa ] ].veiculos ){

                            this.linhas[ res_.linha[ i.placa ] ]['veiculos'] = [];
                        }
                        this.linhas[ res_.linha[ i.placa ] ].veiculos.push( i.placa );
                    }
                }
                this.loadObject( this.veiculos, 'veiculo' );
            }
        });
    }

    private loadAloc( keys ){

        this.api.loadPositionAlocado({ carkey: keys }).subscribe( _res => {

            if( !_res.err && !!_res.length ){

                for( let i of _res ){

                    if( !this.veiculos[ i.carro ] )return;
                    if( i.status > 0 ){
                        this.veiculos[ i.carro ].trip = { _placa: true, time: i.time };
                    }else{
                        this.veiculos[ i.carro ].trip = i
                    }
                }
            }

            this.api.getAlocacaoVeiculo({ placa: keys }).subscribe( res_ => {

                Object.keys( this.veiculos ).forEach( i => {

                    let color = '#000';
                    let _val  = _.findIndex( res_, (o) => { return o.numero_carro == this.veiculos[ i ].placa });

                    let _trip = this.veiculos[ i ].trip || {};

                    if( !res_[ _val ] ){}else{

                        if( res_[ _val ].situacao == 'E' || res_[ _val ].situacao == 'X' ){

                            if( !_trip.lado ){

                                color = '#2cd41e';
                            }else if( _trip.lado == 'IDA' ){

                                color = '#46b7ff';
                            }else if( _trip.lado == 'VOLTA' ){

                                color = '#ff0000';
                            }

                        }else{

                            delete this.veiculos[ i ].trip
                        }
                    }

                    this.veiculos[ i ].marker['color_seta'] = color;
                    this.veiculos[ i ].marker['numero']     = this.veiculos[ i ].prefixo;

                    let pos      = this.veiculos[ i ].marker['posicao']||null;
                    let datetime = (pos == null || !pos.datetime) ? null : pos.datetime;
                    let speed    = this.veiculos[ i ].marker['speed'];
                    let heading  = this.veiculos[ i ].marker['heading'];
                    let colors   = this.veiculos[ i ].marker['color_seta'];
                    let colori   = this.veiculos[ i ].marker['color_inter'];
                    let numero   = this.veiculos[ i ].marker['numero'];
                    let tipo     = this.veiculos[ i ].marker['type'];
                    let timer    = 0;
                    let follow   = this.veiculos[ i ].follow;

                    if( !this.veiculos[ i ].trip || !this.veiculos[ i ].trip._placa ){}else{
                        tipo  = 'Placa';
                        timer = this.veiculos[ i ].trip.time||0;
                    }

                    let key  = this.showIcons( tipo, datetime, timer );

                    let Icon = this._icon.getIconWithParams({

                        speed: speed,
                        heading: heading,
                        color_seta: colors,
                        color_inter: colori,
                        key: key,
                        url: "#fff",
                        follow: follow
                    });

                    let _mico = new Icon( { labelText: numero } );

                    this.veiculos[ i ].marker.setIcon( _mico ).update();
                });
            });
        });
    }

    private showGeofence( rota ){

        let options = {};
        let _r = rota.rota;

        let geojsonFeature = [{

            "type": "Feature",
            "properties": {
                "id": _r[0]._id,
                "name": _r[0].geofence.nome,
                "sentido": _r[0].sentido,
                "popupContent": `${ rota.nome } - ${ rota.prefixo } - ${ _r[0].sentido }`
            },
            "geometry": _r[0].geofence.geometry

        },{

            "type": "Feature",
            "properties": {
                "id": _r[1]._id,
                "name": _r[1].geofence.nome,
                "sentido": _r[1].sentido,
                "popupContent": `${ rota.nome } - ${ rota.prefixo } - ${ _r[1].sentido }`
            },
            "geometry": _r[1].geofence.geometry
        }];

        this.linhas[ rota.numero_linha ]['geofence'] = L.geoJSON( geojsonFeature, {

            style: ( feature ) => {

                switch (feature.properties.sentido){

                    case 'IDA':   return {color: "#0021ff", weight: 6, smoothFactor: 1, opacity: 0.6};
                    case 'VOLTA': return {color: "#ff1f00", weight: 6, smoothFactor: 1, opacity: 0.6};
                }
            },
            onEachFeature: this.onEachFeature

        }).addTo( this.__map.loadMap() );

        this.__map.loadMap().fitBounds( this.linhas[ rota.numero_linha ]['geofence'].getBounds() );
    }

    private loadLinhas(){

        this.api.getLines().subscribe( res => {
            this.listl = res;
        });
    }

    private updateline( obj ){

        let nLinha = [];
        this.clearLayer();

        Object.keys( obj ).forEach( i => {

            nLinha.push( obj[i].numero_linha );
            this.showGeofence( obj[i] );
            this.showTerminal( obj[i] );
        });

        if( !nLinha.length ){}else{
            this.showVehicles( nLinha );
        }
    }

    private showTerminal( rota ){

        let options = {};
        let _r = rota.rota;
        this.linhas[ rota.numero_linha ]['terminal']={};

        for( let o of _r ){

            if( !o.terminal ){}else{

                if( o.terminal.geometry.type === 'Point' ){

                    options = {

                        pointToLayer: (feature, latlng) => {
                            return new L.Circle( latlng, {
                                radius: 120,
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        },
                        style: ( feature ) => {

                            switch (feature.properties.sentido){

                                case 'IDA':   return {color: "#000",fillColor: "#0021ff"};
                                case 'VOLTA': return {color: "#000",fillColor: "#ff1f00"};
                            }
                        },
                        onEachFeature: this.onEachFeature
                    };

                    let geojsonFeature = [{

                        "type": "Feature",
                        "properties": {
                            "id": o._id,
                            "name": o.terminal.nome,
                            "sentido": o.sentido,
                            "popupContent": `${ o.terminal.nome } - ${ rota.prefixo } - ${ o.sentido }`
                        },
                        "geometry": o.terminal.geometry

                    }];

                    this.linhas[ rota.numero_linha ]['terminal'][o.sentido] = L.geoJSON( geojsonFeature, options ).addTo( this.__map.loadMap() );

                }else{

                    let geojsonFeature = [{

                        "type": "Feature",
                        "properties": {
                            "id": o._id,
                            "name": o.terminal.nome,
                            "sentido": o.sentido,
                            "popupContent": `${ rota.descricao } - ${rota.prefixo} - ${o.sentido}`
                        },
                        "geometry": o.terminal.geometry
                    }];

                    this.linhas[ rota.numero_linha ]['terminal'][o.sentido] = L.geoJSON( geojsonFeature, {

                        style: ( feature ) => {

                            switch ( feature.properties.sentido ){

                                case 'IDA':   return {color: "#0021ff"};
                                case 'VOLTA': return {color: "#ff1f00"};
                            }
                        },
                        onEachFeature: this.onEachFeature

                    }).addTo( this.__map.loadMap() );
                }
            }
        }
    }

    public follow( mixID ){

        Object.keys( this.veiculos ).forEach( i => {

            this.veiculos[i].follow = false;
            this.veiculos[i].bound  = false;
        });

        switch( this.linked ){

            case true:

                this.linked = false;
                this.veiculos[ mixID ].follow = false;
                this.veiculos[ mixID ].bound  = false;

            break;

            case false:

                this.linked = true;
                this.veiculos[ mixID ].follow = true;
                this.veiculos[ mixID ].bound  = true;

            break;
        }
    }

    public goEventOutRoad(){
        this.router.navigate([ 'outroad' ]);
    }

    public goTelemErro(){
        this.router.navigate([ 'telemetria-erro' ]);
    }

    public goTelemRank(){
        this.router.navigate([ 'telemetria-ranking' ]);
    }

    public goTelemGraf(){
        this.router.navigate([ 'telemetria-grafico' ]);
    }

    public openTrip( obj ){

        if( !obj.hash ){alert( 'preencha o hash!' ); return}
        if( !obj.sentido ){alert( 'preencha o sentido!' ); return}

        this.api.getPositionNearFence({

            carkey: obj.id,
            hash: obj.hash,
            sentido: obj.sentido

        }).subscribe( result => {

            console.log( result );
        });
    }

    public rastrear( obj, timer ){

        this.clearRastreio();

        const params = {
            carkey: [ obj.mixID ],
            diference: timer
        };

        this.api.getAllLoadPos( params ).subscribe( result => {

            if( !result.length ){
                alert( 'Não foram encontradas posições do periodo informado!' );
                this._time = 30;
                return;
            }

            let _rota = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": []
                    },
                    "properties": {
                        "color": '#2461AA'
                    }
                },{
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPoint",
                        "coordinates": []
                    },
                    "properties": {
                        "radius": 7,
                        "color": '#2461AA'
                    },
                    "bbox": {}
                }]
            };

            let arrayA = [];
            let _time  = [];
            let _speed = [];
            let _isAvl = [];
            let _pid   = [];
            let _self  = this;

            for( let item of result ){

                const { geometry:{ coordinates }, datetime, velocity, isavl, _id } = item;

                arrayA.push([
                    parseFloat(coordinates[1]),
                    parseFloat(coordinates[0])
                ]);

                let arrayB = [
                    parseFloat(coordinates[0]),
                    parseFloat(coordinates[1])
                ];

                const time = moment(datetime).valueOf();

                _rota.features[0].geometry.coordinates.push( arrayB );
                _rota.features[1].geometry.coordinates.push( arrayB );

                _time.push( time );
                _speed.push( velocity );
                _isAvl.push( isavl );
                _pid.push( _id );
            }
            _rota.features[1].properties['time']  = _time;
            _rota.features[1].properties['speed'] = _speed;
            _rota.features[1].properties['isavl'] = _isAvl;
            _rota.features[1].properties['pid']   = _pid;

            _rota.features[1]['bbox'] = _self.veiculos[ obj.mixID ];

            if( !arrayA.length ){}else{ _self.__map.loadMap().fitBounds( arrayA ); }

            _self.veiculos[ obj.mixID ]['rastreio'] = L.geoJSON( _rota, {

                pointToLayer: ( feat, ll ) => {

                    let key   = _self.__map.arrayContainsArray( feat.geometry.coordinates, [ ll.lng, ll.lat ] );
                    //let _cor  = ( feat.properties.isavl[ key ] ) ? '#1a0582' : '#c82110';
                    let _cor  = '#1a0582';
                    feat.properties.color = _cor;
                    let marker = new L.CircleMarker( ll, feat.properties );

                    marker.on('click', function( ev ){
                        _self.__map.setClickPoint( ll, feat, this );
                    });

                    return marker;
                }

            }).addTo( _self.__map.loadMap() );

            this.ropen = true;
            this._time = 30;
        });
    }

    public erase(){

        this.ropen = false;
        this.clearRastreio();
    }

    public logoof(){

        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    public open( type ){

        switch( type ){

            case 'vopen':
                //this.mopen = 0;
                (this.vopen > 0)?this.vopen=0:this.vopen=370;
                this.lopen = 0;
                //this.gopen = 0;
                this.copen = 0;
            break;

            case 'lopen':
                //this.mopen = 0;
                this.vopen = 0;
                (this.lopen > 0)?this.lopen=0:this.lopen=370;
                //this.gopen = 0;
                this.copen = 0;
            break;

            case 'copen':
                //this.mopen = 0;
                this.vopen = 0;
                this.lopen = 0;
                (this.copen > 0)?this.copen=0:this.copen=370;
            break;
        }
    }

    public setMenu( type ){

        switch( type ){

            case 'smopen':
                (this.smopen > 0)?this.smopen=0:this.smopen=121;
            break;

            case 'emopen':
                (this.emopen > 0)?this.emopen=0:this.emopen=41;
            break;
        }
    }

    public show( open ){

        return (open > 0) ? false : true;
    }

    public openView( litem ){

        if( !!this.wopen[litem.numero_linha] ){
            this.wopen[litem.numero_linha]=false;
        }else{
            this.wopen[litem.numero_linha]=true;
        }
        return this.wopen[litem.numero_linha];
    }

    public rshow( model ){
        if( parseInt( model ) ){
            return true;
        }
        return false;
    }

    public vselect( veiculo ){

        if( !!this.veiculos[ veiculo.mixID ] && !!Object.keys( this.veiculos[ veiculo.mixID ].marker ).length ){

            this.findv = '';
            this.loadObject( this.veiculos, 'veiculo' );

        }else{

            this.veiculos[ veiculo.mixID ] = veiculo;
            this.findv = '';
            this.loadObject( this.veiculos, 'veiculo' );
        }
    }

    public lselect( linha ){

        this.setTitle( `ITS - Linha: ${ linha.numero_linha }` );

        this.linhas[ linha.numero_linha ] = linha;
        this.linhas[ linha.numero_linha ]['foraplan'] = true;
        this.linhas[ linha.numero_linha ]['sentidoida'] = true;
        this.linhas[ linha.numero_linha ]['sentidovolta'] = true;
        this.linhas[ linha.numero_linha ]['terminalida'] = true;
        this.linhas[ linha.numero_linha ]['terminalvolta'] = true;
        this.linhas[ linha.numero_linha ]['carrosida'] = true;
        this.linhas[ linha.numero_linha ]['carrosvolta'] = true;
        this.findl = '';
        this.loadObject( this.linhas, 'linha' );
    }

    public sinotico( linha ){
        this.setTitle( `ITS - Linha: ${ linha.numero_linha }` );
        this.sinoticos[ linha.numero_linha ] = linha;
        this.findl = '';
        this.loadObject( this.sinoticos, 'sinotico' );
        this.showSinotic( this.sinoticos );
    }

    public lselectall( ev ){

        if( !ev.target.checked ){

            this.clearAllLine();

        }else{

            this.allVehicles = false;
            this.clearAllVehicle();

            this.linhas = {};
            this.listl.forEach( linha => {

                this.linhas[ linha.numero_linha ] = linha;
                this.linhas[ linha.numero_linha ]['foraplan'] = true;
                this.linhas[ linha.numero_linha ]['sentidoida'] = true;
                this.linhas[ linha.numero_linha ]['sentidovolta'] = true;
                this.linhas[ linha.numero_linha ]['terminalida'] = true;
                this.linhas[ linha.numero_linha ]['terminalvolta'] = true;
                this.linhas[ linha.numero_linha ]['carrosida'] = true;
                this.linhas[ linha.numero_linha ]['carrosvolta'] = true;
            });

            this.loadObject( this.linhas, 'linha' );
            this.findl = '';
        }
    }

    public vselectall(ev){
        if( !ev.target.checked ){
            this.clearAllVehicle();
        }else{

            this.allLines = false;
            this.clearAllLine();

            this.veiculos = {};
            this.listv.forEach( v => {
                this.veiculos[v.mixID] = v;
            });
            this.loadObject( this.veiculos, 'veiculo' );
            this.findv = '';
        }
    }

    private clearAllVehicle(){
        this.clear( () => {
            this.clearRastreio();
            this.clearMarkers(null, () => {
                this.loadObject( this.veiculos, 'veiculo' );
            });
        });
    }

    private clearAllLine(){

        this.clear( () => {

            this.clearRastreio();
            this.clearMarkers( null, () => {

                Object.keys( this.linhas ).forEach( i => {

                    this.linhas[ i ].geofence.clearLayers();
                    this.linhas[ i ].terminal.IDA.clearLayers();
                    this.linhas[ i ].terminal.VOLTA.clearLayers();
                });
                this.linhas = {};
                this.veiculos = {};
                this.loadObject( this.linhas, 'linha' );
                this.loadObject( this.veiculos, 'veiculo' );
            });
        });
    }

    public remove( entitieID, model ){

        this.setTitle( `ITS - Mapa` );
        let _self = this;

        if( model=='veiculo' ){

            _self.clearRastreioUnique( entitieID );
            _self.clearMarkers( entitieID, () => {
                _self.clear( () => {
                    _self.loadObject( _self.veiculos, model );
                });
            });
            console.log( 'remove',entitieID );

        }else if( model=='linha' ){

            this.clear(() => {

                this.linhas[ entitieID ].geofence.clearLayers();
                this.linhas[ entitieID ].terminal.IDA.clearLayers();
                this.linhas[ entitieID ].terminal.VOLTA.clearLayers();

                Object.keys( this.veiculos ).forEach( i => {

                    if( this.veiculos[ i ].linha == entitieID ){

                        this.clearRastreioUnique( i );
                        this.clearMarkers( i, () => {
                            console.log( 'remove', i );
                        });
                    }
                });
                delete this.linhas[ entitieID ];
                this.loadObject( this.linhas, 'linha' );
                this.loadObject( this.veiculos, 'veiculo' );
            });

        }else if( model=='sinotico' ){

            delete this.sinoticos[ entitieID ];
            this.loadObject( this.sinoticos, 'sinotico' );
            this._close();
        }
    }

    public check( ev, entitieID, model ){

        this.linhas[entitieID][model] = ev.target.checked;
        this.renderLayers(this.linhas[entitieID]);
        this.while( this.linhas[entitieID] );
    }

    public rastreopt(model){
        this.rastreioPorTipo = model;
    }

    private renderLayers( model ){

        let _self = this;

        if( !model.sentidoida ){
            model.geofence.eachLayer( function( layer ){
                if( layer.feature.properties.sentido==="IDA" ){
                    _self.__map.loadMap().removeLayer( layer );
                }
            });
        }else{
            model.geofence.eachLayer( function( layer ){
                if( layer.feature.properties.sentido==="IDA" ){
                    _self.__map.loadMap().addLayer( layer );
                }
            });
        }
        if( !model.sentidovolta ){
            model.geofence.eachLayer( function( layer ){
                if( layer.feature.properties.sentido==="VOLTA" ){
                    _self.__map.loadMap().removeLayer( layer );
                }
            });
        }else{
            model.geofence.eachLayer( function( layer ){
                if( layer.feature.properties.sentido==="VOLTA" ){
                    _self.__map.loadMap().addLayer( layer );
                }
            });
        }

        if( !model.terminalida ){
            _self.__map.loadMap().removeLayer( model.terminal.IDA );
        }else{
            _self.__map.loadMap().addLayer( model.terminal.IDA );
        }
        if( !model.terminalvolta ){
            _self.__map.loadMap().removeLayer( model.terminal.VOLTA );
        }else{
            _self.__map.loadMap().addLayer( model.terminal.VOLTA );
        }
    }

    private while( model ){
        Object.keys( this.veiculos ).forEach( i => {
            if( !Object.keys(this.veiculos[i]).length ){}else{

                if( this.veiculos[i].linha == model.numero_linha ){
                    if( !model.foraplan ){
                        if( !this.veiculos[i].trip || !this.veiculos[i].trip.lado ){
                            this.__map.loadMap().removeLayer( this.veiculos[i].marker );
                        }
                    }else{
                        if( !this.veiculos[i].trip || !this.veiculos[i].trip.lado ){
                            this.__map.loadMap().addLayer( this.veiculos[i].marker );
                        }
                    }
                }

                if( !!this.veiculos[i].trip ){
                    if( !!Object.keys( this.veiculos[i].trip ).length ){

                        if( this.veiculos[i].linha == model.numero_linha ){

                            if( !model.carrosida ){

                                if( this.veiculos[i].trip.lado=='IDA' ){
                                    this.__map.loadMap().removeLayer( this.veiculos[i].marker );
                                }
                            }else{
                                if( this.veiculos[i].trip.lado=='IDA' ){
                                    this.__map.loadMap().addLayer( this.veiculos[i].marker );
                                }
                            }//foraplan

                            if( !model.carrosvolta ){
                                if( this.veiculos[i].trip.lado=='VOLTA' ){
                                    this.__map.loadMap().removeLayer( this.veiculos[i].marker );
                                }
                            }else{
                                if( this.veiculos[i].trip.lado=='VOLTA' ){
                                    this.__map.loadMap().addLayer( this.veiculos[i].marker );
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    private clearRastreio(){

        this.ropen = false;
        Object.keys( this.veiculos ).forEach( i => {
            if( !Object.keys(this.veiculos[i]).length ){}else{
                if( !!this.veiculos[i].rastreio ){
                    if( !!Object.keys( this.veiculos[i].rastreio ).length ){
                        this.veiculos[i].rastreio.clearLayers();
                        this.veiculos[i].rastreio = {};
                    }
                }
            }
        });
    }

    private clearRastreioUnique(key){

        this.ropen = false;
        if( !this.veiculos[key] || !this.veiculos[key].rastreio ){
            console.log( 'veiculo mixID:', key, 'não possui rastreamento rápido!!!' );
        }else{
            if( !Object.keys(this.veiculos[key].rastreio).length )return;
            this.veiculos[key].rastreio.clearLayers();
            this.veiculos[key].rastreio = {};
        }
    }

    public maxLength( text, length ){
        if( !text )return '';
        let _text = `${ text }`;
        return _text.substring( 0, length );
    }

    private loadVeiculos(){

        this.api.getVehicles().subscribe((res) => {
            this.listv = res;
        });
    }

    private rloadObject( obj ){

        this.rlinhas   = [];
        this.rveiculos = [];

        if( !Object.keys( obj.linha ).length ){

            if(!obj.veiculo || !Object.keys( obj.veiculo ).length ){ return; }

            Object.keys( obj.veiculo ).forEach( v => {
                this.rveiculos.push( obj.veiculo[ v ] );
            });

        }else{

            Object.keys( obj.linha ).forEach( v => {
                this.rlinhas.push( obj.linha[ v ] );
            });
        }
    }

    private loadObject( obj, model ){

        if( model == 'veiculo' ){

            this.aveiculos = [];
            this.update( obj );

        }else if( model == 'linha' ){

            this.alinhas = [];
            this.updateline( obj );

        }else if( model == 'sinotico' ){

            this.slinhas = [];
            //this.updateline( obj );
        }

        Object.keys( obj ).forEach( v => {

            if( model == 'veiculo' ){

                this.aveiculos.push( obj[ v ] );

            }else if( model == 'linha' ){

                obj[ v ]['veiculos'] = [];
                this.alinhas.push( obj[ v ] );

            }else if( model == 'sinotico' ){

                obj[ v ]['veiculos'] = [];
                this.slinhas.push( obj[ v ] );
            }
        });
    }

    private clearMarkers( objID, callback? ){

        if( objID === null ){

            Object.keys( this.veiculos ).forEach( i => {
                this.__map.loadMap().removeLayer( this.veiculos[ i ].marker );
                delete this.veiculos[ i ].trip;
                delete this.veiculos[ i ].marker;
                delete this.veiculos[ i ].follow;
                delete this.veiculos[ i ].bound;
                delete this.veiculos[ i ];
            });
            callback();

        }else{

            this.__map.loadMap().removeLayer( this.veiculos[ objID ].marker );
            delete this.veiculos[ objID ].trip;
            delete this.veiculos[ objID ].marker;
            delete this.veiculos[ objID ].follow;
            delete this.veiculos[ objID ].bound;
            delete this.veiculos[ objID ];
            callback();
        }
    }

    public showClear(){

        return !!Object.keys(this.rastreio).length;
    }

    private onEachFeature(feature, layer){

        if( feature.properties && feature.properties.popupContent ){
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    private showIcons( type, time?, placa? ){

        if( !time || time==null ){}else{

            let t = this.diffTime( time );

            if( t > 23 ){
                type = {key:'manutencao',text:''};
            }else if( t > 0 ){
                type = {key:'atrasado',text:this.pad_with_zeroes(t,2), color: 'red'};
            }else if( t < 0 ){
                t = ( t * ( -1 ) );
                type = {key:'atrasado',text:this.pad_with_zeroes(t,2), color: 'blue'};
            }
        }

        switch( type ){
            case 'Ônibus':
                return {key:'onibus',text:''};
            case 'Passeio':
                return {key:'passeio',text:''};
            case 'Caminhão':
                return {key:'caminhao',text:''};
            case 'Socorro':
                return {key:'socorro',text:''};
            case 'Motocicleta':
                return {key:'moto',text:''};
            case 'Placa':
                let _placa = this.pad_with_zeroes(placa,2);
                let rplaca = ( parseInt( _placa ) > 99 ) ? '99+' : _placa;
                return {key:'placa', text:rplaca};
            default:
                return type;
        }
    }

    private pad_with_zeroes( number, length ){

        let my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }
        return my_string;
    }

    private diffTime( time ){

        let _date  = new Date(time);
        let _date_ = new Date();

        let duration = moment( _date_ ).diff( _date, 'hours' );

        return duration;
    }

    private clear(callback){

        clearInterval( this.postimer1 );
        clearInterval( this.postimer2 );
        callback();
    }

    private clearLayer(){

        Object.keys( this.linhas ).forEach( i => {
            if(!this.linhas[i].geofence)return;
            this.linhas[i].geofence.clearLayers();
            this.linhas[i].terminal.IDA.clearLayers();
            this.linhas[i].terminal.VOLTA.clearLayers();
            Object.keys( this.veiculos ).forEach( v => {
                if( this.veiculos[v].linha == i ){
                    this.__map.loadMap().removeLayer( this.veiculos[v].marker );
                }
            });
        });
    }

    private getStatus( alocacao ): string{

        if( !alocacao )return '';

        switch( alocacao.situacao ){

            case 'R':
                return 'Recebido(caixa)';
            //break;
            case 'F':
                return 'Finalizada(guia)';
            //break;
            case 'C':
                return 'Cancelada(guia)';
            //break;
            case 'X':
                return 'Alocado(iPad)';
            //break;
            case 'G':
                return 'Nao sei';
            //break;
            case 'E':
                return 'Alocado';
            //break;
        }
    }

    private models(){

        let m1 = moment();

        this.parDateFim = m1.format('DD/MM/YYYY HH:mm');
        this.parDateIni = m1.subtract(1,'h').format('DD/MM/YYYY HH:mm');

    }

    ngOnInit(){

        this.setTitle( 'ITS - Mapa' );
        this.__map.setMap();
        this.__map.setOptionsMap();

        this.loadVeiculos();
        this.loadLinhas();
        this.models();
        //this.watchWarnings();
    }

    ngOnDestroy(){

        clearInterval( this.postimer1 );
        clearInterval( this.postimer2 );
        clearInterval( this.postimer3 );
    }

/*===================eventos do teclado by furious======================*/


    private eventsKeys(code): void{

        switch( code ){

            case KEY_CODE.F5:
                console.log( 'F5' );
            break;

            case KEY_CODE.ESC:
                console.log( 'ESC' );
            break;
        }
    }

/*===================eventos do terminal by furious======================*/

/*
    private watchWarnings(){

        this.socket.getMessage("broadcastFugaderota").subscribe( data => {
            if( !data.msg )return;
            if( !this.veiculos )return;
            if( !Object.keys(this.veiculos).length )return;
            let i: any = JSON.parse( data.msg );
            if( !Object.keys(this.veiculos).includes( i.veiculo ) )return;
            this.eventos[ i.veiculo ]={
                '_fugaderota':i
            };
        });
    }
*/
    public asDate(date):string{
        return moment( date ).tz( 'America/Sao_Paulo' ).format('HH:mm:ss');
    }

    public goTo(vehicle){
        this.__map.loadMap().fitBounds([ this.veiculos[vehicle._fugaderota.veiculo].marker.getLatLng() ]);
    }

    private setTitle( newTitle: string ){
        this.titulo.setTitle( newTitle );
    }

}
