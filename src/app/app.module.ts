import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { HttpModule }           from '@angular/http';
import { FormsModule }          from '@angular/forms';

import {
    HTTP_INTERCEPTORS,
    HttpClientModule }          from '@angular/common/http';

import { JwtInterceptor }       from './jwt.interceptor';
import { TextMaskModule }       from 'angular2-text-mask';
import { AppRoutingModule }     from './app-routing.module';
import {
    SocketIoModule,
    SocketIoConfig }            from 'ng-socket-io';

import { Sessao }               from './providers/sessao';
import { Api }                  from './providers/api';
import { Auth }                 from './providers/auth';
import { Toggle }               from './providers/toggle';
import { Leaflet }              from './providers/leaflet';
import { Icon }                 from './providers/util';
import { Baloon }               from './providers/util';
import { ConstantService }      from './providers/constant.service';
import { SocketService }        from './providers/socket.service';
import { ExcelService }         from './providers/excel.service';
import { AuthGuard }            from './guards/auth.guard';
import { AppComponent }         from './app.component';

const config: SocketIoConfig = { url: 'http://127.0.0.1:3200', options: {} };

@NgModule({
  declarations: [
      AppComponent
  ],
  imports: [
      BrowserModule,
      HttpModule,
      FormsModule,
      AppRoutingModule,
      TextMaskModule,
      SocketIoModule.forRoot( config )
  ],
  providers: [
      Sessao,
      Api,
      Auth,
      Toggle,
      Leaflet,
      Icon,
      Baloon,
      ExcelService,
      ConstantService,
      SocketService,
      AuthGuard,
      Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
