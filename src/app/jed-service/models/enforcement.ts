export class Enforcement {
    id: number;
    caseId: number;
    prosecutor: string;
    judgementDate: Date;
    pjeuAssigneeId: number;
    pjeuAssigneeName: string;
    pjeuAssignedOn: Date;
    pjeuEndedOn: Date;
    totalAmount: number;
    receivedSum: number;
    addedOn: Date;
    addedBy: number;
    active: string;
    judgementNo: string;
    updaterName: string;
    followUpAction: string;
    followUpRemarks: string;
}

export class EnforcementFollowUp {
    id: number;    
    updateDate: Date;
    action: string;
    remarks: string;
    updaterName: string;
    updaterId: number; 
    enforcement: any;
}