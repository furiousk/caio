import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketService {

    constructor(
        private socket: Socket
    ) {
        console.log('Hello SocketProvider Provider');
    }

    sendMessage(method:string, parametros:any):void{
        this.socket.emit(method, parametros);
    }

    getMessage(method:string):Observable<any>{
        return this.socket.fromEvent(method).map(data => {return data}).catch(err => {return err});
    }
}
