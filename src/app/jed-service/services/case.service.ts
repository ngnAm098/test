import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';  
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnforcementType } from '../models/enforcement-type';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class CaseService { 

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


  public getCaseInformationById(caseInformationId: number) {
    return this.http
      .get<any>(
        `${environment.serverUrl}/prosecution/case/case-information-with-all-details/${caseInformationId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public downloadCaseDocument(attachmentId: number) {
    return this.http
      .get(`${environment.serverUrl}/prosecution/incoming-letter/case-file-by-attachment-id/${attachmentId}`, {
        responseType: 'arraybuffer',
      })
      .pipe(catchError(this.errorHandler));
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

  public loadEnforcementType(): Observable<EnforcementType[]> {
    return new Observable<EnforcementType[]>((observer) => {
      this.http.get<EnforcementType[]>(`${environment.serverUrl}/jed/enforcement/type`, this.httpOptions).subscribe(
        (response) => {  
          observer.next(response);
        },
        () => observer.error()
      );
    });
  }   
}
