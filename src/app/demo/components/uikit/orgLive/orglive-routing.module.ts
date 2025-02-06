import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrgLiveComponent } from './orglive.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrgLiveComponent }
	])],
	exports: [RouterModule]
})
export class OrgLiveRoutingModule { }
