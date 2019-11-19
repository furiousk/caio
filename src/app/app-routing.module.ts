import { NgModule }     from '@angular/core';
import {
    RouterModule,
    Routes,
    ExtraOptions
}                       from '@angular/router';
import { AuthGuard }    from './guards/auth.guard';

const appRoutes: Routes = [

    { path: '',                     loadChildren: 'app/login/login.module#LoginModule' },
    { path: 'maps',                 loadChildren: 'app/maps/maps.module#MapsModule', canActivate: [AuthGuard] },
    { path: 'rastreio',             loadChildren: 'app/rastreio/rastreio.module#RastreioModule', canActivate: [AuthGuard] },
    { path: 'telemetria-erro',      loadChildren: 'app/telemetria-erro/telemetria-erro.module#TelemetriaErroModule', canActivate: [AuthGuard] },
    { path: 'telemetria-grafico',   loadChildren: 'app/telemetria-grafico/telemetria-grafico.module#TelemetriaGraficoModule', canActivate: [AuthGuard] },
    { path: 'telemetria-ranking',   loadChildren: 'app/telemetria-ranking/telemetria-ranking.module#TelemetriaRankingModule', canActivate: [AuthGuard] },
    { path: 'telemetria',           loadChildren: 'app/telemetria/telemetria.module#TelemetriaModule', canActivate: [AuthGuard] },
    { path: 'outroad',              loadChildren: 'app/outroad/outroad.module#OutroadModule', canActivate: [AuthGuard] },
    { path: 'mapoutroad',           loadChildren: 'app/mapoutroad/mapoutroad.module#MapoutroadModule', canActivate: [AuthGuard] },
    { path: 'modulo',               loadChildren: 'app/modulo/modulo.module#ModuloModule', canActivate: [AuthGuard] },
    { path: 'evento',               loadChildren: 'app/evento/evento.module#EventoModule', canActivate: [AuthGuard] },
    { path: 'telemodule',           loadChildren: 'app/operacao/operacao.module#OperacaoModule', canActivate: [AuthGuard] },
    { path: 'cerca',                loadChildren: 'app/cerca/cerca.module#CercaModule', canActivate: [AuthGuard] },
    { path: 'pedagio',              loadChildren: 'app/pedagio/pedagio.module#PedagioModule', canActivate: [AuthGuard] },
    { path: 'poi',                  loadChildren: 'app/poi/poi.module#PoiModule', canActivate: [AuthGuard] },
    { path: 'alocacao',             loadChildren: 'app/alocacao/alocacao.module#AlocacaoModule', canActivate: [AuthGuard] }
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [
        RouterModule.forRoot( appRoutes, config )
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {}
