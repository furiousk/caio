import { NgModule } from '@angular/core';
import {
	FilterPipe,
	SortByPipe,
	FilterDescPipe,
	KeysPipe,
	FilterListPipe,
	FilterByStatusPipe
} from './filter.pipe';

@NgModule({
	declarations: [
		FilterPipe,
		SortByPipe,
		FilterDescPipe,
		KeysPipe,
		FilterListPipe,
		FilterByStatusPipe
	],
	imports: [],
	exports: [
		FilterPipe,
		SortByPipe,
		FilterDescPipe,
		KeysPipe,
		FilterListPipe,
		FilterByStatusPipe
	]
})

export class PipesModule{}
