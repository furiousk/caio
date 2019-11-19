import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TelemetriaRankingRoutingModule } from './telemetria-ranking-routing.module';
import { PipesModule } from '../filter.module';
import { TextMaskModule }    from 'angular2-text-mask';
import { TelemetriaRankingComponent } from './telemetria-ranking.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { OrderModule } from 'ngx-order-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TextMaskModule,
        TelemetriaRankingRoutingModule,
        PipesModule,
        OrderModule,
        NgbModule.forRoot(),
        LoadingModule.forRoot({

            animationType: ANIMATION_TYPES.threeBounce,
            backdropBackgroundColour: 'rgba(255,255,255,0.8)',//'rgba(255,255,255,0.8)',// 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '1px',
            primaryColour: '#e6b157',//'#1fe91b',//'#e6b157',
            secondaryColour: '#b89a3f',
            tertiaryColour: '#b4b091'
        })
    ],
    declarations: [
        TelemetriaRankingComponent
    ]
})
export class TelemetriaRankingModule { }
/*
ANIMATION_TYPES

chasingDots: string;
circle: string;
circleSwish: string;
cubeGrid: string;
doubleBounce: string;
pulse: string;
rectangleBounce: string;
rotatingPlane: string;
threeBounce: string;
wanderingCubes: string;

*/
