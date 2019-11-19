import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { ModuloComponent }       from './modulo.component';
import { AuthGuard }             from '../guards/auth.guard';

const moduloRoutes: Routes = [
    { path: '', component: ModuloComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( moduloRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class ModuloRoutingModule{}
