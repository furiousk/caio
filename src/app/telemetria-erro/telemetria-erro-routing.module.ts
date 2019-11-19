import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { TelemetriaErroComponent }   from './telemetria-erro.component';
import { AuthGuard }             from '../guards/auth.guard';

const telemetriaErroRoutes: Routes = [
    { path: '', component: TelemetriaErroComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( telemetriaErroRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class TelemetriaErroRoutingModule{}
