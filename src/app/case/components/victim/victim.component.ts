import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { Credentials, CredentialsService } from '@app/auth';
import { Dzongkhag } from '@app/case/models/dzongkhag';
import { Gewog } from '@app/case/models/gewog';
import { Ministry } from '@app/case/models/ministry';
import { Victim } from '@app/case/models/victim';
import { Village } from '@app/case/models/village';
import { CaseService } from '@app/case/services/case.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-victim',
  templateUrl: './victim.component.html',
  styleUrls: ['./victim.component.scss'],
})
export class VictimComponent implements OnInit {
  maxDate = new Date();
  @Input() dzongkhags: Observable<Dzongkhag[]>;
  @Input() gewogs: Observable<Gewog[]>;
  @Input() villages: Observable<Village[]>;
  @Input() ministrys: Observable<Ministry[]>;
  @Input() victiml: Observable<Victim[]>;

  @Output() getGewogsEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() getVillagesEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() saveVictim: EventEmitter<Victim> = new EventEmitter<Victim>();

  individualVictimForm: FormGroup;
  organizationVictimForm: FormGroup;
  caseType: string;
  isFormReset: boolean;
  incomingLetterId:number;
  caseId:number;
  victims:Victim[];
  victimId:number;
  credentials:Credentials;

  constructor(
    private fb: FormBuilder, 
    private caseService: CaseService,
    private route:ActivatedRoute,
    private credentialService: CredentialsService,
    private notificationService: NotificationService) {
      this.credentials = this.credentialService.credentials;
    }

  ngOnInit(): void {
  this.route.queryParams.subscribe((params)=>{
  this.incomingLetterId = params.incomingLetterId;
  this.caseId = params.caseId;
   });
    this.initializeForm();
    this.getAllVictims();
    this.getAllVictimsByCaseId();
  }

  ngAfterViewInit() {
    this.caseService.getCaseType.subscribe((caseType) => {
      this.caseType = caseType;
    });

    this.caseService.getFormReset.subscribe(() => {
      this.individualVictimForm.reset();
      this.organizationVictimForm.reset();
    });
  }

  get role(): string | null {
    const credentials = this.credentialService.credentials;
    return credentials ? credentials.role : null;
  }

  initializeForm() {
    this.individualVictimForm = this.fb.group({
      victimCid: new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      victimName: ['', Validators.required],
      victimDob: ['', Validators.required],
      victimGender: ['', Validators.required],
      nationality: ['', Validators.required],
      victimContactNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      presentAddress: ['', Validators.required],
      occupation: ['', Validators.required],
      houseNo: ['', Validators.required],
      thramNo: ['', Validators.required],
      dzongkhagId: ['', Validators.required],
      gewogId: ['', Validators.required],
      villageId: ['', Validators.required],
    });

    this.organizationVictimForm = this.fb.group({
      ministryId: ['', Validators.required],
      presentAddress: ['', Validators.required],
      victimContactNo: ['', Validators.required],
    });
  }

  getAllVictims(){ 
    if(this.caseId){ 
      this.caseService.getAllVictims(this.caseId).subscribe((response) => {
        this.victims = response;
      });
    } 
  }

  getAllVictimsByCaseId(){
    if(this.role ==='Registrar'){
      if(Number(localStorage.getItem('savedCaseId'))){
        this.caseService.getAllVictims(Number(localStorage.getItem('savedCaseId'))).subscribe((response) => {
          this.victims = response;
        });
      }

    }

  }
  editVictim(victimId:number){
    this.caseService.getVictim(victimId).subscribe((response)=>{
    if(response){
      this.victimId = response.id;
      if(response.ministry === null){
        this.individualVictimForm.patchValue({
          victimCid: response.victimCid,
           victimName:response.victimName,
           victimDob: response.victimDob,
           victimGender:response.victimGender,
           nationality:response.nationality,
           victimContactNo:response.victimContactNo,
           presentAddress:response.presentAddress,
           occupation:response.occupation,
           houseNo: response.houseNo, 
           thramNo: response.thramNo,
           dzongkhagId:response.dzongkhag.id,
           gewogId: response.gewog.id,
           villageId: response.village.id,
           
         });
    
         this.getGewogs(response.dzongkhag.id);
         this.getVillages(response.gewog.id);

      }else{
        this.organizationVictimForm.patchValue({
          ministryId:response.ministry.id,
          victimContactNo:response.victimContactNo,
          presentAddress:response.presentAddress,
        });
      }
      
    }
    })
  }

  getGewogs(dzongkhagId: number) {
    this.getGewogsEmit.emit(dzongkhagId);
  }

  getVillages(gewogId: number) {
    this.getVillagesEmit.emit(gewogId);
  }

  saveVictimEmit(saveType: string) {
    if (this.individualVictimForm.valid || this.organizationVictimForm.valid) {
      const victim = new Victim();
      if (this.individualVictimForm.valid) {
        Object.assign(victim, this.individualVictimForm.value);
        victim.id =this.victimId;
        victim.caseId = this.caseId;
        victim.dzongkhag = { id: this.individualVictimForm.get('dzongkhagId').value };
        victim.gewog = { id: this.individualVictimForm.get('gewogId').value };
        victim.village = { id: this.individualVictimForm.get('villageId').value };
      } else {
        Object.assign(victim, this.organizationVictimForm.value);
        victim.id =this.victimId;
        victim.caseId = this.caseId;
        victim.ministry = { id: this.organizationVictimForm.get('ministryId').value };
      }
     // this.saveVictim.emit(victim);

       
    victim.updatedBy = this.credentials.userid;
    victim.updatedOn = new Date();
    victim.updatedByName = this.credentials.username;
    if(victim.caseId !== null && victim.caseId !== undefined){
      victim.caseInformation = { id: Number(victim.caseId) };

      this.caseService.saveVictimInformation(victim).subscribe(
        (response) => {
          this.notificationService.openSuccessSnackBar('Victim information successfully Updated');
          this.caseService.triggerFormReset();
          this.getAllVictims();
        },
        () => {
          this.notificationService.openErrorSnackBar('Victim information couldnot be updated, please try again');
        }
      );
        
    }else{
      const caseInformationId = localStorage.getItem('savedCaseId');
      victim.caseInformation = { id: Number(caseInformationId) };
      this.caseService.saveVictimInformation(victim).subscribe(
        () => {
         this.notificationService.openSuccessSnackBar('Victim information successfully saved')
         this.caseService.triggerFormReset();
         this.getAllVictimsByCaseId();

        },
        () => {
          this.notificationService.openErrorSnackBar('Victim information couldnot be saved, please try again');
        }
      );
    }


    } else {
      return;
    }
  }
}
