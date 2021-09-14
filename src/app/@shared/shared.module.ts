import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule],
  declarations: [ConfirmationDialogComponent, LoadingComponent],
  exports: [],
})
export class SharedModule {}
