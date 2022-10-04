export interface UserJwtPayload {
  id: number;
  email?: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
}

export interface CompanyAdminJwtPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
