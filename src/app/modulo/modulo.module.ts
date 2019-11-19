import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '../filter.module';
import { TextMaskModule }    from 'angular2-text-mask';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { OrderModule } from 'ngx-order-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModuloRoutingModule } from './modulo-routing.module';

import { ModuloComponent } from './modulo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModuloRoutingModule,
        TextMaskModule,
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
    declarations: [ModuloComponent]
})
export class ModuloModule{}
