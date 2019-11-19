import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { PoiComponent }          from './poi.component';
import { AuthGuard }             from '../guards/auth.guard';

const poiRoutes: Routes = [
    { path: '', component: PoiComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( poiRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class PoiRoutingModule{}
