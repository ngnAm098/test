import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agency } from '@app/front-desk/models/agency';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CaseAttachment } from '../models/case-attachment';
import { CaseBrief } from '../models/case-brief';
import { CaseHistory } from '../models/case-history';
import { CaseInformation } from '../models/case-information';
import { CaseType } from '../models/case-type';
import { CaseAssessment } from '../models/CaseAssessment';
import { ChargeSheetRequest } from '../models/charge-sheet-request';
import { Country } from '../models/country';
import { CourtHearing } from '../models/court-hearing';
import { Defendant } from '../models/defendant';
import { Dzongkhag } from '../models/dzongkhag';
import { GeneralCorpus } from '../models/general-corpus';
import { Gewog } from '../models/gewog';
import { HearingStage } from '../models/hearing-stage';
import { IncomingLetter } from '../models/incoming-letter';
import { InvestigationOfficer } from '../models/investigation-officer';
import { JudgementModel } from '../models/judgement';
import { Jurisdiction } from '../models/jurisdiction';
import { MailAttachment } from '../models/mail-attachment';
import { Ministry } from '../models/ministry';
import { Offence } from '../models/offence';
import { PoliceStation } from '../models/police-station';
import { ReferringAgency } from '../models/referring-agency';
import { RemandExtension } from '../models/remand-extension';
import { SendMail } from '../models/send-mail';
import { SubCorpus } from '../models/sub-corpus';
import { User } from '../models/user';
import { Victim } from '../models/victim';
import { Village } from '../models/village';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private caseTypeBehaviorSubject = new BehaviorSubject('');
  getCaseType = this.caseTypeBehaviorSubject.asObservable();

  private formResetSubject = new BehaviorSubject(false);
  getFormReset = this.formResetSubject.asObservable();

  private investigationFormDisplay = new BehaviorSubject('');
  getInvestigationFormDisplay = this.investigationFormDisplay.asObservable();

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.status}`;
    }
    return throwError(errorMessage);
  }

  updateCaseType(caseType: string) {
    this.caseTypeBehaviorSubject.next(caseType);
  }

  triggerFormReset() {
    this.formResetSubject.next(true);
  }

  toggleInvestigationFormDisplay(referringAgency: string) {
    this.investigationFormDisplay.next(referringAgency);
  }

  public loadIncomingLetter(incomingLetterId: number) {
    return this.http.get<IncomingLetter>(
      `${environment.serverUrl}/prosecution/incoming-letter/${incomingLetterId}`,
      this.httpOptions
    );
  }

  public loadCaseInformationByCaseId(caseId: number) {
    return this.http.get<CaseInformation>(`${environment.serverUrl}/prosecution/case/case-information-id/${caseId}`, {
      responseType: 'arraybuffer' as 'json',
    });
  }

  public loadUsers(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      this.http.get<User[]>(`${environment.serverUrl}/user-master/user-list`, this.httpOptions).subscribe(
        (response) => {
          observer.next(response);
        },
        () => observer.error()
      );
    });
  }

  public assignTask(incomingLetter: IncomingLetter, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/incoming-letter/forward/${taskInstanceId}`,
        incomingLetter,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public assignTaskCaseRegistrar(incomingLetter: IncomingLetter, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/case/case-register/${taskInstanceId}`,
        incomingLetter,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public loadAgencys(): Observable<Agency[]> {
    return new Observable<Agency[]>((observer) => {
      this.http.get<Agency[]>(`${environment.serverUrl}/prosecution/pld-master/agency`, this.httpOptions).subscribe(
        (response) => {
          observer.next(response);
        },
        () => observer.error()
      );
    });
  }

  public loadCaseTypes(): Observable<CaseType[]> {
    return new Observable<CaseType[]>((observer) => {
      this.http
        .get<CaseType[]>(`${environment.serverUrl}/prosecution/pld-master/case-type`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadOffences(): Observable<Offence[]> {
    return new Observable<Offence[]>((observer) => {
      this.http
        .get<Offence[]>(`${environment.serverUrl}/prosecution/pld-master/offence-list`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadJurisdictions(): Observable<Jurisdiction[]> {
    return new Observable<Jurisdiction[]>((observer) => {
      this.http
        .get<Jurisdiction[]>(`${environment.serverUrl}/prosecution/pld-master/jurisdiction`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadMinistrys(): Observable<Ministry[]> {
    return new Observable<Ministry[]>((observer) => {
      this.http
        .get<Ministry[]>(`${environment.serverUrl}/prosecution/pld-master/ministry-list`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadDzongkhags(): Observable<Dzongkhag[]> {
    return new Observable<Dzongkhag[]>((observer) => {
      this.http
        .get<Dzongkhag[]>(`${environment.serverUrl}/prosecution/pld-master/dzongkhag`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadGewogs(dzongkhagId: number): Observable<Gewog[]> {
    return new Observable<Gewog[]>((observer) => {
      this.http
        .get<Gewog[]>(
          `${environment.serverUrl}/prosecution/pld-master/gewog-by-dzongkhag-id/${dzongkhagId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadPoliceStations(dzongkhagId: number): Observable<PoliceStation[]> {
    return new Observable<PoliceStation[]>((observer) => {
      this.http
        .get<PoliceStation[]>(
          `${environment.serverUrl}/prosecution/pld-master/police-station/${dzongkhagId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadHearingStage(): Observable<HearingStage[]> {
    return new Observable<HearingStage[]>((observer) => {
      this.http
        .get<HearingStage[]>(`${environment.serverUrl}/prosecution/file-case/hearingStage`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadCountry(): Observable<Country[]> {
    return new Observable<Country[]>((observer) => {
      this.http
        .get<Country[]>(`${environment.serverUrl}/prosecution/pld-master/country-list`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadVillages(gewogId: number): Observable<Village[]> {
    return new Observable<Village[]>((observer) => {
      this.http
        .get<Village[]>(
          `${environment.serverUrl}/prosecution/pld-master/village-by-gewog-id/${gewogId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public saveReferringAgency(data: ReferringAgency) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/case-information`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveVictimInformation(data: Victim) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/victim-information`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveDefendantInformation(data: Defendant) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/defendant-information`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveCaseInformation(taskVariables: any, taskInstanceId: number, caseInformationId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/case/case-information-by-task-instance-id/${taskInstanceId}/${caseInformationId}`,
        taskVariables,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public loadVictims(incomingLetterId: number): Observable<Victim[]> {
    return new Observable<Victim[]>((observer) => {
      this.http
        .get<Victim[]>(
          `${environment.serverUrl}/prosecution/case/victim-information-by-case-id/${incomingLetterId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadDefendants(caseId: number): Observable<Defendant[]> {
    return new Observable<Defendant[]>((observer) => {
      this.http
        .get<Defendant[]>(
          `${environment.serverUrl}/prosecution/case/defendant-information-by-case-id/${caseId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public saveInvestigatingInformation(data: InvestigationOfficer) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/investigating-information`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public loadCaseDetails(incomingLetterId: number) {
    return this.http.get<ReferringAgency>(
      `${environment.serverUrl}/prosecution/case/case-information-by-incomingLetter/${incomingLetterId}`,
      this.httpOptions
    );
  }

  public loadCaseDetailsInInitial(incomingLetterId: number): Observable<ReferringAgency> {
    return new Observable<ReferringAgency>((observer) => {
      this.http
        .get<ReferringAgency>(
          `${environment.serverUrl}/prosecution/case/case-information-by-incomingLetter/${incomingLetterId}`,
          this.httpOptions
        )
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public getAllVictims(caseId: number) {
    return this.http.get<Victim[]>(
      `${environment.serverUrl}/prosecution/case/victim-information-by-case-id/${caseId}`,
      this.httpOptions
    );
  }
  public getVictim(victimId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/prosecution/case/victim-information-by-id/${victimId}`,
      this.httpOptions
    );
  }

  public getAllDefendants(caseId: number) {
    return this.http.get<Defendant[]>(
      `${environment.serverUrl}/prosecution/case/defendant-information-by-case-id/${caseId}`,
      this.httpOptions
    );
  }

  public getDefendant(defendantId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/prosecution/case/defendant-information-by-id/${defendantId}`,
      this.httpOptions
    );
  }

  public loadInvestigationOfficerDetails(caseId: number) {
    return this.http.get<InvestigationOfficer>(
      `${environment.serverUrl}/prosecution/case/investigating-information-by-case-id/${caseId}`,
      this.httpOptions
    );
  }

  public completeProsecutorWorkLoad(data: ReferringAgency, taskInstanceId: any) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/workload-details/${taskInstanceId}`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public moreEvidenceDetails(data: CaseAttachment) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/common/more-evidence-details`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveMailAttachmentDetail(mailAttachmentDetail: MailAttachment) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/common/mail-attachment-detail`,
        mailAttachmentDetail,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public sendMailWithAttachment(mailDetails: SendMail) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/common/sendEmailwithAttachment`, mailDetails, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveCaseBriefDetail(caseBriefModel: CaseBrief, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/case-brief/details/${taskInstanceId}`,
        caseBriefModel,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveCaseBriefDetailsAsDraft(caseBriefModel: CaseBrief) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case-brief/draft`, caseBriefModel, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getCaseBriefDetail(caseInformationId: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/case-brief/case-id/${caseInformationId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveCaseChargeSheet(chargeSheetRequest: ChargeSheetRequest, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/charge-sheet/${taskInstanceId}`,
        chargeSheetRequest,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveRemandDetails(data: RemandExtension) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/remand-extension`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public uploadAttachment(file: File, letterName: string) {
    const endpoint = `${environment.serverUrl}/prosecution/common/uploadDocFile`;
    const formData: FormData = new FormData();
    formData.append('File', file, file.name);
    formData.append('letterName', letterName);
    return this.http.post(endpoint, formData).pipe(catchError(this.errorHandler));
  }

  public submitPowerOfAttorney(caseInformation: CaseInformation, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/file-case/update/${taskInstanceId}`,
        caseInformation,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveCourtHearing(courtHearing: CourtHearing) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/file-case/hearing`, courtHearing, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getDefendentHearingDetails(defendentId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/file-case/hearing-by-defendantId/${defendentId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public deleteCourtHearing(hearingId: number) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/file-case/delete-hearing/${hearingId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public completeTask(taskVariables: any, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/file-case/taskFinished/${taskInstanceId}`,
        taskVariables,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public closeGroupTask(incomingLetterId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/incoming-letter/close-group-task/${incomingLetterId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveCaseJudgement(judgementModel: JudgementModel) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/file-case/saveJudgement`, judgementModel, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public submitCorpusRequest(data: any, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/corpus/submit-corpus-request/${taskInstanceId}`,
        data,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public submitCorpusApprove(data: any, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/corpus/approve-corpus-request/${taskInstanceId}`,
        data,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveGeneralCorpusDetails(generalCorpus: GeneralCorpus, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/corpus/save-corpus-mom/${taskInstanceId}`,
        generalCorpus,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public updateGeneralCorpus(generalCorpus: GeneralCorpus) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/corpus/update-corpus-mom`, generalCorpus, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getGeneralCorpusMeetingDetails(caseInformationId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/corpus/corpus-details-by-caseId/${caseInformationId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public reviewCorpusMOMDetails(taskVariables: any, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/corpus/approve-corpus-request/${taskInstanceId}`,
        taskVariables,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveSubCorpusDetails(subCorpus: SubCorpus, taskInstanceId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/corpus/save-subcorpus-mom/${taskInstanceId}`,
        subCorpus,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public getSubCorpusMeetingDetails(caseInformationId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/corpus/sub-corpus-details-by-caseId/${caseInformationId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public getChargeSheetDetails(caseInformationId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/charge-sheet/charge-sheet-by-case-id/${caseInformationId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public getCaseJudgementByDefendent(defendentId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/file-case/getCaseJudgementByDefendent/${defendentId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public downloadAttachment(caseId: number, attachment: string) {
    return this.http
      .get(`${environment.serverUrl}/prosecution/common/downloadAttachment/${caseId}/${attachment}`, {
        responseType: 'blob',
      })
      .pipe(catchError(this.errorHandler));
  }

  public getCaseFile(incomingLetterId: number) {
    return this.http
      .get(`${environment.serverUrl}/prosecution/incoming-letter/case-file-by-letter-id/${incomingLetterId}`, {
        responseType: 'arraybuffer',
      })
      .pipe(catchError(this.errorHandler));
  }

  public downloadFileByAttachmentId(attachmentId: number) {
    return this.http
      .get(`${environment.serverUrl}/prosecution/incoming-letter/case-file-by-attachment-id/${attachmentId}`, {
        responseType: 'arraybuffer',
      })
      .pipe(catchError(this.errorHandler));
  }

  public getRemandExtension(caseId: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/case/remand-by-case-id/${caseId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getGeneralMeetingDetails(generalCorpusId: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/corpus/${generalCorpusId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getMeetingDetailsBySubCorpusId(subCorpusID: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/corpus/sub-corpus-details-by-id/${subCorpusID}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public updateSubCorpus(subCorpus: SubCorpus) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/corpus/update-subCorpus-mom`, subCorpus, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  // public getGroupAssignment(userid: number,incomingLetterId: number) {
  //   return this.http
  //     .get<any>(`${environment.serverUrl}/prosecution/incoming-letter/group-assignment/${userid}/${incomingLetterId}`, this.httpOptions)
  //     .pipe(catchError(this.errorHandler));
  // }

  public saveCaseHistory(data: CaseHistory) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/history`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getCaseHistoryByIncomingLetter(incomingLetterId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/case/history-incomingLetterId/${incomingLetterId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public deleteCaseHistoryById(id: number) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/case/history-delete/${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public loadCaseAssigneeDetails(forwardedId: number) {
    return this.http.get<Victim[]>(
      `${environment.serverUrl}/user-master/get-user-details-by-id/${forwardedId}`,
      this.httpOptions
    );
  }

  public getAllCorpusMembers() {
    return this.http.get<any>(`${environment.serverUrl}/prosecution/common/corpus-member`, this.httpOptions);
  }

  public getCourtHearingById(hearingId: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/file-case/hearing-by-id/${hearingId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public getPoaAttachment(caseType: string, caseId: number) {
    return this.http
      .get<any>(`${environment.serverUrl}/prosecution/common/case-attachment/${caseType}/${caseId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }   
}
