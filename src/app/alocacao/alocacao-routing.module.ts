import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { AlocacaoComponent }     from './alocacao.component';
import { AuthGuard }             from '../guards/auth.guard';

const alocacaoRoutes: Routes = [
    { path: '', component: AlocacaoComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( alocacaoRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class AlocacaoRoutingModule{}
