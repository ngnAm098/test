import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of, throwError } from 'rxjs';
import { Staff } from '../models/staff';
import { StatData } from '../models/stat-data';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
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

  public loadUnderCorpusData(): Observable<StatData> {
    return of({
      total: 50,
    });
  }

  public loadOngoingData(): Observable<StatData> {
    return of({
      total: 15,
    });
  }

  public loadAppealedData(): Observable<StatData> {
    return of({
      total: 5,
    });
  }

  public loadClosedData(): Observable<StatData> {
    return of({
      total: 21,
    });
  }

  public loadStaffPresentStatus(): Observable<Staff[]> {
    return of([
      {
        staffName: 'Poojan Sharma',
        email: 'poojan.d.sharma@gmail.com',
        status: 'Hospital',
      },
      {
        staffName: 'Aman Mongar',
        email: 'aman.mongar@gmail.com',
        status: 'Present',
      },
      {
        staffName: 'Amrita Limboo',
        email: 'alimboo@oag.gov.bt',
        status: 'Present',
      },
      {
        staffName: 'Phurpa Thinley',
        email: 'phurpathinley@oag.gov.bt',
        status: 'Present',
      },
      {
        staffName: 'Khemlal Chhetri',
        email: 'khemlal@oag.gov.bt',
        status: 'Present',
      },
      {
        staffName: 'Prakriti Rai',
        email: 'prakritirai@oag.gov.bt',
        status: 'Maternity Leave',
      },
    ]);
  }

  public loadUserTaskList(userId: number): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.http
        .get<Task[]>(
          `${environment.serverUrl}/prosecution/incoming-letter/user-pending-task/${userId}`,
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

  public loadGroupTaskList(userId: number): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.http
        .get<Task[]>(
          `${environment.serverUrl}/prosecution/incoming-letter/group-assignment/${userId}`,
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

  public onGoingTaskList(userId: number): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.http
        .get<Task[]>(`${environment.serverUrl}/prosecution/incoming-letter/by-userId/${userId}`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadCaseToMonitor(): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.http
        .get<Task[]>(`${environment.serverUrl}/prosecution/incoming-letter/active-task`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }
}
