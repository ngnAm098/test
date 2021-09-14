import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department } from '../models/department';
import { Division } from '../models/division';
import { DivisionUnit } from '../models/divisionUnit';
import { Employee } from '../models/employee';
import { Organization } from '../models/organization';
import { Role } from '../models/role';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
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

  public loadAgencyList(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${environment.serverUrl}/master/organisation`, this.httpOptions);
  }

  public loadDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(`${environment.serverUrl}/master/department`, this.httpOptions);
  }

  public loadDivisionList(departmentId: number): Observable<Division[]> {
    return this.http.get<Division[]>(
      `${environment.serverUrl}/master/division-by-department-id/${departmentId}`,
      this.httpOptions
    );
  }

  public loadDivisionUnitList(divisionId: number): Observable<DivisionUnit[]> {
    return this.http.get<DivisionUnit[]>(
      `${environment.serverUrl}/master/division-unit-by-division-id/${divisionId}`,
      this.httpOptions
    );
  }

  public loadEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.serverUrl}/master/employee-list`, this.httpOptions);
  }

  public loadUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.serverUrl}/user-master/user-list`, this.httpOptions);
  }

  public loadRoleList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.serverUrl}/user-master/role`, this.httpOptions);
  }

  public loadEmployee(employeeId: number): Observable<any> {
    return new Observable<any>((observer) => {
      this.http
        .get<any>(`${environment.serverUrl}/master/employee-list-by-id/${employeeId}`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public loadUser(userId: number): Observable<any> {
    return new Observable<any>((observer) => {
      this.http
        .get<any>(`${environment.serverUrl}/user-master/get-user-details-by-id/${userId}`, this.httpOptions)
        .subscribe(
          (response) => {
            observer.next(response);
          },
          () => observer.error()
        );
    });
  }

  public saveEmployee(employee: Employee) {
    return this.http
      .post<any>(`${environment.serverUrl}/user-master/register-employee/`, employee, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public deleteEmployee(employeeId: number) {
    return this.http
      .post<any>(`${environment.serverUrl}/master/delete-employee-by-id/${employeeId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public saveUser(user: User) {
    return this.http
      .post<any>(`${environment.serverUrl}/user-master/create-user/`, user, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  public deleteUser(userId: number) {
    return this.http
      .post<any>(`${environment.serverUrl}/master/delete-user-by-id/${userId}`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
}
