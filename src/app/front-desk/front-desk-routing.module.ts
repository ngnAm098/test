import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { LetterReceiptListComponent } from './components/letter-receipt-list/letter-receipt-list.component';
import { LetterReceiptComponent } from './components/letter-receipt/letter-receipt.component';
import { FrontDeskPageComponent } from './container/front-desk-page/front-desk-page.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/front-desk', pathMatch: 'full' },
    { path: 'front-desk', component: FrontDeskPageComponent, data: { title: marker('Front Desk Page') } },
    {
      path: 'receipt-letter-list',
      component: LetterReceiptListComponent,
      data: { title: marker('Letter Receipt List') },
    },
    { path: 'dispatch-letter', component: LetterReceiptComponent, data: { title: marker('Letter Dispatch') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontDeskRoutingModule {}
