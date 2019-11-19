import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {

    NgbModal,
    ModalDismissReasons,
    NgbModalRef

} from '@ng-bootstrap/ng-bootstrap';

import { OrderPipe } from 'ngx-order-pipe';

import { Api } from '../providers/api';
import { Sessao } from '../providers/sessao';
import { Leaflet } from '../providers/leaflet';
import { Icon } from '../providers/util';
import { Baloon } from '../providers/util';

import { CercaModal } from '../modal/cerca.modal';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

declare var L:any;

@Component({
    selector: 'app-cerca',
    templateUrl: './cerca.component.html',
    styleUrls: ['./cerca.component.scss']
})

export class CercaComponent implements OnInit, OnDestroy {

    private editLayer: any;
    public cercas: Array<any> = [];
    public geofences: any = {};
    public vopen: number = 0;
    public lopen: number = 0;
    public wopen: any = {};

    constructor(
        private _api:           Api,
        private _map:           Leaflet,
        private _icon:          Icon,
        private _baloon:        Baloon,
        private router:         Router,
        private orderPipe:      OrderPipe,
        private modalService:   NgbModal,
        private titulo:         Title
    ){}

    public logoof(){
        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
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

    public maxLength( text, length ){
        if( !text )return '';
        let _text = `${ text }`;
        return _text.substring( 0, length );
    }

    public openCerca( object:any ):void {

        let modal: NgbModalRef = this.modalService.open( CercaModal, { size: 'lg' });

        ( <CercaModal>modal.componentInstance ).name = object;

        modal.result.then( result => {

            console.log( result );
            this._api.createCerca( result.value ).subscribe( i => {
                this.loadGeofences( this.editLayer );
                console.log( i );
            });

        }, (reason) => {

            console.log( reason );
        });
    }

    private loadGeofences(layer:any): void{

        this._api.getCercas().subscribe( i => {

            if( i.length ){

                let options = {};
                let geojsonFeature = {};
                let geoArray = [];
                this.cercas = [];

                for( let o of i ){

                    this.cercas.push({ id: o._id, nome: o.nome, tipo: o.tipo });

                    if( o.geometry.type === 'Point' ){

                        geoArray.push([
                            parseFloat(o.geometry.coordinates[1]),
                            parseFloat(o.geometry.coordinates[0])
                        ]);

                        options = {

                            pointToLayer: function (feature, latlng){

                                return new L.Circle( latlng, {
                                    radius: 200,
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                });
                            },
                            style: function( feature ){

                                switch( feature.properties.tipo ){

                                    case 'LINHA':       return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'TERMINAL':    return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'POI':         return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'GARAGEM':     return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'PEDAGIO':     return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'CONTROLE':    return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'AREA':        return {color: "#f2842a", fillColor: "#f2842a"};
                                    case 'TROCALINHA':  return {color: "#2ac8f2", fillColor: "#2ac8f2"};
                                }
                            },
                            onEachFeature: this.onEachFeature
                        };
                    }

                    geojsonFeature[o._id] = {

                        "type": "Feature",
                        "properties": {
                            "id": o._id,
                            "nome": o.nome,
                            "descricao": o.descricao,
                            "tipo": o.tipo,
                            "velocidade": o.velocidade,
                            "delinha": o.delinha,
                            "paralinha": o.paralinha,
                            "popupContent": `${ o.tipo } - ${ o.nome } - ${ o.descricao }`
                        },
                        "geometry": o.geometry
                    };
                    this.geofences[ o._id ] = L.geoJSON( geojsonFeature[o._id], options );
                }
                console.log(this.cercas);
            }
        });
    }

    private onEachFeature(feature:any, layer:any): void{

        if( feature.properties && feature.properties.popupContent ){
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    private changeObjInArray( obj:any, type:string ): Array<any>{

        let array = [];

        if( type == 'circle' ){

            array = [ obj.lng, obj.lat ];

        }else if( type == 'polyline' ){

            for( let i of obj ){
                array.push( [ i.lng, i.lat ] );
            }

        }else if( type == 'polygon' ){

            array.push([]);
            for( let i of obj[0] ){
                array[0].push( [ i.lng, i.lat ] );
            }
        }
        return array;
    }

    public openView( litem ){

        if( !!this.wopen[litem.id] ){
            this.wopen[litem.id]=false;
        }else{
            this.wopen[litem.id]=true;
        }
        return this.wopen[litem.id];
    }

    public check( ev, ID ){

        if( ev.target.checked ){

            this.editLayer.addLayer( this.geofences[ ID ].getLayers()[0] );
            this._map.loadMap().fitBounds( this.geofences[ ID ].getBounds() );

        }else{

            this.editLayer.removeLayer( this.geofences[ ID ].getLayers()[0] );
            //_self.__map.loadMap().removeLayer( layer );
        }
        console.log( ev, ID );
    }

    ngOnInit(){

        this._map.setMap();

        this.editLayer = this._map.setControls();

        this.loadGeofences( this.editLayer );

        this._map.loadMap().on(L.Draw.Event.CREATED, e => {

            let type      = (e.layerType=='polyline') ? 'LineString' : ((e.layerType=='circle') ? 'Point' : 'Polygon');
            let latlng    = e.layer._latlng||e.layer._latlngs;
            let coordsObj = this.changeObjInArray( latlng, e.layerType );
            let geometry  = { 'geometry': {

                type: type,
                coordinates: coordsObj
            }};
            this.openCerca( geometry );
        });

        this._map.loadMap().on( L.Draw.Event.EDITED, e => {

            let layers = e.layers;

            layers.eachLayer( layer => {

                let _id        = layer.feature.properties.id;
                let name       = layer.feature.properties.nome;
                let descricao  = layer.feature.properties.descricao;
                let tipo       = layer.feature.properties.tipo;
                let velocidade = layer.feature.properties.velocidade;
                let delinha    = layer.feature.properties.delinha;
                let paralinha  = layer.feature.properties.paralinha;

                let latlng    = layer._latlng||layer._latlngs;
                let type      = (layer.feature.geometry.type=='LineString') ? 'polyline': ((layer.feature.geometry.type=='Point') ? 'circle': 'polygon');
                let coordsObj = this.changeObjInArray( latlng, type );
                let geometry  = { 'geometry': {

                    type: layer.feature.geometry.type,
                    coordinates: coordsObj

                },'_id': _id, 'nome': name, 'descricao': descricao, 'tipo': tipo, 'velocidade': velocidade, 'delinha': delinha, 'paralinha': paralinha };

                this.openCerca( geometry );
            });
        });

        this._map.loadMap().on( L.Draw.Event.DELETED, e => {

            let layers = e.layers;

            layers.eachLayer( layer => {

                let _id = layer.feature.properties.id;

                this._api.createCerca({'_id': _id, 'status': false }).subscribe( i => {

                    this.loadGeofences( this.editLayer );

                });
            });
        });
    }
    ngOnDestroy(){}
}
