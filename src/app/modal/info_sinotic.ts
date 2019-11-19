import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Api } from '../providers/api';

//import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

import { Icon } from '../providers/util';

@Component({
    selector: 'info-sinotic-modal',
    templateUrl: './info_sinotic.modal.html',
    styleUrls: ['./alocacao.modal.scss'],
    //providers: [ NgbProgressbarConfig ]
})

export class InfoSinoticModal implements OnInit, OnDestroy{

    @Input() data: any;

    public alocacao:    any = {};
    public roteiro:     any = {};
    public _timer:    any = null;
    public html:        any = null;
    public linked:  boolean = false;
    public _time:    Number = 30;
    public _sentido: string = '';
    public ropen:   boolean = false;
    public linhas: Array<any> = [];
    public _linhas:     any = {};
    public _icone: Array<any> = [];

    constructor(
        //public activeModal: NgbActiveModal,
        //public config: NgbProgressbarConfig,
        private api: Api,
        private _icon: Icon,
        private sanitizer: DomSanitizer
    ){
        //config.max = 98;
        //config.striped = true;
        //config.animated = true;
        //config.type = 'success';
        //config.height = '20px';
    }

    private loadTrip( linhas ){

        this.api.getVeiculoAlocado({ linhas: linhas }).subscribe( res => {

            this._linhas = {};
            let _perLine = {};

            if( !res.data )return;

            for( let carro of res.data ){

                if( !carro.progress ){}else{

                    if( carro.progress.sentido=='IDA' ){

                        carro['icone'] = this.sanitizer.bypassSecurityTrustResourceUrl( this._icon.getIconHtmlWithParams({

                            speed: 10,
                            heading: '90',
                            color_seta: 'blue',
                            color_inter: '#0c0770',
                            key: {key:"onibus",color:"red"},
                            url: "#fff",
                            follow: false
                        }));
                        carro['percentual'] = parseInt( carro.progress.kmpercentual )-2;

                    }else if( carro.progress.sentido=='VOLTA' ){

                        carro['icone'] = this.sanitizer.bypassSecurityTrustResourceUrl( this._icon.getIconHtmlWithParams({

                            speed: 10,
                            heading: '270',
                            color_seta: 'red',
                            color_inter: '#0c0770',
                            key: {key:"onibus",color:"red"},
                            url: "#fff",
                            follow: false
                        }));
                        carro['percentual'] = parseInt( carro.progress.kmpercentual )+2;
                    }

                    carro['linha'] = res.linha[ carro.placa ];

                    if( !_perLine[ res.linha[ carro.placa ] ] ){

                        _perLine[ res.linha[ carro.placa ] ]={};
                        _perLine[ res.linha[ carro.placa ] ]['IDA'] = [];
                        _perLine[ res.linha[ carro.placa ] ]['VOLTA'] = [];
                        _perLine[ res.linha[ carro.placa ] ]['TERMINAL'] = {
                            'IDA':[],
                            'VOLTA':[]
                        };
                        _perLine[ res.linha[ carro.placa ] ]['ROTEIRO'] = {
                            'IDA':null,
                            'VOLTA':null
                        };

                        if( carro['percentual'] < 1 ){
                            _perLine[ res.linha[ carro.placa ] ]['TERMINAL'][ carro.progress.sentido ].push( carro );
                        }else{
                            _perLine[ res.linha[ carro.placa ] ][ carro.progress.sentido ].push( carro );
                        }
                        this._linhas = _perLine;

                    }else{

                        if( carro['percentual'] < 1 ){
                            _perLine[ res.linha[ carro.placa ] ]['TERMINAL'][ carro.progress.sentido ].push( carro );
                        }else{
                            _perLine[ res.linha[ carro.placa ] ][ carro.progress.sentido ].push( carro );
                        }
                        this._linhas = _perLine;
                    }
                }
            }
        });
    }

    private _getSizeLines( linhas: Array<any> ):void{
        this.api.getSizeLine({ linhas: linhas }).subscribe( i => {
            this.roteiro = i.data||null;
        });
    }

    public monitor( carro: any ): void{
        console.log( carro );
    }

    public ajustDecimal( val ): string{
        return parseFloat( val ).toFixed();
    }

    public _load( data: any ){

        Object.keys( data ).forEach(i => {
            this.linhas.push( i );
        });

        this._timer = setInterval(() => {
            this.loadTrip( this.linhas );
        }, 10000);

        this.loadTrip( this.linhas );
        this._getSizeLines( this.linhas );
    }

    ngOnInit(){
        console.log( 'init', this.data );
        this._load( this.data );
    }

    ngOnDestroy(){
        console.log( 'destroy' );
        clearInterval( this._timer );
    }
}
