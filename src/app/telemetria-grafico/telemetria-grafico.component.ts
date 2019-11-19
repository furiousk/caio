import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { OrderPipe } from 'ngx-order-pipe';
import { Api } from '../providers/api';
import { Sessao } from '../providers/sessao';

import * as _ from "lodash";
import * as moment from 'moment-timezone';

@Component({
    selector: 'app-telemetria-grafico',
    templateUrl: './telemetria-grafico.component.html',
    styleUrls: ['./telemetria-grafico.component.scss']
})

export class TelemetriaGraficoComponent implements OnInit, OnDestroy{

    @ViewChild(BaseChartDirective)
    private chart: BaseChartDirective;

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

    public polarAreaChartType:string = 'polarArea';
    public lineChartColors: Array<any> = [{

        backgroundColor: ['rgba(13, 96, 16, 0.65)','rgba(246, 204, 53, 0.65)','rgba(223, 52, 41, 0.65)'],
        borderColor: ['rgba(13, 96, 16, 1)','rgba(246, 204, 53, 1)','rgba(223, 52, 41, 1)'],
        pointBackgroundColor: ['rgba(13, 96, 16, 1)','rgba(246, 204, 53, 1)','rgba(223, 52, 41, 1)'],
        pointBorderColor: ['#fff','#fff','#fff'],
        pointHoverBackgroundColor: ['#fff','#fff','#fff'],
        pointHoverBorderColor: ['rgba(13, 96, 16, 1)','rgba(246, 204, 53, 1)','rgba(223, 52, 41, 1)']

    }];

    public lineChartColorsGeral: Array<any> = [{

        backgroundColor: [
            'rgba(13, 96, 16, 0.65)',
            'rgba(246, 204, 53, 0.65)',
            'rgba(223, 52, 41, 0.65)',
            'rgba(24, 99, 153, 0.65)',
            'rgba(173, 21, 172, 0.65)',
            'rgba(78, 47, 10, 0.65)'
        ],
        borderColor: [
            'rgba(13, 96, 16, 1)',
            'rgba(246, 204, 53, 1)',
            'rgba(223, 52, 41, 1)',
            'rgba(24, 99, 153, 1)',
            'rgba(173, 21, 172, 1)',
            'rgba(78, 47, 10, 1)'
        ],
        pointBackgroundColor: [
            'rgba(13, 96, 16, 1)',
            'rgba(246, 204, 53, 1)',
            'rgba(223, 52, 41, 1)',
            'rgba(24, 99, 153, 1)',
            'rgba(173, 21, 172, 1)',
            'rgba(78, 47, 10, 1)'
        ],
        pointBorderColor: ['#fff','#fff','#fff'],
        pointHoverBackgroundColor: ['#fff','#fff','#fff'],
        pointHoverBorderColor: [
            'rgba(13, 96, 16, 1)',
            'rgba(246, 204, 53, 1)',
            'rgba(223, 52, 41, 1)',
            'rgba(24, 99, 153, 1)',
            'rgba(173, 21, 172, 1)',
            'rgba(78, 47, 10, 1)'
        ]

    }];

    public polarAreaChart: any = {};
    public charts: any = {};
    public loading: Boolean = false;
    public list: Array<any> = [];
    public geral: any = {};
    public breadcrumb: Boolean = false;

    public site: string = 'graficos';

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

    constructor(
        private api:      Api,
        private router:   Router,
        private actroute: ActivatedRoute,
        private orderPipe: OrderPipe
    ){
        this.actroute.params.subscribe( params => {

            if( !params || params==null || !Object.keys( params ).length ){}else{

                this.breadcrumb = true;
                this.param.abaixoD = params.abaixo;
                this.param.acimaD  = params.acima;
                this.telemetry.time_a = params.periodoA;
                this.telemetry.time_b = params.periodoB;

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
            abaixo:this.param.abaixoD,acima:this.param.acimaD,periodoA:this.telemetry.time_a,periodoB:this.telemetry.time_b
        }]);
    }

    public gerar( params ){

        this.loading = true;
        params.eventos=this.loadEvents( params );
        let _self  = this;
        let listaB = {
            '1':{
                peso: _self.param.pEv1,
                nome: 'Excesso de Velocidade'
            },
            '2':{
                peso: _self.param.pEv2,
                nome: 'Rotação Excessiva'
            },
            '3':{
                peso: _self.param.pEv3,
                nome: 'Freada Acentuada'
            },
            '4':{
                peso: _self.param.pEv4,
                nome: 'Fora da Faixa Econômica'
            },
            '5':{
                peso: _self.param.pEv5,
                nome: 'Marcha Lenta Excessiva'
            },
            '7':{
                peso: _self.param.pEv7,
                nome: 'Aceleração Brusca'
            }
        };

        this.api.getTelemetria( params ).subscribe( result => {

            if( !result || result.carga==null || !result.carga ){
                this.loading = false;
                return;
            }

            this.charts = {

                'geral':{
                    '1':0,
                    '2':0,
                    '3':0,
                    '4':0,
                    '5':0,
                    '7':0
                },
                '1':{
                    'green':0,
                    'amber':0,
                    'red':0
                },
                '2':{
                    'green':0,
                    'amber':0,
                    'red':0
                },
                '3':{
                    'green':0,
                    'amber':0,
                    'red':0
                },
                '4':{
                    'green':0,
                    'amber':0,
                    'red':0
                },
                '5':{
                    'green':0,
                    'amber':0,
                    'red':0
                },
                '7':{
                    'green':0,
                    'amber':0,
                    'red':0
                }
            };

            this.geral = {

                '1':0,
                '2':0,
                '3':0,
                '4':0,
                '5':0,
                '7':0
            };

            this.list   = [];
            let cargasH = {};

            for( let o of result.carga ){
                cargasH[ o._id.matricula ] = o.carga;
            }

            Object.keys( result.motorista ).forEach( i => {

                this.list.push( i );

                Object.keys( result.motorista[ i ].eventos ).forEach( x => {

                    let _error = 0;

                    let _par1 = ( result.motorista[i].eventos[x].totaltime / cargasH[i] ) * 100;
                    let _peso = result.motorista[i].eventos[x].totaloccurs * 0.02 * 0.05 * listaB[x].peso;// _par1.toFixed( 2 )
                    let _aprov = 100-_par1;
                    let _erro  = _aprov * _peso;
                    let _fill  = _aprov - _erro;

                    _error = parseFloat( _fill.toFixed( 2 ) );

                    if( _error >= this.param.acimaD ){

                        this.charts[ x ]['green']++;
                        //this.charts['geral']['green']++;
                    }else if( _error <= this.param.abaixoD ){

                        this.charts[ x ]['red']++;
                        this.geral[ x ]++;
                        //this.charts['geral']['amber']++;
                    }else{

                        this.charts[ x ]['amber']++;
                        //this.charts['geral']['red']++;
                    }
                });
            });
            this.loadGraph();
            this.loading = false;
        });
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

    public chartClicked(e:any):void {
      console.log(e);
    }

    public chartHovered(e:any):void {
      console.log(e);
    }

    private loadEvents(params){

        let array = [];
        if(params.exvel!==false)array.push(params.exvel);
        if(params.exrot!==false)array.push(params.exrot);
        if(params.fread!==false)array.push(params.fread);
        if(params.faixa!==false)array.push(params.faixa);
        if(params.exlent!==false)array.push(params.exlent);
        if(params.acel!==false)array.push(params.acel);
        return array;
    }

    private loadGraph(){

        let charts = {};

        Object.keys( this.charts ).forEach( i => {

            if( i==='geral' ){}else{

                let total = this.list.length;
                let sum   = (this.charts[ i ]['green'] + this.charts[ i ]['amber'] + this.charts[ i ]['red']);
                let ajust = (total - sum);

                this.charts[ i ]['green'] += ajust;

                charts[i]={

                    labels: [this.charts[ i ]['green'], this.charts[ i ]['amber'], this.charts[ i ]['red']],
                    data:   [this.charts[ i ]['green'], this.charts[ i ]['amber'], this.charts[ i ]['red']],
                    legend: true
                };
            }
        });

        charts['geral']={

            labels: [
                'Velocidade Excessiva',
                'Rotação Excessiva',
                'Freada Brusca',
                'Fora da Faixa Econômica',
                'Marcha Lenta Excessiva',
                'Arrancada Brusca'
            ],
            data:   [ this.geral['1'], this.geral['2'], this.geral['3'], this.geral['4'], this.geral['5'], this.geral['7'] ],
            legend: true
        };

        this.polarAreaChart = charts;
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

        this.polarAreaChart['geral']={

            labels: [
                'Velocidade Excessiva',
                'Rotação Excessiva',
                'Freada Brusca',
                'Fora da Faixa Econômica',
                'Marcha Lenta Excessiva',
                'Arrancada Brusca'
            ],
            data:   [0, 0, 0, 0, 0, 0],
            legend: true
        };

        this.polarAreaChart['1']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };

        this.polarAreaChart['2']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };

        this.polarAreaChart['3']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };

        this.polarAreaChart['4']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };

        this.polarAreaChart['5']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };

        this.polarAreaChart['7']={

            labels: ['Green', 'Amber', 'Red'],
            data:   [0, 0, 0],
            legend: true
        };
    }
    ngOnDestroy(){
        this.breadcrumb = false;
    }
}
