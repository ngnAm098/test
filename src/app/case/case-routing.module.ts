import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
import { CaseInformationComponent } from './containers';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/case', pathMatch: 'full' },
    { path: 'case-assignment', component: CaseAssignmentComponent },
    { path: 'case', component: CaseInformationComponent, data: { title: marker('Case Information') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseRoutingModule {}
