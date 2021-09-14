import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseRoutingModule } from './case-routing.module';
import { CaseInformationComponent } from './containers/case-information/case-information.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { ReferringAgencyComponent } from './components/referring-agency/referring-agency.component';
import { DepartmentalAssignmentComponent } from './components/departmental-assignment/departmental-assignment.component';
import { VictimComponent } from './components/victim/victim.component';
import { DefendantComponent } from './components/defendant/defendant.component';
import { InvestigationOfficeComponent } from './components/investigation-office/investigation-office.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProsecutorAssignmentComponent } from './components/prosecutor-assignment/prosecutor-assignment.component';
import { ProsecutorWorkloadComponent } from './components/prosecutor-workload/prosecutor-workload.component';
import { CaseDetailViewComponent } from './components/case-detail-view/case-detail-view.component';
import { MailComponent } from './components/mail/mail.component';
import { CaseBriefComponent } from './components/case-brief/case-brief.component';
import { ChargeSheetComponent } from './components/charge-sheet/charge-sheet.component';
import { FileCaseComponent } from './components/file-case/file-case.component';
import { RemandExtensionComponent } from './components/remand-extension/remand-extension.component';
import { UpdateHearingComponent } from './components/update-hearing/update-hearing.component';
import { HearingDialogComponent } from './components/update-hearing/hearing-dialog/hearing-dialog.component';
import { JugdementComponent } from './components/jugdement/jugdement.component';
import { GeneralCorpusComponent } from './components/general-corpus/general-corpus.component';
import { SubCorpusComponent } from './components/sub-corpus/sub-corpus.component';
import { InformAgencyComponent } from './components/inform-agency/inform-agency.component';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
import { JudgementDialogComponent } from './components/jugdement/judgement-dialog/judgement-dialog.component';
import { WaitingPeriodComponent } from './components/waiting-period/waiting-period.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MeetingHallComponent } from './components/meeting-hall/meeting-hall.component';
import { DashboardModule } from '../dashboard/dashboard.module';
 

@NgModule({
  declarations: [
    CaseInformationComponent,
    ReferringAgencyComponent,
    DepartmentalAssignmentComponent,
    VictimComponent,
    DefendantComponent,
    InvestigationOfficeComponent,
    ProsecutorAssignmentComponent,
    ProsecutorWorkloadComponent,
    CaseDetailViewComponent,
    MailComponent,
    CaseBriefComponent,
    ChargeSheetComponent,
    FileCaseComponent,
    RemandExtensionComponent,
    UpdateHearingComponent,
    HearingDialogComponent,
    JugdementComponent,
    GeneralCorpusComponent,
    SubCorpusComponent,
    InformAgencyComponent,
    CaseAssignmentComponent,
    JudgementDialogComponent,
    WaitingPeriodComponent,
    MeetingHallComponent,
    
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    CaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
    DashboardModule,
  ],
})
export class CaseModule {}
