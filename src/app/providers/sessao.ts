import { Injectable }    from  '@angular/core';
import 'rxjs/add/operator/map';

declare var localStorage:any;

@Injectable()
export class Sessao{

    public static setObjectDB( key, data ):void{
        localStorage.setItem( key, JSON.stringify(data) );
    }

    public static getObjectDB( key ):Object{
        return JSON.parse( localStorage.getItem( key ) );
    }

    public static removeDB( key ):void{
        localStorage.removeItem( key );
    }
}
