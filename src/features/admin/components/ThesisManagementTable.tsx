import { useState } from 'react';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Thesis } from '@/types/thesis';
import { useDownloadThesis } from '@/features/thesis/hooks/useThesis';
import { toast } from 'sonner';

interface ThesisManagementTableProps {
  theses: Thesis[];
  isLoading?: boolean;
}

const ThesisManagementTable = ({ theses, isLoading }: ThesisManagementTableProps) => {
  const { mutate: downloadThesis } = useDownloadThesis();

  const handleView = (thesis: Thesis) => {
    // Navigate to view thesis detail (to be implemented)
    toast.info('View Thesis', {
      description: `Opening details for: ${thesis.title}`,
    });
  };

  const handleEdit = (thesis: Thesis) => {
    // Navigate to edit thesis form (to be implemented)
    toast.info('Edit Thesis', {
      description: `Editing: ${thesis.title}`,
    });
  };

  const handleDelete = (thesis: Thesis) => {
    // Open delete confirmation dialog (to be implemented)
    toast.info('Delete Thesis', {
      description: `Delete action for: ${thesis.title}`,
    });
  };

  const handleDownload = (thesisId: string) => {
    downloadThesis(thesisId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading thesis records...</p>
      </div>
    );
  }

  if (theses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground mb-2">No thesis records found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Authors</TableHead>
            <TableHead className="font-semibold">Program</TableHead>
            <TableHead className="font-semibold">Year</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {theses.map((thesis) => (
            <TableRow key={thesis.id} className="hover:bg-muted/20">
              <TableCell className="font-medium max-w-xs">
                <div className="truncate" title={thesis.title}>
                  {thesis.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {thesis.authors.map(author => author.name).join(', ')}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{thesis.program}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{thesis.year}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(thesis)}
                    className="h-8 w-8 p-0"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(thesis)}
                    className="h-8 w-8 p-0"
                    title="Edit thesis"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(thesis.id)}
                    className="h-8 w-8 p-0"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(thesis)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Delete thesis"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThesisManagementTable;
