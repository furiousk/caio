import { NgModule }               from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { MapsRoutingModule }      from './maps-routing.module';
import { MapsComponent }          from './maps.component';
import { PipesModule }            from '../filter.module';
import { TextMaskModule }         from 'angular2-text-mask';
import { LimitToDirective }       from '../limit-to.directive';
import { NgbModule }              from '@ng-bootstrap/ng-bootstrap';
import { AngularDraggableModule } from 'angular2-draggable';
import { InfoCarsModal }          from '../modal/info_cars';
import { InfoSinoticModal }       from '../modal/info_sinotic';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        MapsRoutingModule,
        PipesModule,
        TextMaskModule,
        AngularDraggableModule,
        NgbModule.forRoot()
    ],
    declarations: [
        MapsComponent,
        LimitToDirective,
        InfoCarsModal,
        InfoSinoticModal
    ],
    entryComponents: [
        InfoCarsModal,
        InfoSinoticModal
    ]
})

export class MapsModule {}
