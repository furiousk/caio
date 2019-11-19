import { Injectable, EventEmitter }    from  '@angular/core';

@Injectable()
export class Toggle{

    static _toggle = new EventEmitter<boolean>();

}
