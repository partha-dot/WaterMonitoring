import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';


@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ProjectComponent }
	])],
	exports: [RouterModule]
})
export class ModelRoutingModule { }
