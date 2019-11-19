import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { TelemetriaGraficoComponent }   from './telemetria-grafico.component';
import { AuthGuard }             from '../guards/auth.guard';

const telemetriaGraficoRoutes: Routes = [
    { path: '', component: TelemetriaGraficoComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( telemetriaGraficoRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class TelemetriaGraficoRoutingModule{}
