import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { RastreioComponent }     from './rastreio.component';
import { AuthGuard }             from '../guards/auth.guard';

const rastreioRoutes: Routes = [
    { path: '', component: RastreioComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( rastreioRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class RastreioRoutingModule{}
