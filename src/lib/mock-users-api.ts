import { StudentAssistant, StudentAssistantFormData } from '@/types/user';

// Mock data
const mockStudentAssistants: StudentAssistant[] = [
  {
    id: '1',
    email: 'assistant1@twa.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: 'student-assistant',
    department: 'college',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    email: 'assistant2@twa.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'student-assistant',
    department: 'senior-high',
    createdAt: '2024-02-20T14:30:00Z',
    isActive: true,
  },
];

let assistants = [...mockStudentAssistants];

export const mockUsersApi = {
  // Get all student assistants
  getStudentAssistants: async (): Promise<StudentAssistant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...assistants]), 500);
    });
  },

  // Get single student assistant
  getStudentAssistant: async (id: string): Promise<StudentAssistant | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const assistant = assistants.find((a) => a.id === id);
        resolve(assistant || null);
      }, 300);
    });
  },

  // Create student assistant
  createStudentAssistant: async (
    data: StudentAssistantFormData
  ): Promise<StudentAssistant> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAssistant: StudentAssistant = {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'student-assistant',
          department: data.department,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        assistants.push(newAssistant);
        resolve(newAssistant);
      }, 500);
    });
  },

  // Update student assistant
  updateStudentAssistant: async (
    id: string,
    data: Partial<StudentAssistantFormData>
  ): Promise<StudentAssistant> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = assistants.findIndex((a) => a.id === id);
        if (index === -1) {
          reject(new Error('Student assistant not found'));
          return;
        }
        assistants[index] = {
          ...assistants[index],
          ...data,
        };
        resolve(assistants[index]);
      }, 500);
    });
  },

  // Delete student assistant
  deleteStudentAssistant: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = assistants.findIndex((a) => a.id === id);
        if (index === -1) {
          reject(new Error('Student assistant not found'));
          return;
        }
        assistants = assistants.filter((a) => a.id !== id);
        resolve();
      }, 500);
    });
  },

  // Toggle active status
  toggleActiveStatus: async (id: string): Promise<StudentAssistant> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = assistants.findIndex((a) => a.id === id);
        if (index === -1) {
          reject(new Error('Student assistant not found'));
          return;
        }
        assistants[index].isActive = !assistants[index].isActive;
        resolve(assistants[index]);
      }, 300);
    });
  },
};
