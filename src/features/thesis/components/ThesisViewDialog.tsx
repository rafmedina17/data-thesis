import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Users, BookOpen} from "lucide-react";
import { Thesis } from "@/types/thesis";
import DepartmentSelector from "@/features/landing/components/DepartmentSelector";

interface ThesisViewDialogProps {
  thesis: Thesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThesisViewDialog = ({ thesis, open, onOpenChange }: ThesisViewDialogProps) => {
  if (!thesis) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{thesis.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Category and Year */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {thesis.category}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {thesis.year}
              </Badge>
            </div>

            {/* Authors Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Authors</h3>
              </div>
              <div className="space-y-2">
                {thesis.authors.map((author) => (
                  <div key={author.id} className="flex flex-col">
                    <span className="font-medium">{author.name}</span>
                    {author.email && (
                      <span className="text-sm text-muted-foreground">{author.email}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Abstract */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Abstract/Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {thesis.abstract}
              </p>
            </div>

            <Separator />

            {/* Thesis Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Program</p>
                  <p className="text-sm text-muted-foreground">{thesis.program}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date Submitted</p>
                  <p className="text-sm text-muted-foreground">{formatDate(thesis.dateSubmitted)}</p>
                </div>
              </div>
            
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ThesisViewDialog;
