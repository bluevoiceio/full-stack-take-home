export type UserRole = 'admin' | 'officer';

export type TitleRank =
  | 'Officer'
  | 'Detective'
  | 'Corporal'
  | 'Sergeant'
  | 'Lieutenant'
  | 'Captain'
  | 'Chief of Police'
  | 'Dispatcher';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: TitleRank;
  employeeId: string;
  departmentId: string;
  role: UserRole;
  superiorEmail: string | null;
}

export interface Department {
  id: string;
  name: string;
  city: string;
  state: string;
  timezone: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
