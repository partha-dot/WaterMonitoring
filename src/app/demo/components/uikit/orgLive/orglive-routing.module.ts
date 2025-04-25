import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgLiveComponent } from './orglive.component';

const routes: Routes = [
  {
    path: '', // Default Organization Route
    component: OrgLiveComponent // Main Component for both Organization & Projects
  },
  {
    path: 'project/:project', // Dynamic Project Route
    component: OrgLiveComponent // Same Org Component will handle project routes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgLiveRoutingModule { }
