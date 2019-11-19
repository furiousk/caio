import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { MainComponent }         from './main.component';

import { AuthGuard }             from '../guards/auth.guard';

const mainRoutes: Routes = [{
    path: '', component: MainComponent , children: [
        { path: '',             loadChildren: 'app/maps/maps.module#MapsModule' }
    ]
}];

@NgModule({
    imports: [
        RouterModule.forChild( mainRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class MainRoutingModule {}
