import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { TelemetriaRankingComponent }   from './telemetria-ranking.component';
import { AuthGuard }             from '../guards/auth.guard';

const telemetriaRankingRoutes: Routes = [
    { path: '', component: TelemetriaRankingComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( telemetriaRankingRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class TelemetriaRankingRoutingModule{}
