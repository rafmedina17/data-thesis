import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsStore } from '@/stores/settings-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Thesis } from '@/types/thesis';

const thesisSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  authors: z.string().min(2, 'At least one author is required'),
  program: z.string().min(1, 'Program is required'),
  year: z.number().min(2000).max(new Date().getFullYear() + 1),
  abstract: z.string().min(50, 'Abstract must be at least 50 characters'),
});

type ThesisFormData = z.infer<typeof thesisSchema>;

interface EditThesisDialogProps {
  thesis: Thesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



const EditThesisDialog = ({ thesis, open, onOpenChange }: EditThesisDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { getProgramsByDepartment } = useSettingsStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const availablePrograms = thesis ? getProgramsByDepartment(thesis.department) : [];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const form = useForm<ThesisFormData>({
    resolver: zodResolver(thesisSchema),
    defaultValues: {
      title: '',
      authors: '',
      program: '',
      year: currentYear,
      abstract: '',
    },
  });

  // Update form when thesis changes
  useEffect(() => {
    if (thesis) {
      form.reset({
        title: thesis.title,
        authors: thesis.authors.map(a => a.name).join(', '),
        program: thesis.program,
        year: thesis.year,
        abstract: thesis.abstract,
      });
      setSelectedFile(null);
    }
  }, [thesis, form]);

  const editThesisMutation = useMutation({
    mutationFn: async (data: ThesisFormData & { file: File | null; thesisId: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, upload file and update thesis record
      console.log('Updating thesis:', data);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Thesis updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['theses'] });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update thesis. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ThesisFormData) => {
    if (!thesis) return;

    editThesisMutation.mutate({ ...data, file: selectedFile, thesisId: thesis.id });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Error',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: 'Error',
          description: 'File size must be less than 50MB',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  if (!thesis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {thesis.department === 'college' ? 'College' : 'Senior High'} Thesis</DialogTitle>
          <DialogDescription>
            Update the thesis details and optionally upload a new PDF file
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter thesis title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Authors */}
            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe, Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Program and Year Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availablePrograms.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No programs available
                          </div>
                        ) : (
                          availablePrograms.map(program => (
                            <SelectItem key={program.id} value={program.name}>
                              {program.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>



            {/* Abstract */}
            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter thesis abstract" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>PDF File (Optional - Upload to replace existing)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload-edit"
                />
                <label htmlFor="pdf-upload-edit" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload new PDF file (Max 50MB)
                      </p>
                      {thesis.pdfUrl && (
                        <p className="text-xs text-muted-foreground">
                          Current file will be kept if not replaced
                        </p>
                      )}
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={editThesisMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editThesisMutation.isPending}>
                {editThesisMutation.isPending ? 'Updating...' : 'Update Thesis'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditThesisDialog;
