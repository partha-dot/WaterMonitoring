import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MProjectComponent } from './m-project.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MProjectComponent }
	])],
	exports: [RouterModule]
})
export class InputDemoRoutingModule { }
