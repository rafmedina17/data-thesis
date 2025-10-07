import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockUsersApi } from '@/lib/mock-users-api';
import { StudentAssistantFormData } from '@/types/user';
import { toast } from '@/hooks/use-toast';

const QUERY_KEY = 'student-assistants';

export const useStudentAssistants = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: mockUsersApi.getStudentAssistants,
  });
};

export const useCreateStudentAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentAssistantFormData) =>
      mockUsersApi.createStudentAssistant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Student assistant created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create student assistant',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStudentAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudentAssistantFormData> }) =>
      mockUsersApi.updateStudentAssistant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Student assistant updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update student assistant',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteStudentAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockUsersApi.deleteStudentAssistant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Student assistant deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete student assistant',
        variant: 'destructive',
      });
    },
  });
};

export const useToggleActiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockUsersApi.toggleActiveStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    },
  });
};
