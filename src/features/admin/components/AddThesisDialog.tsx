import { useState, useEffect } from 'react';
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
import { Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { PDFPreview } from '@/components/shared/PDFPreview';

const thesisSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  authors: z.string().min(2, 'At least one author is required'),
  program: z.string().min(1, 'Program is required'),
  year: z.number().min(2000).max(new Date().getFullYear() + 1),
  abstract: z.string().min(50, 'Abstract must be at least 50 characters'),
});

type ThesisFormData = z.infer<typeof thesisSchema>;

interface AddThesisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: 'college' | 'senior-high';
}

const collegePrograms = ['Computer Science', 'Environmental Science', 'Business Administration', 'Engineering'];
const seniorHighPrograms = ['STEM', 'Humanities and Social Sciences', 'Accountancy and Business Management'];



const AddThesisDialog = ({ open, onOpenChange, department }: AddThesisDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { getProgramsByDepartment } = useSettingsStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const availablePrograms = getProgramsByDepartment(department);
  
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

  const addThesisMutation = useMutation({
    mutationFn: async (data: ThesisFormData & { file: File | null }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, upload file and create thesis record
      console.log('Adding thesis:', data);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Thesis added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['theses'] });
      form.reset();
      setSelectedFile(null);
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add thesis. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ThesisFormData) => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    addThesisMutation.mutate({ ...data, file: selectedFile });
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
      
      // Create blob URL for PDF preview
      const url = URL.createObjectURL(file);
      setPdfPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  // Cleanup blob URL on unmount or when dialog closes
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  useEffect(() => {
    if (!open && pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New {department === 'college' ? 'College' : 'Senior High'} Thesis</DialogTitle>
          <DialogDescription>
            Fill in the thesis details and upload the PDF file
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
              <Label>PDF File *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFile();
                        }}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload PDF file (Max 50MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* PDF Preview */}
            {pdfPreviewUrl && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">PDF Preview</Label>
                    <p className="text-xs text-muted-foreground">
                      You can copy and paste metadata from the preview below
                    </p>
                  </div>
                  <PDFPreview fileUrl={pdfPreviewUrl} />
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={addThesisMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addThesisMutation.isPending}>
                {addThesisMutation.isPending ? 'Adding...' : 'Add Thesis'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddThesisDialog;
