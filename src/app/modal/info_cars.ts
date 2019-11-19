import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';

import { Api } from '../providers/api';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'info-cars-modal',
    templateUrl: './info_cars.modal.html',
    styleUrls: ['./alocacao.modal.scss'],
    providers: [NgbProgressbarConfig]
})

export class InfoCarsModal implements OnInit, OnDestroy{

    @Input() data;

    public alocacao:    any = {};
    public postimer:    any = null;
    public html:        any = null;
    public linked:  boolean = false;
    public _time:    Number = 30;
    public _sentido: string = '';
    public _hash:    string = '';
    public ropen:   boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        public config: NgbProgressbarConfig,
        private api: Api
    ){
        //config.max = 98;
        config.striped = true;
        config.animated = true;
        //config.type = 'success';
        //config.height = '20px';
    }

    private selectMarker( ObjectVehicle ){

        let pos     = ObjectVehicle.marker.posicao;
        let latlng  = ObjectVehicle.marker.getLatLng();
        let _self   = this;

        _self.api.getAlocacao({ description: ObjectVehicle.mixID }).subscribe( res_ => {

            let alocacao = res_.data||null;
            let progress = res_.progress||null;
            let line     = res_.line;
            let lado     = ObjectVehicle.trip||null;
            let situacao = _self.getStatus( alocacao );
            let end      = 'localizando endereço...';
            let nearCar  = 'verificando...';
            let nearMet  = 'verificando...';

            if( progress===null ){}else{

                progress['kmlinha']      = progress.kmlinha + 'km';
                progress['kmpercorrido'] = progress.kmpercorrido + 'km';
                //progress['kmpercentual'] = progress.kmpercentual;
            }

            _self.html = {

                title:      `Veículo: ${ ObjectVehicle.placa }`,
                velocidade: pos.velocity,
                time:       `${ pos.date } ${ pos.time }`,
                road:       end,
                lado:       (lado===null)?null:lado.lado,
                alocacao:   alocacao,
                progress:   progress,
                situacao:   situacao,
                line:       line,
                carObj:     ObjectVehicle,
                nearCar:    nearCar,
                nearMet:    nearMet
            };

            _self.api.reverse({ lat:latlng.lat, lng:latlng.lng }).subscribe( _res => {
                _self.html.road = _res;
            });

/*
            _self.api.nearAlocacao({ veiculo: ObjectVehicle.mixID }).subscribe( _res => {
                if( !_res.err ){
                    _self.html.nearCar = _res.carro.placa;
                    _self.html.nearMet = _res.meters;
                }
            });*/
        });
    }

    private getStatus( alocacao ): string{

        if( !alocacao )return '';

        switch( alocacao.situacao ){

            case 'R':
                return 'Recebido(caixa)';
            //break;
            case 'F':
                return 'Finalizado';
            //break;
            case 'C':
                return 'Cancelada(guia)';
            //break;
            case 'N':
                return 'Sem escala';
            //break;
            case 'D':
                return 'Desalocado';
            //break;
            case 'E':
                return 'Alocado';
            //break;
        }
    }

    public checktype( value:number ):string{
        if( value < 30 ){
            return "danger";
        }else if( value > 30 && value < 70 ){
            return "warning";
        }else{
            return "success";
        }
    }

    public checklabel( value:number ):string{
        if( value < 3 ){
            return "Em placa";
        }else if( value > 97 ){
            return "Concluído";
        }else{
            return `${ value }%`;
        }
    }

    ngOnInit(){

        this.selectMarker( this.data );
        this.postimer = setInterval(() => {
            this.selectMarker( this.data );
        }, 10000);
    }

    ngOnDestroy(){

        clearInterval( this.postimer );
    }
}
