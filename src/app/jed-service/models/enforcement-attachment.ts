export class EnforcementAttachment {
  
  id: number;
  documentType: string;
  documentName: string;
  documentPath: string;  
  enforcement: any;

  action: string;
  remark: string;
  
  file: File;
  taskVariables: any;
} 
