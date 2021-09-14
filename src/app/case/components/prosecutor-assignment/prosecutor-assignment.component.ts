import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { User } from '@app/case/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-prosecutor-assignment',
  templateUrl: './prosecutor-assignment.component.html',
  styleUrls: ['./prosecutor-assignment.component.scss'],
})
export class ProsecutorAssignmentComponent implements OnInit {
  @Input() users: Observable<User[]>;
  @Output() assignProsecutor: EventEmitter<any> = new EventEmitter<any>();

  assignmentForm: FormGroup;
  assignType: string;
  groupAssignees: any[] = [];
  groupAssigneesId: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.assignmentForm = this.fb.group({
      assignTo: new FormControl('', Validators.required),
      assignType: new FormControl('', Validators.required),
      followedDueProcess: new FormControl('', Validators.required),
    });
  }

  toggleAssignmentType(assignmentType: string) {
    this.assignType = assignmentType;
    if (assignmentType === 'individual') {
      this.groupAssignees = [];
      this.groupAssigneesId = [];
    }
  }

  addGroupAssignee(event: MatSelectChange) {
    var assignee = {};
    assignee['id'] = event.value;
    assignee['employeeName'] = event.source.triggerValue;
    this.groupAssignees.push(assignee);
    this.groupAssigneesId.push(event.value);
  }

  assigneeName: string;
  getAssigneeName(event: MatSelectChange) {
    this.assigneeName = event.source.triggerValue;
  }

  assigneeTeamLead(teamLeadId: number) {
    this.assignmentForm.controls.assignTo.setValue(teamLeadId);
  }

  assignTask() {
    if (this.assignmentForm.valid) {
      const hasFollowedDueProcess = this.assignmentForm.get('followedDueProcess').value === 'Y' ? true : false;
      const taskAssignment = {
        assignTo: this.assignmentForm.get('assignTo').value,
        assigneeName: this.assigneeName,
        assignType: this.assignmentForm.get('assignType').value,
        groupAssignees: this.groupAssigneesId,
        hasFollowedDueProcess: hasFollowedDueProcess,
      };
      this.assignProsecutor.emit(taskAssignment);
    } else {
      return;
    }
  }
}
