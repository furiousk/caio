import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { MapoutroadComponent }   from './mapoutroad.component';
import { AuthGuard }             from '../guards/auth.guard';

const mapoutroadRoutes: Routes = [
    { path: '', component: MapoutroadComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( mapoutroadRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class MapoutroadRoutingModule{}
