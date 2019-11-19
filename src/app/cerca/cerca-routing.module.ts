import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { CercaComponent }        from './cerca.component';
import { AuthGuard }             from '../guards/auth.guard';

const cercaRoutes: Routes = [
    { path: '', component: CercaComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( cercaRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class CercaRoutingModule {}
