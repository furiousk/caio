import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { OutroadComponent }      from './outroad.component';
import { AuthGuard }             from '../guards/auth.guard';

const outroadRoutes: Routes = [
    { path: '', component: OutroadComponent, canLoad: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild( outroadRoutes )
    ],
    exports: [
        RouterModule
    ]
})

export class OutroadRoutingModule{}
