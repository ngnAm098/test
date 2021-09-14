import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CaseAttachment } from '@app/case/models/case-attachment';
import { MailAttachment } from '@app/case/models/mail-attachment';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Agency } from '../models/agency';
import { FileCategory } from '../models/file-category';
import { IncomingLetter } from '../models/incoming-letter';

@Injectable({
  providedIn: 'root',
})
export class FrontDeskService {
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

  public loadAgencyList(): Observable<Agency[]> {
    return this.http.get<Agency[]>(`${environment.serverUrl}/prosecution/pld-master/agency`, this.httpOptions);
  }

  public loadFileCategorys(): Observable<FileCategory[]> {
    return this.http.get<FileCategory[]>(
      `${environment.serverUrl}/prosecution/pld-master/file-category`,
      this.httpOptions
    );
  }

  public saveIncomingLetter(incomingLetter: IncomingLetter) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/incoming-letter/`, incomingLetter, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public loadUserTaskList(letterStatus: String): Observable<IncomingLetter[]> {
    return new Observable<IncomingLetter[]>((observer) => {
      this.http
        .get<IncomingLetter[]>(
          `${environment.serverUrl}/prosecution/incoming-letter/by-status/${letterStatus}`,
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

  public loadIncomingLetter(incomingLetterId: number): Observable<IncomingLetter> {
    return new Observable<IncomingLetter>((observer) => {
      this.http
        .get<IncomingLetter>(
          `${environment.serverUrl}/prosecution/incoming-letter/${incomingLetterId}`,
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

  public deleteIncomingLetter(incomingLetterId: number) {
    return this.http
      .post<any>(`${environment.serverUrl}/prosecution/incoming-letter/delete/${incomingLetterId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public forwardIncomingLetter(incomingLetterId: number) {
    return this.http
      .post<any>(
        `${environment.serverUrl}/prosecution/incoming-letter/start-case-process/${incomingLetterId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public saveAttachment(fileToUpload: File, letterName: string) {
    const endpoint = `${environment.serverUrl}/prosecution/common/uploadDocFile`;
    const formData: FormData = new FormData();
    formData.append('File', fileToUpload, fileToUpload.name);
    formData.append('letterName', letterName);
    return this.http.post(endpoint, formData).pipe(catchError(this.errorHandler));
  }

  public saveIncomingLetterAttachment(newCaseAttachment: CaseAttachment) {
    return this.http
      .post<CaseAttachment>(
        `${environment.serverUrl}/prosecution/incoming-letter/letter-attachment`,
        newCaseAttachment,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public scheduleMeeting(bookMeetingHall: MeetingHall) {
    return this.http
      .post<MeetingHall>(
        `${environment.serverUrl}/prosecution/meeting/schedule-meeting`,
        bookMeetingHall,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public updateScheduledMeeting(meetingId: number, bookMeetingHall: MeetingHall) {
    return this.http
      .post<MeetingHall>(
        `${environment.serverUrl}/prosecution/meeting/scheduled-meeting/${meetingId}`,
        bookMeetingHall,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public closeScheduledMeeting(meetingId: number) {
    return this.http
      .post<MeetingHall>(
        `${environment.serverUrl}/prosecution/meeting/close-scheduled-meeting/${meetingId}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  public loadConferenceHall(): Observable<MeetingHall[]> {
    return new Observable<MeetingHall[]>((observer) => {
      this.http
        .get<MeetingHall[]>(`${environment.serverUrl}/prosecution/meeting/conference-hall`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public secheduledMeeting(): Observable<MeetingHall[]> {
    return new Observable<MeetingHall[]>((observer) => {
      this.http
        .get<MeetingHall[]>(`${environment.serverUrl}/prosecution/meeting/scheduled-meeting`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public secheduledMeetingByUser(userId: number): Observable<MeetingHall[]> {
    return new Observable<MeetingHall[]>((observer) => {
      this.http
        .get<MeetingHall[]>(
          `${environment.serverUrl}/prosecution/meeting/scheduled-meeting-by-userId/${userId}`,
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

  public LoadScheduledMeetingById(meetingId: number): Observable<MeetingHall> {
    return this.http.get<MeetingHall>(
      `${environment.serverUrl}/prosecution/meeting/scheduled-meeting/${meetingId}`,
      this.httpOptions
    );
  }

  public getPldSequence(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/prosecution/pld-master/letter-squence`, this.httpOptions);
  }

  public updateSequence(): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl}/prosecution/pld-master/letter-squence`, this.httpOptions);
  }
}
