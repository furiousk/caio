import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class RootIsHome {

    public emitIsHome;
    public data: boolean;

    constructor(){
        this.emitIsHome = new EventEmitter<boolean>();
    }

    public enterHome(){
        this.emitIsHome.emit(true);
    }

    public exitHome(){
        this.emitIsHome.emit(false);
    }

    public watchIsHome(){
        this.emitIsHome.subscribe(data => this.data = data);
    }
}
