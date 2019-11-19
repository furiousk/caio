import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { MapsComponent }         from './maps.component';
import { AuthGuard }             from '../guards/auth.guard';

const mapsRoutes: Routes = [
    { path: '', component: MapsComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( mapsRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class MapsRoutingModule {}
