import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { AuthenticationService, Credentials, CredentialsService } from '@app/auth';
import { routes } from './consts/routes.enum';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  public user: Credentials;
  public routes: typeof routes = routes;

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver
  ) {
    this.user = this.credentialsService.credentials;
  }

  ngOnInit() {}

  signOut() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.employeename : null;
  }

  get role(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.role : null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
