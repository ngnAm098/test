import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TaskListComponent } from './components/task-list/task-list.component';
import { DashboardComponent } from './container/dashboard/dashboard.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, data: { title: marker('Dashboard') } },
    { path: 'receive-letter', component: DashboardComponent, data: { title: marker('Receipt Letter') } },
    { path: 'dispatch-letter', component: DashboardComponent, data: { title: marker('Dispatch Letter') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
