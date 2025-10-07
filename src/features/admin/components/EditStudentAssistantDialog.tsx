import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StudentAssistant } from '@/types/user';
import { useUpdateStudentAssistant } from '../hooks/useStudentAssistants';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  department: z.enum(['college', 'senior-high', 'both']),
  password: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditStudentAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: StudentAssistant | null;
}

export const EditStudentAssistantDialog = ({
  open,
  onOpenChange,
  assistant,
}: EditStudentAssistantDialogProps) => {
  const updateMutation = useUpdateStudentAssistant();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      department: 'college',
      password: '',
    },
  });

  useEffect(() => {
    if (assistant) {
      form.reset({
        email: assistant.email,
        firstName: assistant.firstName,
        lastName: assistant.lastName,
        department: assistant.department,
        password: '',
      });
    }
  }, [assistant, form]);

  const onSubmit = async (data: FormData) => {
    if (!assistant) return;

    try {
      const updateData: any = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        department: data.department,
      };

      if (data.password) {
        updateData.password = data.password;
      }

      await updateMutation.mutateAsync({
        id: assistant.id,
        data: updateData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update student assistant:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Student Assistant</DialogTitle>
          <DialogDescription>
            Update student assistant account information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="assistant@twa.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Access</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="college">College Only</SelectItem>
                      <SelectItem value="senior-high">Senior High Only</SelectItem>
                      <SelectItem value="both">Both Departments</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave blank to keep current"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Assistant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
