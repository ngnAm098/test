import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth'; 
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compensation-discussion',
  templateUrl: './compensation-discussion.component.html',
  styleUrls: ['./compensation-discussion.component.scss']
})
export class CompensationDiscussionComponent implements OnInit {

  @Output() completeUserTask: EventEmitter<any> = new EventEmitter<any>(); 

  enforcementForm: FormGroup;
  enforcementId: number;
  title: string;
  formKey: string;

  constructor(
    private fb: FormBuilder,
    private credentialService: CredentialsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {  
    this.route.queryParams.subscribe((params) => { 
      this.enforcementId = params.enforcementId;
      this.formKey = params.formKey;  
      if(this.formKey === 'DISCUSSION-WITH-CHIEF') {
        this.title = "Discussion with chief";
      }else if(this.formKey === 'DISCUSSION-WITH-VICTIM') {
        this.title = "Discussion with victim";
      }else if(this.formKey === 'DISCUSSION-WITH-AG') {
        this.title = "Discussion with Attorney General";
      }
    });

    this.enforcementForm = this.fb.group({  
      compensationType:  new FormControl('', Validators.required), 
    });
  }  

  proceedTask() { 
    let taskVariables = [];
    if(this.enforcementForm.get('compensationType').value === 'fullPayment') { 
      taskVariables = [
        { key: 'victimAgree', value: "fullPayment" },
      ];
    }else if(this.enforcementForm.get('compensationType').value === 'partPayment') {
      taskVariables = [
        { key: 'victimAgree', value: "partPayment" },
      ];
    }else {
      taskVariables = [
        { key: 'victimAgree', value: "court" },
      ];
    }
    this.completeUserTask.emit(taskVariables);
  } 

  proceedTaskByChief() { 
    let taskVariables = [];
    if(this.enforcementForm.get('compensationType').value === 'fullPayment') { 
      taskVariables = [
        { key: 'headDecision', value: "fullPayment" },
      ];
    }else if(this.enforcementForm.get('compensationType').value === 'partPayment') {
      taskVariables = [
        { key: 'headDecision', value: "partPayment" },
      ];
    }else {
      taskVariables = [
        { key: 'headDecision', value: "sendToAG" },
        { key: 'assigneeAG', value: 14 },
      ];
    }
    this.completeUserTask.emit(taskVariables);
  } 

  proceedTaskByAG() { 
    let taskVariables = [];
    if(this.enforcementForm.get('compensationType').value === 'fullPayment') { 
      taskVariables = [
        { key: 'agDecision', value: "fullPayment" },
      ];
    }else if(this.enforcementForm.get('compensationType').value === 'partPayment') {
      taskVariables = [
        { key: 'agDecision', value: "partPayment" },
      ];
    }else {
      taskVariables = [
        { key: 'agDecision', value: "sendToAG" }, 
      ];
    }
    this.completeUserTask.emit(taskVariables);
  } 
}
