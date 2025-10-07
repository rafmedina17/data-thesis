export interface StudentAssistant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student-assistant';
  department: 'college' | 'senior-high' | 'both';
  createdAt: string;
  isActive: boolean;
}

export interface StudentAssistantFormData {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}
