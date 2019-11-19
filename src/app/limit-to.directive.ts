import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[limit-to]',
    host: {
      '(keypress)': '_onKeypress($event)',
    }
})
export class LimitToDirective{

    @Input('limit-to') limitTo;
    _onKeypress( e ){

        const limit = +this.limitTo;
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        if( e.target.value.length === limit )e.preventDefault();
    }
}
