import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { environment } from '@env/environment';
import { Credentials, CredentialsService } from './credentials.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    return Observable.create((observer: Observer<any>) => {
      return this.http
        .post(`${environment.serverUrl}/authenticate`, { username: context.username, password: context.password })
        .subscribe(
          (response: any) => {
            const data = {
              username: context.username,
              token: response.jwt,
              roleid: response.user.roleId,
              role: response.user.role,
              employeename: response.user.employeeName,
              employeeid: response.user.employeeId,
              userid: response.user.userId,
            };
            this.credentialsService.setCredentials(data, context.remember);
            observer.next(data);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  /**
   * get logged in user details.
   * @param username The logged in username.
   * @return The user details.
   */
  getUserDetail(username: string) {
    return this.http.get<any>(`${environment.serverUrl}/user-master/get-user-details/${username}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
