import { EmployeeDetails } from './employee-details';

export interface User {
  id: number;
  username: number;
  employeeId: number;
  roleId: number;
  employeeDetails: EmployeeDetails;
}
