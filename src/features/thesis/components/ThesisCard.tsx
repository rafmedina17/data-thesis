import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Eye, FileText, Users } from "lucide-react";
import { Thesis } from "@/types/thesis";
import { useDownloadThesis } from "../hooks/useThesis";

interface ThesisCardProps {
  thesis: Thesis;
  onClick?: (thesis: Thesis) => void;
}

const ThesisCard = ({ thesis, onClick }: ThesisCardProps) => {
  const downloadMutation = useDownloadThesis();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMutation.mutate(thesis.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-normal hover:shadow-md hover:-translate-y-1 border-border/50 hover:border-primary/20 overflow-hidden"
      onClick={() => onClick?.(thesis)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {thesis.category}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {thesis.year}
          </div>
        </div>

        {/* Title & Abstract */}
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-normal">
          {thesis.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {thesis.abstract}
        </p>

        {/* Authors */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Users className="w-4 h-4 mr-2" />
          <span className="truncate">
            {thesis.authors.map(author => author.name).join(', ')}
          </span>
        </div>

        {/* Program & Date */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="w-4 h-4 mr-2" />
            <span>{thesis.program}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(thesis.dateSubmitted)}</span>
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-4">
          {thesis.keywords.slice(0, 3).map((keyword, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs px-2 py-1"
            >
              {keyword}
            </Badge>
          ))}
          {thesis.keywords.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{thesis.keywords.length - 3} more
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{thesis.viewCount.toLocaleString()}</span>
            </div>
            <span>{thesis.pages} pages</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ThesisCard;