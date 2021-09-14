import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/master', pathMatch: 'full' },
    { path: 'employee-details', component: EmployeeListComponent, data: { title: marker('Employee Page') } },
    { path: 'user-details', component: UserListComponent, data: { title: marker('User Page') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
