import { Injectable, Inject } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConstantService } from './constant.service';
import { Sessao } from './sessao';


@Injectable()
export class Api{

    private headersUnsave = new Headers({'Content-Type': 'application/json'});
    private headersSave: any = null

    constructor(
        private http: Http
    ){}

    public setToken( token: string ){
        Sessao.setObjectDB( '_token_', token );
    }

    public getToken(){
        let token = Sessao.getObjectDB( '_token_' );
        this.headersSave = new Headers({
            'Content-Type': 'application/json',
            'x-access-token-by-furious':`${ token }`
        });
        return this.headersSave;
    }

    public reverse( latlng:any ):Observable<any>{

        const _url = `${ ConstantService.endPointNomin() }/apiv1/geofence/${ latlng.lng }/${ latlng.lat }`;
        return this.http.get(  _url, { headers: this.headersUnsave }).map( res => res.json() );
    }

    public login( _user ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/signin`;
        return this.http.post( _url, JSON.stringify( _user ), {headers: this.headersUnsave}).map( res => res.json() );
    }

    public createUser( _user ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/signup`;
        return this.http.post( _url, JSON.stringify( _user ), {headers: this.headersUnsave}).map( res => res.json() );
    }

    public getGroup(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/group`;
        return this.http.get( _url, {headers: this.getToken()}).map( res => res.json() );
    }

    public createGroup( _group ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/group`;
        return this.http.post( _url, JSON.stringify( _group ), { headers: this.getToken() }).map( res => res.json() );
    }

    public createApp( _app ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/application`;
        return this.http.post( _url, JSON.stringify( _app ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getApplication(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/application`;
        return this.http.get( _url, { headers: this.getToken() }).map( res => res.json() );
    }

    public getVehicles(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/vehicles`;
        return this.http.get( _url, { headers: this.getToken() }).map( res => res.json() );
    }

    public getAllVehicles(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/vehicles/nofilter`;
        return this.http.get( _url, { headers: this.getToken() }).map( res => res.json() );
    }

    public getLines(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/linhas`;
        return this.http.get( _url, { headers: this.getToken() }).map( res => res.json() );
    }

    public getVeiculoAlocado( _ids ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/veiculoInLinha`;
        return this.http.post( _url, JSON.stringify( _ids ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getVehicle( _ids ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/positions`;
        return this.http.post( _url, JSON.stringify( _ids ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getPosition( _ids ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/positions`;
        return this.http.post( _url, JSON.stringify( _ids ), { headers: this.getToken() }).map( res => res.json() );
    }

    public loadPosition( _ids ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/positions/load`;
        return this.http.post( _url, JSON.stringify( _ids ), { headers: this.getToken() }).map( res => res.json() );
    }

    public loadPositionAlocado( _ids ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/positions/loadAlocados`;
        return this.http.post( _url, JSON.stringify( _ids ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAllLoadPos( _params ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/list_pos`;
        return this.http.post( _url, JSON.stringify( _params ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAllLoadPosSnap( _params ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/list_pos_snap`;
        return this.http.post( _url, JSON.stringify( _params ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAllLoadPosLineSnap( _params ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/list_pos_linha_snap`;
        return this.http.post( _url, JSON.stringify( _params ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getPositionNearFence( _params ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/positions/near_fence`;
        return this.http.post( _url, JSON.stringify( _params ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getGeoReverse( _id ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/reverse`;
        return this.http.post( _url, JSON.stringify( _id ), { headers: this.getToken() }).map( res => res.json() );
    }

    public createCerca( _cerca ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/geofence`;
        return this.http.post( _url, JSON.stringify( _cerca ), { headers: this.getToken() }).map( res => res.json() );
    }

    public updateCerca( _cerca ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/updategeofence`;
        return this.http.post( _url, JSON.stringify( _cerca ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getCercaTrocaLinha( _cerca ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/geofence/trocalinha`;
        return this.http.post( _url, JSON.stringify( _cerca ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getCercas(): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/geofences`;
        return this.http.get( _url, { headers: this.getToken() }).map( res => res.json() );
    }

    public getCerca( _type ): Observable<any>{///apiv1/geofence/find_size_lines

        const _url = `${ ConstantService.endPoint() }/apiv1/geofence/find`;
        return this.http.post( _url, JSON.stringify( _type ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getSizeLine( _linhas ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/geofence/find_size_lines`;
        return this.http.post( _url, JSON.stringify( _linhas ), { headers: this.getToken() }).map( res => res.json() );
    }

    public createAlocacao( _cerca ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/geofence`;
        return this.http.post( _url, JSON.stringify( _cerca ), { headers: this.getToken() }).map( res => res.json() );
    }

    public updateAlocacao( _cerca ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/updategeofence`;
        return this.http.post( _url, JSON.stringify( _cerca ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAlocacao( _id ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao`;
        return this.http.post( _url, JSON.stringify( _id ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAlocacaoVeiculo( _id ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacaoVeiculo`;
        return this.http.post( _url, JSON.stringify( _id ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAlocacaoLine( _info ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao/linha`;
        return this.http.post( _url, JSON.stringify( _info ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getAlocacaoVehicle( _info ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao/veiculo`;
        return this.http.post( _url, JSON.stringify( _info ), { headers: this.getToken() }).map( res => res.json() );
    }//

    public makeAlocacaoTemp( _info ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao/createtemp`;
        return this.http.post( _url, JSON.stringify( _info ), { headers: this.getToken() }).map( res => res.json() );
    }

    public cancelAlocacao( _info ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao/cancelalocacao`;
        return this.http.post( _url, JSON.stringify( _info ), { headers: this.getToken() }).map( res => res.json() );
    }

    public nearAlocacao( _info ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/alocacao/proximidade`;
        return this.http.post( _url, JSON.stringify( _info ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getEvGeofence( _id ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/evgeofence/find`;
        return this.http.post( _url, JSON.stringify( _id ), { headers: this.getToken() }).map( res => res.json() );
    }

    public checkSession( _token ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/session/check`;
        return this.http.post( _url, JSON.stringify( _token ), { headers: this.headersUnsave }).map( res => res.json() );
    }

    public getTelemetria( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/eventos/telemetria`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getStarts( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/partidas/all`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public addStarts( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/partidas/add`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public delStarts( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/partidas/del`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getStartsScales( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/partidas/escala`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getScales( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/escalas/all`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public addScale( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/escalas/add`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public delScale( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/escalas/del`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getProgramations( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/programacoes/all`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public addProgramations( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/programacoes/add`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public delProgramations( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/programacoes/del`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public editProgramations( _data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/programacoes/edit`;
        return this.http.post( _url, JSON.stringify( _data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getEventsInRoad( data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/eventos/getinroad`;
        return this.http.post( _url, JSON.stringify( data ), { headers: this.getToken() }).map( res => res.json() );
    }///apiv1/eventos/ocorrencia/remove

    public getOccorrencInRoad( data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/eventos/getoccorinroad`;
        return this.http.post( _url, JSON.stringify( data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public removeOccorrence( data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/eventos/ocorrencia/remove`;
        return this.http.post( _url, JSON.stringify( data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getOutLines( data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/eventos/getoutline`;
        return this.http.post( _url, JSON.stringify( data ), { headers: this.getToken() }).map( res => res.json() );
    }

    public getPedagio( data ): Observable<any>{

        const _url = `${ ConstantService.endPoint() }/apiv1/datatrip/pedagio`;
        return this.http.post( _url, JSON.stringify( data ), { headers: this.getToken() }).map( res => res.json() );
    }
}
