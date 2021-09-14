import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { PendingCaseComponent } from './components/pending-case/pending-case.component';
import { JedContainerComponent } from './container/jed-container/jed-container.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'pending', component: PendingCaseComponent, data: { title: marker('Enforcement Pending') } }, 
    { path: 'case-detail', component: JedContainerComponent, data: { title: marker('Case Information') } }, 
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JedServiceRoutingModule { }
