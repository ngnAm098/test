import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PldCaseInformation } from '../models/case-information';
import { Enforcement } from '../models/enforcement';

@Injectable({
  providedIn: 'root'
})
export class JedApiServiceService {

  private caseEnforcementList = new BehaviorSubject('');
  caseEnforcements = this.caseEnforcementList.asObservable();

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

  constructor(private http: HttpClient) { } 

  public loadCaseInformation(): Observable<PldCaseInformation[]> {
    return new Observable<PldCaseInformation[]>((observer) => {
      this.http
        .get<PldCaseInformation[]>(`${environment.serverUrl}/jed/enforcement/caseInfromation`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  } 

  public loadDzongkhagList() {
    return this.http
    .get<any>(`${environment.serverUrl}/jed/master/dzongkhag`, this.httpOptions)
    .pipe(catchError(this.errorHandler));
  } 

  public loadGewogList(dzongkhagId:number) {
    return this.http
    .get<any>(`${environment.serverUrl}/jed/master/gewog-by-dzongkhag-id/${dzongkhagId}`, this.httpOptions)
    .pipe(catchError(this.errorHandler));
  } 

  public loadVilageList(gewogId:number) {
    return this.http
    .get<any>(`${environment.serverUrl}/jed/master/village-by-gewog-id/${gewogId}`, this.httpOptions)
    .pipe(catchError(this.errorHandler));
  }  


  public loadCaseInformationById(caseInformationId: number) {
    return this.http
    .get<any>(`${environment.serverUrl}/jed/enforcement/caseInfromation/${caseInformationId}`, this.httpOptions)
    .pipe(catchError(this.errorHandler));
  } 
  
  public getCaseAttachment(attachmentId: number) {
    return this.http
      .get(`${environment.serverUrl}/prosecution/incoming-letter/case-file-by-attachment-id/${attachmentId}`, {
        responseType: 'arraybuffer',
      })
      .pipe(catchError(this.errorHandler));
  }

  public saveEnforcement(data: Enforcement) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/enforcement/`, data,this.httpOptions
    );
  }

  public loadEnforcementById(enforcementId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/enforcement/${enforcementId}`,this.httpOptions
    );
  }

  public userPendingTask(userId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/enforcement/user-pending-task/${userId}`,this.httpOptions
    );
  }

  public initializeEnforcement(taskInstanceId: string,data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/enforcement/complete-task/${taskInstanceId}`, data,this.httpOptions
    );
  }
  public saveEnforcementFollowUp(data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/enforcement/follow-up`, data,this.httpOptions
    );
  }

  public loadHandReceiptSeq(): Observable<any> {
    return new Observable<any>((observer) => {
      this.http.get<any>(`${environment.serverUrl}/jed/common/sequence`, this.httpOptions).subscribe(
        (response) => {  
          observer.next(response);
        },
        () => observer.error()
      );
    });
  }

  public incrementSequence(data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/sequence`, data,this.httpOptions
    );
  }

  public uploadAttachment(file: File, letterName: string) {
    const endpoint = `${environment.serverUrl}/jed/common/upload-doc-file`;
    const formData: FormData = new FormData();
    formData.append('File', file, file.name);
    formData.append('caseName', letterName);
    return this.http.post(endpoint, formData).pipe(catchError(this.errorHandler));
  }

  public saveMoneyReceived(data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/money-received`, data,this.httpOptions
    );
  }

  public saveUnderTaking(data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/time-extension`, data,this.httpOptions
    );
  }  

  public saveAttachmentDetail(data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/save-attachment-detail`, data,this.httpOptions
    );
  }

  public completeUserTask(taskIntanceId: string,data: any) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/compensation/complete-task/${taskIntanceId}`, data,this.httpOptions
    );
  } 

  public loadUndertakingByEnforcement(enforcementId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/common/time-extension-by-enforcement/${enforcementId}`,this.httpOptions
    );
  } 

  public loadUndertakingById(udertakingId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/common/time-extension-by-id/${udertakingId}`,this.httpOptions
    );
  }  

  public deleteUndertaking(enforcementId: number) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/delete-time-extension/${enforcementId}`,this.httpOptions
    );
  }   

  public loadMoneyReceivedByEnforcement(enforcementId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/common/money-received-by-enforcement/${enforcementId}`,this.httpOptions
    );
  }  

  public loadReceiptById(receiptId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/common/money-received-by-id/${receiptId}`,this.httpOptions
    );
  }  

  public deleteReceipt(enforcementId: number) {
    return this.http.post<any>(
      `${environment.serverUrl}/jed/common/delete-money-received/${enforcementId}`,this.httpOptions
    );
  }  

  public loadEnforcementFollowup(enforcementId: number) {
    return this.http.get<any>(
      `${environment.serverUrl}/jed/enforcement/follow-up-by-enforcement-id/${enforcementId}`,this.httpOptions
    );
  }   
  
} 