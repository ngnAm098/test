import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core'; 
import { Credentials, CredentialsService } from '@app/auth';
import { Country } from '@app/case/models/country';
import { Defendant } from '@app/case/models/defendant';
import { Dzongkhag } from '@app/case/models/dzongkhag';
import { Gewog } from '@app/case/models/gewog';
import { Village } from '@app/case/models/village';
import { CaseService } from '@app/case/services/case.service';
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-defendant',
  templateUrl: './defendant.component.html',
  styleUrls: ['./defendant.component.scss'],
})
export class DefendantComponent implements OnInit {
  maxDate = new Date();
  defendantForm: FormGroup;
  @Input() dzongkhags: Observable<Dzongkhag[]>;
  @Input() gewogs: Observable<Gewog[]>;
  @Input() villages: Observable<Village[]>;
  @Input() defendants: Observable<Defendant[]>;
  @Input() countryList: Observable<Country[]>;
  @Output() getGewogsEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() getVillagesEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() saveDefendant: EventEmitter<Defendant> = new EventEmitter<Defendant>();

  isFormReset: boolean;
  nationality: String;
  defendantsList: Defendant[];
  incomingLetterId:number;
  caseId:number;
  defendantId:number;
  credentials:Credentials;

  constructor(
    private fb: FormBuilder, 
    private caseService: CaseService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private credentialsService:CredentialsService,
    public dialog: MatDialog,
     ) {

      this.credentials = this.credentialsService.credentials;
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
    this.incomingLetterId = params.incomingLetterId;
    this.caseId = params.caseId;

    });
    this.initializeForm();
    this.getAllDefendants();
    this.getAllDefendantsByCaseId();
   
    this.caseService.getFormReset.subscribe(() => {
      this.defendantForm.reset();
    });
  }

  get role(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.role : null;
  }

  initializeForm() {
    this.defendantForm = this.fb.group({
      defendantCid: new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      defendantName: ['', Validators.required],
      defendantDob: ['', Validators.required],
      defendantGender: ['', Validators.required],
      nationality: ['', Validators.required],
      defendantContactNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      presentAddress: ['', Validators.required],
      occupation: ['', Validators.required],
      houseNo: ['', Validators.required],
      thramNo: ['', Validators.required],
      dzongkhagId: ['', Validators.required],
      gewogId: ['', Validators.required],
      villageId: ['', Validators.required],
      country: ['', Validators.required],
      passPortNumber:['',Validators.required],
      permanentAddress:['',Validators.required]
    });
  }

  public checkFormControl = (controlName: string, errorName: string) => {
    return this.defendantForm.controls[controlName].hasError(errorName);
  };

  getGewogs(dzongkhagId: number) {
    this.getGewogsEmit.emit(dzongkhagId);
  }

  getVillages(gewogId: number) {
    this.getVillagesEmit.emit(gewogId);
  }

  getAllDefendants(){
    if(this.caseId){
      this.caseService.getAllDefendants(this.caseId).subscribe((response) => {
        if(response){
          this.defendantsList = response;
        }
      });
    }
  }
  getAllDefendantsByCaseId(){
    if(this.role==='Registrar'){
      if(Number(localStorage.getItem('savedCaseId'))){
        this.caseService.getAllDefendants(Number(localStorage.getItem('savedCaseId'))).subscribe((response) => {
          if(response){
            this.defendantsList = response;
          }
        });
      }
    }
  }
  editDefendant(defendantId:number){
    this.caseService.getDefendant(defendantId).subscribe((response)=>{
      this.toggleNationality(response.nationality);
         this.defendantId = response.id;
        if(response){
          if(response.dzongkhag === null){
            this.defendantForm.patchValue({
              nationality: response.nationality,
               defendantCid:response.defendantCid,
              defendantName:response.defendantName, 
              defendantDob:response.defendantDob,   
              defendantGender:response.defendantGender,  
              defendantContactNo:response.defendantContactNo, 
              presentAddress: response.presentAddress,
              occupation: response.occupation, 
              houseNo:  response.houseNo,
              thramNo: response.thramNo,
              country:  response.country.id,
              passPortNumber: response.passPortNumber, 
              permanentAddress: response.permanentAddress,
          
            });

          }else{
            this.defendantForm.patchValue({
              nationality: response.nationality,
               defendantCid:response.defendantCid,
              defendantName:response.defendantName, 
              defendantDob:response.defendantDob,   
              defendantGender:response.defendantGender,  
              defendantContactNo:response.defendantContactNo, 
              presentAddress: response.presentAddress,
              occupation: response.occupation, 
              houseNo:  response.houseNo,
              thramNo: response.thramNo,
              passPortNumber: response.passPortNumber, 
              permanentAddress: response.permanentAddress,
              dzongkhagId:response.dzongkhag.id,  
              gewogId: response.gewog.id,
              villageId: response.village.id, 
  
            });
            this.getGewogs(response.dzongkhag.id);
            this.getVillages(response.gewog.id);
          }
        }
    });
  }

  saveDefendantEmit() {
    if (this.defendantForm.valid) {
      const defendant = new Defendant();
      if (this.nationality !== 'Bhutanese') {
        Object.assign(defendant, this.defendantForm.value);
        defendant.id = this.defendantId;
        defendant.caseId = this.caseId;
        defendant.country = { id: this.defendantForm.get('country').value };
      } else {
        Object.assign(defendant, this.defendantForm.value);
        defendant.id = this.defendantId;
        defendant.caseId = this.caseId;
        defendant.dzongkhag = { id: this.defendantForm.get('dzongkhagId').value };
        defendant.gewog = { id: this.defendantForm.get('gewogId').value };
        defendant.village = { id: this.defendantForm.get('villageId').value };
      }
     // this.saveDefendant.emit(defendant); 

     defendant.updatedBy = this.credentials.userid;
     defendant.updatedOn = new Date();
     defendant.updatedByName = this.credentials.username;
 
     if(defendant.caseId !== undefined){
       defendant.caseInformation = {id: Number(defendant.caseId)};
 
       this.caseService.saveDefendantInformation(defendant).subscribe(
         (response) => {
           this.notificationService.openSuccessSnackBar('Defendant information successfully Updated');
           this.caseService.triggerFormReset();
           this.getAllDefendants();
         },
         () => {
           this.notificationService.openErrorSnackBar('Defendant information couldnot be updated, please try again');
         }
       );
 
     }else{
       const caseInformationId = localStorage.getItem('savedCaseId');
       defendant.caseInformation = { id: Number(caseInformationId)};
       this.caseService.saveDefendantInformation(defendant).subscribe(
         () => {
          this.notificationService.openSuccessSnackBar('Defendant information saved successfully');
          this.getAllDefendantsByCaseId();
          this.caseService.triggerFormReset();
        
         },
         () => {
           this.notificationService.openErrorSnackBar('Defendant information couldnot be saved, please try again');
         }
       );
     }
    } else {
      return;
    }
  }

  toggleNationality(nationality: String) {
    this.nationality = nationality;
    if (nationality === 'Bhutanese') {
      this.defendantForm.controls.country.clearValidators();
      this.defendantForm.controls.country.updateValueAndValidity();
      this.defendantForm.controls.passPortNumber.clearValidators();
      this.defendantForm.controls.passPortNumber.updateValueAndValidity();
      this.defendantForm.controls.permanentAddress.clearValidators();
      this.defendantForm.controls.permanentAddress.updateValueAndValidity();

    } else {
      this.defendantForm.controls.country.setValidators(Validators.required);
      this.defendantForm.controls.defendantCid.clearValidators();
      this.defendantForm.controls.defendantCid.updateValueAndValidity();
      this.defendantForm.controls.defendantDob.clearValidators();
      this.defendantForm.controls.defendantDob.updateValueAndValidity();
      this.defendantForm.controls.defendantContactNo.clearValidators();
      this.defendantForm.controls.defendantContactNo.updateValueAndValidity();
      this.defendantForm.controls.presentAddress.clearValidators();
      this.defendantForm.controls.presentAddress.updateValueAndValidity();
      this.defendantForm.controls.occupation.clearValidators();
      this.defendantForm.controls.occupation.updateValueAndValidity();
      this.defendantForm.controls.houseNo.clearValidators();
      this.defendantForm.controls.houseNo.updateValueAndValidity();
      this.defendantForm.controls.thramNo.clearValidators();
      this.defendantForm.controls.thramNo.updateValueAndValidity();
      this.defendantForm.controls.dzongkhagId.clearValidators();
      this.defendantForm.controls.dzongkhagId.updateValueAndValidity();
      this.defendantForm.controls.gewogId.clearValidators();
      this.defendantForm.controls.gewogId.updateValueAndValidity();
      this.defendantForm.controls.villageId.clearValidators();
      this.defendantForm.controls.villageId.updateValueAndValidity();

    }
  }
}
