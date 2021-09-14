import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { Credentials, CredentialsService } from '@app/auth';
import { CaseBrief } from '@app/case/models/case-brief';
import { CaseType } from '@app/case/models/case-type';
import { CaseAssessment } from '@app/case/models/CaseAssessment';
import { ChargeSheetRequest } from '@app/case/models/charge-sheet-request';
import { Defendant } from '@app/case/models/defendant';
import { Dzongkhag } from '@app/case/models/dzongkhag';
import { GeneralCorpus } from '@app/case/models/general-corpus';
import { Gewog } from '@app/case/models/gewog';
import { HearingStage } from '@app/case/models/hearing-stage';
import { IncomingLetter } from '@app/case/models/incoming-letter';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { JudgementModel } from '@app/case/models/judgement';
import { Jurisdiction } from '@app/case/models/jurisdiction';
import { Ministry } from '@app/case/models/ministry';
import { Offence } from '@app/case/models/offence';
import { PoliceStation } from '@app/case/models/police-station';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { RemandExtension } from '@app/case/models/remand-extension';
import { SendToAgency } from '@app/case/models/send-to-agency';
import { SubCorpus } from '@app/case/models/sub-corpus';
import { User } from '@app/case/models/user';
import { Victim } from '@app/case/models/victim';
import { Village } from '@app/case/models/village';
import { CaseService } from '@app/case/services/case.service';
import { Agency } from '@app/front-desk/models/agency';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Country } from '@app/case/models/country';
import { WorkLoadDetail } from '@app/case/models/workLoadDetail';
import { CaseAttachment } from '@app/case/models/case-attachment';

@Component({
  selector: 'app-case-information',
  templateUrl: './case-information.component.html',
  styleUrls: ['./case-information.component.scss'],
})
export class CaseInformationComponent implements OnInit {
  public users$: Observable<User[]>;
  public agencys$: Observable<Agency[]>;
  public caseTypes$: Observable<CaseType[]>;
  public offences$: Observable<Offence[]>;
  public jurisdictions$: Observable<Jurisdiction[]>;
  public dzongkhags$: Observable<Dzongkhag[]>;
  public gewogs$: Observable<Gewog[]>;
  public villages$: Observable<Village[]>;
  public ministrys$: Observable<Ministry[]>;
  public policeStations$: Observable<PoliceStation[]>;
  public hearingStage$: Observable<HearingStage[]>;
  public victims$: Observable<Victim[]>;
  public defendants$: Observable<Defendant[]>;
  public countryList$: Observable<Country[]>;
  public caseDetails: ReferringAgency;
  public initialCaseDetails: ReferringAgency;
  public victims: Victim[];
  public defendants: Defendant[];
  public investigationOfficerDetails: InvestigationOfficer;
  public caseBrief: CaseBrief;
  public generalCorpusMeetingDetails: GeneralCorpus[];
  public subCorpusMeetingDetails: SubCorpus[];
  public refreshData$ = new BehaviorSubject<boolean>(false);
  public judgement: JudgementModel;
  public remandExtensionDetails: RemandExtension;
  public getGeneralCorpusMeetingDetails: GeneralCorpus;
  public getSubCorpusMeetingDetails: SubCorpus;
  public getChargeSheetDetails: ChargeSheetRequest;

  @Input() workLoadDetailsEmit: Observable<any[]>;

  step = 0;
  index: number = 0;
  incomingLetterId: number;
  caseId: number;
  taskInstanceId: number;
  formKey: string;
  isCaseDetailsExists: boolean = false;
  incomingLetter: IncomingLetter;
  credentials: Credentials;
  investigationTitle: string = 'Investigation Officer';
  isIndividualVictim = false;
  caseAssessment: CaseAssessment;
  savedReferringAgency: ReferringAgency;
  caseAttachment: any;
  openTab: number = 2;

  fileName: string;
  public fileList: string[] = [];
  @ViewChild('pdfViewer') pdfViewer: ElementRef;
  fileLocation: string;
  caseAssigneeDetails: any;
  selectedDoc: number;

  constructor(
    private route: ActivatedRoute,
    private caseService: CaseService,
    private notificationService: NotificationService,
    private router: Router,
    private credentialService: CredentialsService,
    public dialog: MatDialog,
    private service: FrontDeskService
  ) {
    this.credentials = this.credentialService.credentials;
    pdfDefaultOptions.assetsFolder = 'assets';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.incomingLetterId = params.incomingLetterId;
      this.taskInstanceId = params.taskInstanceId;
      this.formKey = params.formKey;
    });
    this.users$ = this.caseService.loadUsers();
    this.agencys$ = this.caseService.loadAgencys();
    this.caseTypes$ = this.caseService.loadCaseTypes();
    this.offences$ = this.caseService.loadOffences();
    this.jurisdictions$ = this.caseService.loadJurisdictions();
    this.dzongkhags$ = this.caseService.loadDzongkhags();
    this.ministrys$ = this.caseService.loadMinistrys();
    this.hearingStage$ = this.caseService.loadHearingStage();
    this.countryList$ = this.caseService.loadCountry();
    this.loadIncomingLetter();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  get role(): string | null {
    const credentials = this.credentialService.credentials;
    return credentials ? credentials.role : null;
  }

  loadIncomingLetter() {
    this.caseService.loadIncomingLetter(this.incomingLetterId).subscribe(
      (response) => {
        this.incomingLetter = response;  
        this.caseAttachment = response.caseAttachment;
        this.getCaseFile(response.caseAttachment[0].id);
        if (response.caseDataExist === 1) {
          this.isCaseDetailsExists = true;
          this.populateCaseDetails();
        }
        this.loadCaseAssigneeDetails();
      },
      () => {
        this.notificationService.openErrorSnackBar('Details couldnot be loaded, please try again');
      }
    );
  }

  loadCaseAssigneeDetails() {
    this.caseService.loadCaseAssigneeDetails(this.incomingLetter.forwardedTo).subscribe((response2) => {
      this.caseAssigneeDetails = response2;
    });
    if (
      this.formKey === 'REVIEW-FACTS' ||
      this.formKey === 'DUE-PROCESS' ||
      this.formKey === 'EXAMINE-EVIDENCE' ||
      this.formKey === 'Waiting for more Evidence'
    ) {
      this.openTab = 0;
    } else {
      this.openTab = 1;
    }
  }

  getCaseFile(attachmentId: number) {
    this.caseService.downloadFileByAttachmentId(attachmentId).subscribe((response) => {
      let TYPED_ARRAY = new Uint8Array(response);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      let byteChar = atob(STRING_CHAR);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      this.pdfViewer.nativeElement.data = fileURL;
    });
    this.selectedDoc = attachmentId;
  }

  populateCaseDetails() {
    this.caseService.loadCaseDetails(this.incomingLetterId).subscribe((response1) => {
      this.caseDetails = response1;
      this.caseId = response1.id;
      this.caseService.getAllVictims(this.caseId).subscribe((response2) => {
        this.victims = response2;
      });
      this.caseService.getAllDefendants(this.caseId).subscribe((response3) => {
        this.defendants = response3;
      });
      this.caseService.loadInvestigationOfficerDetails(this.caseId).subscribe((response4) => {
        this.investigationOfficerDetails = response4;
      });
      this.caseService.getCaseBriefDetail(this.caseId).subscribe((res) => {
        this.caseBrief = res;
      });
      try {
        this.caseService.getRemandExtension(this.caseId).subscribe((response) => {
          this.remandExtensionDetails = response;
        });
      } catch (error) {}

      try {
        this.caseService.getGeneralCorpusMeetingDetails(this.caseId).subscribe((response5) => {
          this.generalCorpusMeetingDetails = response5;
        });
      } catch (error) {}
      try {
        this.caseService.getSubCorpusMeetingDetails(this.caseId).subscribe((response6) => {
          this.subCorpusMeetingDetails = response6;
        });
      } catch (error) {}

      try {
        this.caseService.getChargeSheetDetails(this.caseId).subscribe((response7) => {
          this.getChargeSheetDetails = response7;
        });
      } catch (error) {}
      this.refreshData$.next(true);
    });
  }

  assignDepartmentalTask(assigneeId: number) {
    this.incomingLetter.updatedBy = this.credentials.userid;
    this.incomingLetter.updatedByName = this.credentials.employeename;
    this.incomingLetter.forwardedTo = assigneeId;
    this.incomingLetter.forwardedOn = new Date();

    const taskVariables = [{ key: 'assigneeChief', value: assigneeId }];
    this.incomingLetter.taskVariables = taskVariables;
    this.caseService.assignTask(this.incomingLetter, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Task has been successfully assigned');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Task couldnot be assigned, please try again');
      }
    );
  }

  assignProsecutor(taskAssignment: any) {
    this.incomingLetter.updatedBy = this.credentials.userid;
    this.incomingLetter.updatedByName = this.credentials.employeename;
    this.incomingLetter.forwardedTo = taskAssignment.assignTo;
    this.incomingLetter.forwardedToName = taskAssignment.assigneeName;
    this.incomingLetter.forwardedOn = new Date();
    this.incomingLetter.updatedOn = new Date();
    this.incomingLetter.caseDataExist == 0;

    const taskVariables = [
      { key: 'assigneeCaseRegistar', value: 21 },
      { key: 'hasFollowedDueProcess', value: taskAssignment.hasFollowedDueProcess },
    ];

    this.incomingLetter.caseAssessments = taskAssignment.groupAssignees;
    this.incomingLetter.taskVariables = taskVariables;

    this.caseService.assignTask(this.incomingLetter, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Task has been successfully assigned');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Task couldnot be assigned, please try again');
      }
    );
  }

  toggleInvestigationTitle(referringAgency: string) {
    if (referringAgency === 'Anti-Corruption Commission') {
      this.investigationTitle = 'Integrity Promotion Officer';
    } else {
      this.investigationTitle = 'Investigation Officer';
    }
  }

  saveReferringAgency(referringAgency: ReferringAgency) {
    referringAgency.incomingLetter = { id: Number(this.incomingLetterId) };
    referringAgency.updatedBy = this.credentials.userid;
    referringAgency.updatedOn = new Date();
    referringAgency.updatedByName = this.credentials.username;
    referringAgency.jurisdiction = { id: referringAgency.jurisdiction };
    referringAgency.referringAgency = { id: referringAgency.referringAgency };
    referringAgency.caseType = { id: referringAgency.caseType };
    this.caseService.saveReferringAgency(referringAgency).subscribe(
      (response) => {
        localStorage.setItem('savedCaseId', response.id);
        this.notificationService.openSuccessSnackBar('Case information successfully saved');
        this.setStep(1);
      },
      () => {
        this.notificationService.openErrorSnackBar('Case information couldnot be saved, please try again');
      }
    );
  }

  getGewogsByDzongkhag(dzongkhagId: number) {
    this.gewogs$ = this.caseService.loadGewogs(dzongkhagId);
  }

  getVillagesByGewog(gewogId: number) {
    this.villages$ = this.caseService.loadVillages(gewogId);
  }

  saveDefendantInformation(defendant: Defendant) {
    defendant.updatedBy = this.credentials.userid;
    defendant.updatedOn = new Date();
    defendant.updatedByName = this.credentials.username;

    if (defendant.caseId !== null || undefined) {
      defendant.caseInformation = { id: Number(defendant.caseId) };

      this.caseService.saveDefendantInformation(defendant).subscribe(
        (response) => {
          this.notificationService.openSuccessSnackBar('Defendant information successfully saved');
          this.caseService.triggerFormReset();
        },
        () => {
          this.notificationService.openErrorSnackBar('Defendant information couldnot be saved, please try again');
        }
      );
    } else {
      const caseInformationId = localStorage.getItem('savedCaseId');
      defendant.caseInformation = { id: Number(caseInformationId) };
      this.caseService.saveDefendantInformation(defendant).subscribe(
        () => {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '500px',
            data: {
              title: 'Confirmation',
              message: 'Do you want to add another defendant?',
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.defendants$ = this.refreshData$.pipe(
                switchMap((_) => this.caseService.loadDefendants(defendant.caseInformation))
              );
              this.caseService.triggerFormReset();
            } else {
              this.defendants$ = this.refreshData$.pipe(
                switchMap((_) => this.caseService.loadDefendants(defendant.caseInformation))
              );
              this.setStep(2);
            }
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Defendant information couldnot be saved, please try again');
        }
      );
    }
  }

  saveInvestigationOfficer(investigationOfficer: InvestigationOfficer) {
    if (investigationOfficer.caseId !== null && investigationOfficer.caseId !== undefined) {
      investigationOfficer.caseInformation = { id: Number(investigationOfficer.caseId) };
    } else {
      const caseInformationId = localStorage.getItem('savedCaseId');
      investigationOfficer.caseInformation = { id: Number(caseInformationId) };
    }
    investigationOfficer.updatedBy = this.credentials.userid;
    investigationOfficer.updatedOn = new Date();
    investigationOfficer.updatedByName = this.credentials.username;
    this.caseService.saveInvestigatingInformation(investigationOfficer).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Investigation information saved successfully');
        this.setStep(3);
      },
      () => {
        this.notificationService.openErrorSnackBar('Investigation information couldnot be saved, please try again');
      }
    );
  }

  saveVictimInformation(victim: Victim) {
    victim.updatedBy = this.credentials.userid;
    victim.updatedOn = new Date();
    victim.updatedByName = this.credentials.username;
    if (victim.caseId !== null || undefined) {
      victim.caseInformation = { id: Number(victim.caseId) };

      this.caseService.saveVictimInformation(victim).subscribe(
        (response) => {
          this.notificationService.openSuccessSnackBar('Victim information successfully saved');
          this.caseService.triggerFormReset();
        },
        () => {
          this.notificationService.openErrorSnackBar('Victim information couldnot be saved, please try again');
        }
      );
    } else {
      const caseInformationId = localStorage.getItem('savedCaseId');
      victim.caseInformation = { id: Number(caseInformationId) };
      this.caseService.saveVictimInformation(victim).subscribe(
        () => {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '500px',
            data: {
              title: 'Confirmation',
              message: 'Do you want to add another victim?',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.victims$ = this.refreshData$.pipe(
                switchMap((_) => this.caseService.loadVictims(victim.caseInformation))
              );
              this.caseService.triggerFormReset();
            } else {
              this.victims$ = this.refreshData$.pipe(
                switchMap((_) => this.caseService.loadVictims(victim.caseInformation))
              );
            }
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Victim information couldnot be saved, please try again');
        }
      );
    }
  }

  saveCaseInformation() {
    const caseInformationId = Number(localStorage.getItem('savedCaseId'));
    const taskVariables = [{ key: 'assigneeProsecutor', value: this.incomingLetter.forwardedTo }];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Message',
        message: 'Do you want to submit Case Information?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.caseService.saveCaseInformation(taskVariables, this.taskInstanceId, caseInformationId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Case Information Successfully Saved');
            this.router.navigate(['/dashboard']);
            localStorage.removeItem('savedCaseId');
          },
          () => {
            this.notificationService.openErrorSnackBar('Case information could not be saved');
          }
        );
      } else {
        dialogRef.close();
      }
    });
  }

  saveWorkLoadDetails(workloadDetails: WorkLoadDetail) {
    Object.assign(this.caseDetails, workloadDetails);
    this.caseDetails.incomingLetter = { id: this.caseDetails.incomingLetter.id };
    this.caseDetails.jurisdiction = { id: this.caseDetails.jurisdiction.id };
    this.caseDetails.referringAgency = { id: this.caseDetails.referringAgency.id };
    this.caseDetails.caseType = { id: this.caseDetails.caseType.id };
    this.caseService.completeProsecutorWorkLoad(this.caseDetails, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Prosecutor work load successfully updated');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Prosecutor work load couldnot update, please try again');
      }
    );
  }

  submitMoreEvidenceDetails(workloadDetails: WorkLoadDetail) {
    try {
      this.caseService.uploadAttachment(workloadDetails.file, this.incomingLetter.receiptNo).subscribe(
        (response) => {
          let filePath = String(response);
          const caseAttachment = new CaseAttachment();
          caseAttachment.incomingLetter = { id: this.caseDetails.incomingLetter.id };
          caseAttachment.caseInformation = { id: this.caseDetails.id };
          caseAttachment.documentPath = filePath;
          caseAttachment.documentName = workloadDetails.file.name;
          caseAttachment.documentType = 'EV';
          this.caseService.moreEvidenceDetails(caseAttachment).subscribe((res) => {
            Object.assign(this.caseDetails, workloadDetails);
            this.caseDetails.incomingLetter = { id: this.caseDetails.incomingLetter.id };
            this.caseDetails.jurisdiction = { id: this.caseDetails.jurisdiction.id };
            this.caseDetails.referringAgency = { id: this.caseDetails.referringAgency.id };
            this.caseDetails.caseType = { id: this.caseDetails.caseType.id };
            this.caseService.completeProsecutorWorkLoad(this.caseDetails, this.taskInstanceId).subscribe(
              () => {
                this.notificationService.openSuccessSnackBar('Prosecutor work load successfully updated');
                this.router.navigate(['/dashboard']);
              },
              () => {
                this.notificationService.openErrorSnackBar('Prosecutor work load couldnot update, please try again');
              }
            );
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Can not update now, please try again later');
        }
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('Can not update now, please try again later');
    }
  }

  uploadChargeSheetFile(file: File) {
    try {
      this.caseService.uploadAttachment(file, this.incomingLetter.receiptNo).subscribe(
        (response) => {
          let filePath = String(response);
          const caseAttachment = new CaseAttachment();
          caseAttachment.incomingLetter = { id: this.caseDetails.incomingLetter.id };
          caseAttachment.caseInformation = { id: this.caseDetails.id };
          caseAttachment.documentPath = filePath;
          caseAttachment.documentName = file.name;
          caseAttachment.documentType = 'CS';
          this.caseService.moreEvidenceDetails(caseAttachment).subscribe(
            () => {
              this.notificationService.openSuccessSnackBar('Charge Sheet file Successfully Uploaded');
            },
            () => {
              this.notificationService.openErrorSnackBar('Charge Sheet file Could not Uploaded, please try again');
            }
          );
        },

        () => {
          this.notificationService.openErrorSnackBar('Can not update now, please try again later');
        }
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('Can not update now, please try again later');
    }
  }

  uploadPOAFile(file: File) {
    try {
      this.caseService.uploadAttachment(file, this.incomingLetter.receiptNo).subscribe(
        (response) => {
          let filePath = String(response);
          const caseAttachment = new CaseAttachment();
          caseAttachment.incomingLetter = { id: this.caseDetails.incomingLetter.id };
          caseAttachment.caseInformation = { id: this.caseDetails.id };
          caseAttachment.documentPath = filePath;
          caseAttachment.documentName = file.name;
          caseAttachment.documentType = 'POA';
          this.caseService.moreEvidenceDetails(caseAttachment).subscribe(
            () => {
              this.notificationService.openSuccessSnackBar('POA file Successfully Uploaded');
            },
            () => {
              this.notificationService.openErrorSnackBar('POA Could not Uploaded, please try again');
            }
          );
        },

        () => {
          this.notificationService.openErrorSnackBar('Can not update now, please try again later');
        }
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('Can not update now, please try again later');
    }
  }

  uploadFile(file: File) {
    try {
      this.caseService.uploadAttachment(file, this.incomingLetter.receiptNo).subscribe(
        (response) => {
          this.fileLocation = String(response);
        },
        () => {}
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('File could not be saved, please try again');
    }
  }

  saveCaseBriefDetails(caseBriefDetails: CaseBrief) {
    this.caseService.saveCaseBriefDetail(caseBriefDetails, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Case brief Successfully Submitted');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Case brief could not submit, please try again');
      }
    );
  }

  saveCaseBriefDetailsAsDraft(caseBriefDetails: CaseBrief) {
    this.caseService.saveCaseBriefDetailsAsDraft(caseBriefDetails).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Case brief Successfully Saved');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Case brief could not be saved, please try again');
      }
    );
  }

  saveCaseChargeSheet(chargeSheetRequest: ChargeSheetRequest) {
    try {
      chargeSheetRequest.caseInformation = { id: this.caseId };
      chargeSheetRequest.createdBy = this.credentials.userid;
      this.caseService.saveCaseChargeSheet(chargeSheetRequest, this.taskInstanceId).subscribe(
        () => {
          this.notificationService.openSuccessSnackBar('Charge Sheet Successfully Saved');
          this.router.navigate(['/dashboard']);
        },
        () => {}
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('Charge Sheet could not saved, please try again');
    }
  }

  saveRemandDetails(remandExtension: RemandExtension) {
    remandExtension.caseInformation = { id: this.caseId };
    remandExtension.updatedBy = this.credentials.userid;
    remandExtension.updatedByName = this.credentials.username;
    remandExtension.updatedOn = new Date();
    try {
      this.caseService.saveRemandDetails(remandExtension).subscribe(
        () => {
          this.notificationService.openSuccessSnackBar('Remand Extension has been successfully saved');
          this.router.navigate(['/dashboard']);
        },
        () => {}
      );
    } catch (error) {
      this.notificationService.openErrorSnackBar('Remand Extension couldnot be saved, please try again');
    }
  }

  submitPowerOfAttorney() {
    this.caseDetails.powerOfAttorney = 'Requested';
    this.caseDetails.updatedBy = this.credentials.userid;
    this.caseDetails.updatedByName = this.credentials.employeename;
    this.caseDetails.fileLocation = this.fileLocation;
    this.caseDetails.updatedOn = new Date();

    const taskVariables = [
      //{ key: 'assigneeProsecutor', value: this.credentials.userid }
      { key: 'message', value: 'save Power of Attorney' },
    ];
    this.caseDetails.taskVariables = taskVariables;
    this.caseService.submitPowerOfAttorney(this.caseDetails, this.taskInstanceId).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Power of attorney successfully uploaded');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Power of attorney could not submit, please try again');
      }
    );
  }

  saveCaseJudgement(judgementModel: JudgementModel) {
    try {
      if (judgementModel.fileToUpload !== null) {
        const newCaseAttachment = new CaseAttachment();
        this.service.saveAttachment(judgementModel.fileToUpload, this.incomingLetter.receiptNo).subscribe(
          (response) => {
            newCaseAttachment['documentName'] = judgementModel.fileToUpload.name;
            newCaseAttachment['documentPath'] = String(response);
            newCaseAttachment['documentType'] = 'JRE';
            newCaseAttachment['defendantInformation'] = judgementModel.defendantInformation;
            newCaseAttachment['incomingLetter'] = { id: this.incomingLetter.id };
            newCaseAttachment['caseInformation'] = { id: this.caseId };
            this.service.saveIncomingLetterAttachment(newCaseAttachment).subscribe((response) => {});
          },
          () => {
            this.notificationService.openErrorSnackBar('File could not be saved, please try again');
          }
        );
      }
      judgementModel.caseInformation = { id: this.caseId };
      judgementModel.updatedBy = this.credentials.userid;
      judgementModel.updateByName = this.credentials.username;
      judgementModel.updatedOn = new Date();

      this.caseService.saveCaseJudgement(judgementModel).subscribe(
        (response) => {
          this.notificationService.openSuccessSnackBar('Case judgement successfully saved');
          this.router.navigate(['/dashboard']);
        },
        () => {
          this.notificationService.openErrorSnackBar('Case judgement could not saved, please try again');
        }
      );
    } catch (error) {}
  }

  downloadFile(attachment: Object) {
    this.caseService.downloadFileByAttachmentId(attachment[0].attachmentId).subscribe((response) => {
      let TYPED_ARRAY = new Uint8Array(response);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      let byteChar = atob(STRING_CHAR);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], { type: 'text/json; charset=utf-8' });
      const fileURL = URL.createObjectURL(blob);
      fileSaver.saveAs(blob, attachment[0].documentName);
    });
  }

  caseReview(taskVariables: any) {
    this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Task successfully submited');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Task could not submit, please try again');
      }
    );
  }

  agCaseReview(taskVariables: any) {
    this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Judgement review successfully closed');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Judgement review could not submit, please try again');
      }
    );
  }

  closeHearingOutput() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to close argument of this case?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const taskVariables = [{ key: 'message', value: 'Hearing' }];
        this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Hearing argument successfully closed');
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.notificationService.openErrorSnackBar('Hearing argument could not, please try again');
          }
        );
      }
    });
  }

  sendToAgency(sendToAgencyDetails: SendToAgency) {
    sendToAgencyDetails.fileName = this.fileLocation;
    this.service.saveAttachment(sendToAgencyDetails.fileToUpload, this.caseDetails.incomingLetter.receiptNo).subscribe(
      (response) => {
        // this.caseService.sendMailWithAttachment(sendToAgencyDetails).subscribe(
        //   (response) => {
        //     this.closeCase(sendToAgencyDetails.taskVariables);
        //   },
        //   () => {
        //     this.notificationService.openErrorSnackBar('Mail could not send, please try again');
        //   }
        // );
      },
      () => {
        this.notificationService.openErrorSnackBar('File could not be saved, please try again');
      }
    );
  }

  closeCase(taskVariables: any) {
    this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.caseService.closeGroupTask(this.incomingLetterId).subscribe(() => {
          this.notificationService.openSuccessSnackBar('Case has been successfully closed');
          this.router.navigate(['/dashboard']);
        });
      },
      () => {
        this.notificationService.openErrorSnackBar('Case could not send for enforcement, please try again');
      }
    );
  }

  getPoliceStation(dzongkhagId: number) {
    this.policeStations$ = this.caseService.loadPoliceStations(dzongkhagId);
  }

  submitCorpusRequest(taskVariables: any) {
    this.caseService.submitCorpusRequest(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Corpus Request Submitted Successfully');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('could not submit');
      }
    );
  }

  submitCorpusApprove(taskVariables: any) {
    this.caseService.submitCorpusApprove(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Corpus Meeting Successfully Approved');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Corpus Meeting could not be approved');
      }
    );
  }

  saveGeneralCorpusDetails(generalCorpus: GeneralCorpus) {
    generalCorpus.caseInformation = { id: this.caseId };
    generalCorpus.corpusDate = new Date();
    generalCorpus.updatedBy = this.credentials.userid;
    generalCorpus.updatedByName = this.credentials.username;
    generalCorpus.updatedOn = new Date();
    this.caseService.saveGeneralCorpusDetails(generalCorpus, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('General Corpus saved successfully');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('General Corpus could not be saved!');
      }
    );
  }

  updateGeneralCorpusEmit(generalCorpus: GeneralCorpus) {
    generalCorpus.caseInformation = { id: this.caseId };
    generalCorpus.corpusDate = new Date();
    generalCorpus.updatedBy = this.credentials.userid;
    generalCorpus.updatedByName = this.credentials.username;
    generalCorpus.updatedOn = new Date();
    this.caseService.updateGeneralCorpus(generalCorpus).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('General Corpus saved successfully');
      },
      () => {
        this.notificationService.openErrorSnackBar('General Corpus could not be saved!');
      }
    );
  }

  reviewCorpusMOMDetails(taskVariables: any) {
    this.caseService.reviewCorpusMOMDetails(taskVariables, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Review general corpus saved successfully');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Review corpus could not be saved!');
      }
    );
  }

  saveSubCorpusDetails(subCorpus: SubCorpus) {
    subCorpus.caseInformation = { id: this.caseId };
    subCorpus.updatedBy = this.credentials.userid;
    subCorpus.updatedByName = this.credentials.username;
    subCorpus.updatedOn = new Date();
    subCorpus.corpusDate = new Date();

    this.caseService.saveSubCorpusDetails(subCorpus, this.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Sub Corpus saved successfully');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Sub Corpus could not be saved!');
      }
    );
  }

  editGeneralMeetingDetails(generalCorpusId: number) {
    this.caseService.getGeneralMeetingDetails(generalCorpusId).subscribe((response) => {
      this.getGeneralCorpusMeetingDetails = response;
    });
  }

  updateCorpusMeetingDetails(subCorpus: SubCorpus) {
    subCorpus.caseInformation = { id: this.caseId };
    subCorpus.updatedBy = this.credentials.userid;
    subCorpus.updatedByName = this.credentials.username;
    subCorpus.updatedOn = new Date();
    subCorpus.corpusDate = new Date();
    this.caseService.updateSubCorpus(subCorpus).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Sub Corpus saved successfully');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Sub corpus could not be saved!');
      }
    );
  }

  waitingPeriodAppeal() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to forward the selected letter?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const taskVariables = [{ key: 'appealInWaitingPeriod', value: true }];
        this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Case has been appeal successfully closed');
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.notificationService.openErrorSnackBar('Case could not appeal, please try again');
          }
        );
      }
    });
  }

  submitHallBookingDetails(taskVariables: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Have you finished scheduling meeting?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.caseService.completeTask(taskVariables, this.taskInstanceId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Successfully Updated');
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.notificationService.openErrorSnackBar('Could not submit, please try again');
          }
        );
      }
    });
  }
}
