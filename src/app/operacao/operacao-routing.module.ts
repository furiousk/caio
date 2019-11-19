import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { OperacaoComponent }     from './operacao.component';
import { AuthGuard }             from '../guards/auth.guard';

const operacaoRoutes: Routes = [
    { path: '', component: OperacaoComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( operacaoRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class OperacaoRoutingModule{}
