import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConstantService{

    private static config: any = {

        endpoint_embratel:  'http://ec2-100-25-66-244.compute-1.amazonaws.com:25536',
        endpoint_cache:     'http://ec2-54-92-201-167.compute-1.amazonaws.com:3010',
        endpoint_socket:    'http://ec2-54-92-201-167.compute-1.amazonaws.com:3200',
        endpoint_local:     'http://127.0.0.1:25530',
        // endpoint_socket_lc: 'http://127.0.0.1:3200'
        //endpoint_local:     'http://ec2-100-25-66-244.compute-1.amazonaws.com:25536',
        endpoint_socket_lc: 'http://ec2-54-92-201-167.compute-1.amazonaws.com:3200'
    };

    public static endPoint(): string{

        if( environment.production ){

            return this.config.endpoint_embratel;//REPETIR ESTÁ LINHA EM BAIXO
        }else{
            return this.config.endpoint_local;//AQUI...
            //return this.config.endpoint_embratel;
        }
    }

    public static endPointNomin(): string{

        return this.config.endpoint_cache;
    }

    public static endPointSocket(): string{

        if( environment.production ){

            return this.config.endpoint_socket;
        }else{
            return this.config.endpoint_socket_lc;
        }
    }
}
