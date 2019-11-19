import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api }               from '../providers/api';
import { Leaflet }           from '../providers/leaflet';
import { Icon }              from '../providers/util';
import { Baloon }            from '../providers/util';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

declare var L:any;

export enum KEY_CODE{

    F5 = 116,
    ESC = 27
}

@Component({
    selector: 'app-mapoutroad',
    templateUrl: './mapoutroad.component.html',
    styleUrls: ['./mapoutroad.component.scss']
})

export class MapoutroadComponent implements OnInit, OnDestroy{

    constructor(
        private api:            Api,
        private __map:          Leaflet,
        private _icon:          Icon,
        private _baloon:        Baloon,
        private router:         Router,
        private actroute:       ActivatedRoute
    ){
        this.actroute.params.subscribe( params => console.log( params ));
    }

    public logoof(){

        Sessao.removeDB('_token_');
        this.router.navigate(['/']);
    }

    private onLoad(){

        this.actroute.params.subscribe( params => {
            this.api.getOccorrencInRoad( params ).subscribe( data => {
                console.log( data );
                this.showGeofence( data.linha, 1 );
                this.showGeofence( data.ocorrencia.geometry, 2 );
            });
        });
    }

    private showGeofence( rota, type ){

        let options = {};

        let geojsonFeature = {

            "type": "Feature",
            "properties": {},
            "geometry": rota

        };

        let ofence = L.geoJSON( geojsonFeature, {

            style: ( feature ) => {

                if( type==1 ){
                    return {color: "#0021ff", weight: 6, smoothFactor: 1, opacity: 0.6};
                }else{
                    return {color: "#ff1f00", weight: 6, smoothFactor: 1, opacity: 0.6};
                }

            },
            onEachFeature: this.onEachFeature

        }).addTo( this.__map.loadMap() );

        this.__map.loadMap().fitBounds( ofence.getBounds() );
    }

    private onEachFeature(feature, layer){

        if( feature.properties && feature.properties.popupContent ){
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    ngOnInit(){
        this.__map.setMap();
        this.__map.setOptionsMap();
        this.onLoad();
    }
    ngOnDestroy(){}
}
