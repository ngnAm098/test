import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Credentials } from '@app/auth';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @Input() user: Credentials;
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();

  public signOutEmit(): void {
    this.signOut.emit();
  }

  get username(): string | null {
    const credentials = this.user;
    return credentials ? credentials.employeename : null;
  }
}
