import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { EventoComponent }       from './evento.component';
import { AuthGuard }             from '../guards/auth.guard';

const eventoRoutes: Routes = [
    { path: '', component: EventoComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( eventoRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class EventoRoutingModule{}
