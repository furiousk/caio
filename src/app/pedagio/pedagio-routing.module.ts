import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { PedagioComponent }      from './pedagio.component';
import { AuthGuard }             from '../guards/auth.guard';

const pedagioRoutes: Routes = [
    { path: '', component: PedagioComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( pedagioRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class PedagioRoutingModule{}
