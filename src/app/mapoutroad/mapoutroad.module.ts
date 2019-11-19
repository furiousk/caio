import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { PipesModule }       from '../filter.module';
import { TextMaskModule }    from 'angular2-text-mask';
import { LimitToDirective }  from '../limit-to.directive';
import {
    LoadingModule,
    ANIMATION_TYPES }        from 'ngx-loading';
import { NgbModule }         from '@ng-bootstrap/ng-bootstrap';
import {
    AngularDraggableModule } from 'angular2-draggable';

import { MapoutroadRoutingModule } from './mapoutroad-routing.module';
import { MapoutroadComponent } from './mapoutroad.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        TextMaskModule,
        AngularDraggableModule,
        NgbModule.forRoot(),
        LoadingModule.forRoot({

            animationType: ANIMATION_TYPES.threeBounce,
            backdropBackgroundColour: 'rgba(255,255,255,0.8)',//'rgba(255,255,255,0.8)',// 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '1px',
            primaryColour: '#e6b157',//'#1fe91b',//'#e6b157',
            secondaryColour: '#b89a3f',
            tertiaryColour: '#b4b091'
        }),
        MapoutroadRoutingModule
    ],
    declarations: [MapoutroadComponent]
})
export class MapoutroadModule { }
