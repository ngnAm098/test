import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontDeskRoutingModule } from './front-desk-routing.module';
import { LetterReceiptComponent } from './components/letter-receipt/letter-receipt.component';
import { FrontDeskPageComponent } from './container/front-desk-page/front-desk-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetterReceiptListComponent } from './components/letter-receipt-list/letter-receipt-list.component';

@NgModule({
  declarations: [LetterReceiptComponent, FrontDeskPageComponent, LetterReceiptListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FrontDeskRoutingModule,
  ],
})
export class FrontDeskModule {}
