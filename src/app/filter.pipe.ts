import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform{

    transform(items: any, filter: any, isAnd: boolean): any{

        let check = 0;
        Object.keys(filter).forEach(e => {
            if( filter[e]=="" ){
                check++;
            }
        });
        if( check > 1 )return;

        if (filter && Array.isArray(items)){

            let filterKeys = Object.keys(filter);

            if( isAnd ){

                return items.filter(item => filterKeys.reduce((memo, keyName) => (
                    memo && new RegExp( filter[keyName], 'gi').test( item[keyName]) ) || filter[keyName] === "", true
                ));

            } else {

                return items.filter(item => {

                    return filterKeys.some( keyName => {
                        return new RegExp( filter[keyName], 'gi').test( item[keyName] ) || filter[keyName] === "";
                    });

                });
            }

        } else {

            return;
        }
    }
}

@Pipe({
    name: 'filterDesc',
    pure: false
})

export class FilterDescPipe implements PipeTransform{

    transform(items: any[], term): any{

        if( !term || term=='' || term == null )return;
        return term
            ? items.filter(item => item.placa.indexOf(term) !== -1)
            : '';
    }
}

@Pipe({
    name: 'sortBy'
})

export class SortByPipe implements PipeTransform{

    transform(items: any[], sortedBy: string): any{

        //console.log('sortedBy', items);
        return items.sort((a, b) => {return b[sortedBy] - a[sortedBy]});
    }
}

@Pipe({
    name: 'keys',
    pure: false
})

export class KeysPipe implements PipeTransform{

    transform(value: any, args: any[] = null): any{
        return Object.keys(value);
    }
}

@Pipe({
  name: 'filterList'
})

export class FilterListPipe implements PipeTransform{

    transform(items: any, filter: any, isAnd: boolean): any{

        if (filter && Array.isArray(items)){

            let filterKeys = Object.keys(filter);

            if( isAnd ){

                return items.filter(item => filterKeys.reduce((memo, keyName) => (
                    memo && new RegExp( filter[keyName], 'gi').test( item[keyName]) ) || filter[keyName] === "", true
                ));

            } else {

                return items.filter(item => {

                    return filterKeys.some( keyName => {
                        return new RegExp( filter[keyName], 'gi').test( item[keyName] ) || filter[keyName] === "";
                    });

                });
            }

        } else {

            return;
        }
    }
}

@Pipe({name: 'filtered'})
export class FilterByStatusPipe implements PipeTransform {

    transform(areaList : any, areaname: string): any[] {
        if (areaList) {
            return areaList.filter((listing: any) => listing.numero === areaname);
        }
    }
}
