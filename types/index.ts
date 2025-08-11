export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  managerId: string | null;
  imageUrl?: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  salary: number;
  directReports: number;
  level: number;
  skills: string[];
  performance: number;
  status: 'active' | 'inactive' | 'on-leave';
}
