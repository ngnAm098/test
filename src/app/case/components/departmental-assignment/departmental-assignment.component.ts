import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/case/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-departmental-assignment',
  templateUrl: './departmental-assignment.component.html',
  styleUrls: ['./departmental-assignment.component.scss'],
})
export class DepartmentalAssignmentComponent implements OnInit {
  @Input() users: Observable<User[]>;
  @Output() assignDepartmentalTask: EventEmitter<Number> = new EventEmitter<Number>();
  assignmentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.assignmentForm = this.fb.group({
      assignTo: new FormControl('', Validators.required),
    });
  }

  assignTask() {
    if (this.assignmentForm.valid) {
      this.assignDepartmentalTask.emit(this.assignmentForm.get('assignTo').value);
    } else {
      return;
    }
  }
}
