import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, Filter, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/stores/ui-store";
import { useThesisList } from "../hooks/useThesis";
import { ThesisFilters } from "@/types/thesis";
import SearchInput from "@/components/shared/SearchInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ThesisCard from "./ThesisCard";

interface ThesisDashboardProps {
  department: 'college' | 'senior-high';
}

const ThesisDashboard = ({ department }: ThesisDashboardProps) => {
  const navigate = useNavigate();
  const { viewMode, setViewMode, searchQuery } = useUIStore();
  const [filters, setFilters] = useState<ThesisFilters>({
    department,
  });

  // Update filters when search changes
  const currentFilters = {
    ...filters,
    search: searchQuery || undefined,
  };

  const { data, isLoading, error } = useThesisList(currentFilters);

  const departmentTitle = department === 'college' ? 'College Department' : 'Senior High School';

  const handleFilterChange = (key: keyof ThesisFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const programs = department === 'college' 
    ? ['Computer Science', 'Environmental Science', 'Business Administration', 'Engineering']
    : ['STEM', 'Humanities and Social Sciences', 'Accountancy and Business Management'];

  const years = [2024, 2023, 2022, 2021, 2020];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading thesis collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Something went wrong</p>
          <p className="text-muted-foreground mb-4">Unable to load thesis data</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-muted/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{departmentTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {data?.total || 0} research papers available
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <SearchInput 
                placeholder={`Search ${department} thesis...`}
                className="w-full sm:w-auto"
              />
              
              <div className="flex gap-2">
                <Select 
                  value={filters.program || 'all'} 
                  onValueChange={(value) => handleFilterChange('program', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map(program => (
                      <SelectItem key={program} value={program}>{program}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={filters.year?.toString() || 'all'} 
                  onValueChange={(value) => handleFilterChange('year', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {data?.data.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No thesis found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {data?.data.map((thesis) => (
              <ThesisCard 
                key={thesis.id} 
                thesis={thesis}
                onClick={(thesis) => {
                  // Navigate to thesis detail page (to be implemented)
                  console.log('Navigate to thesis:', thesis.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThesisDashboard;