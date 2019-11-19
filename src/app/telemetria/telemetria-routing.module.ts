import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { TelemetriaComponent }   from './telemetria.component';
import { AuthGuard }             from '../guards/auth.guard';

const telemetriaRoutes: Routes = [
    { path: '', component: TelemetriaComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( telemetriaRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class TelemetriaRoutingModule{}
