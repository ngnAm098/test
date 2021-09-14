import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JedServiceRoutingModule } from './jed-service-routing.module';
import { CompensationComponent } from './components/compensation/compensation.component';
import { PendingCaseComponent } from './components/pending-case/pending-case.component'; 
import { MaterialModule } from '@app/material.module';
import { JedContainerComponent } from './container/jed-container/jed-container.component';
import { CaseDetailComponent } from './case/case-detail/case-detail.component';
import { CaseDetailViewComponent } from './case/case-detail-view/case-detail-view.component';
import { EnforcerAssignmentComponent } from './enforcer-assignment/enforcer-assignment.component';
import { EnforcementFollowUpComponent } from './dialog/enforcement-follow-up/enforcement-follow-up.component';
import { MoneyReceiptComponent } from './components/money-receipt/money-receipt.component';
import { UndertakingComponent } from './components/undertaking/undertaking.component';
import { MoneyReceiptTableComponent } from './components/money-receipt/money-receipt-table/money-receipt-table.component';
import { UndertakingTableComponent } from './components/undertaking/undertaking-table/undertaking-table.component';
import { CompensationDiscussionComponent } from './components/compensation-discussion/compensation-discussion.component';
import { EnforcementFollowupComponent } from './components/enforcement-followup/enforcement-followup.component';
import { CompensationPaymentComponent } from './components/compensation-payment/compensation-payment.component'; 

@NgModule({
  declarations: [
    CompensationComponent, 
    PendingCaseComponent, 
    JedContainerComponent, 
    CaseDetailComponent, 
    CaseDetailViewComponent, 
    EnforcerAssignmentComponent, 
    EnforcementFollowUpComponent, 
    MoneyReceiptComponent, 
    UndertakingComponent, MoneyReceiptTableComponent, UndertakingTableComponent, CompensationDiscussionComponent, EnforcementFollowupComponent, CompensationPaymentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    JedServiceRoutingModule, 
  ], 
  exports: [ 
    PendingCaseComponent
  ],
})
export class JedServiceModule { }
