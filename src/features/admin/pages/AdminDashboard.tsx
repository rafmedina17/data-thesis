import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { GraduationCap, LogOut, BookOpen, Users, Database, User } from 'lucide-react';
import SearchInput from '@/components/shared/SearchInput';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ThesisManagementTable from '../components/ThesisManagementTable';
import AddThesisDialog from '../components/AddThesisDialog';
import { useThesisList } from '@/features/thesis/hooks/useThesis';
import { ThesisFilters } from '@/types/thesis';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { searchQuery } = useUIStore();
  const [activeTab, setActiveTab] = useState<'college' | 'senior-high'>('college');
  const [addThesisOpen, setAddThesisOpen] = useState(false);
  
  const [collegeFilters, setCollegeFilters] = useState<ThesisFilters>({
    department: 'college',
  });
  
  const [seniorHighFilters, setSeniorHighFilters] = useState<ThesisFilters>({
    department: 'senior-high',
  });

  // Fetch data for both departments
  const collegeData = useThesisList({
    ...collegeFilters,
    search: searchQuery || undefined,
  });

  const seniorHighData = useThesisList({
    ...seniorHighFilters,
    search: searchQuery || undefined,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePersonalSettings = () => {
    // Navigate to personal settings page (implement as needed)
    navigate('/settings');
  };

  const handleFilterChange = (
    department: 'college' | 'senior-high',
    key: keyof ThesisFilters,
    value: string | undefined
  ) => {
    const setter = department === 'college' ? setCollegeFilters : setSeniorHighFilters;
    setter(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const collegePrograms = ['Computer Science', 'Environmental Science', 'Business Administration', 'Engineering'];
  const seniorHighPrograms = ['STEM', 'Humanities and Social Sciences', 'Accountancy and Business Management'];
  const years = [2024, 2023, 2022, 2021, 2020];

  // Calculate stats
  const totalCollegeThesis = collegeData.data?.total || 0;
  const totalSeniorHighThesis = seniorHighData.data?.total || 0;
  const totalThesis = totalCollegeThesis + totalSeniorHighThesis;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">TWA Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Academic Research Repository</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Open profile menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePersonalSettings}>
                  Personal Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
          <p className="text-muted-foreground">
            Manage thesis records and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Thesis</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalThesis}</div>
              <p className="text-xs text-muted-foreground">
                Across all departments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">College</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCollegeThesis}</div>
              <p className="text-xs text-muted-foreground">
                {collegeData.isLoading ? 'Loading...' : 'Published thesis'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Senior High</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSeniorHighThesis}</div>
              <p className="text-xs text-muted-foreground">
                {seniorHighData.isLoading ? 'Loading...' : 'Published thesis'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="college" className="space-y-4" onValueChange={(value) => setActiveTab(value as 'college' | 'senior-high')}>
          <TabsList>
            <TabsTrigger value="college">College Thesis</TabsTrigger>
            <TabsTrigger value="senior-high">Senior High Thesis</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="college" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>College Thesis Management</CardTitle>
                  <Button onClick={() => setAddThesisOpen(true)}>+ Add New Thesis</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <SearchInput 
                    placeholder="Search college thesis..."
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Select 
                      value={collegeFilters.program || 'all'} 
                      onValueChange={(value) => handleFilterChange('college', 'program', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {collegePrograms.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={collegeFilters.year?.toString() || 'all'} 
                      onValueChange={(value) => handleFilterChange('college', 'year', value === 'all' ? undefined : value)}
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

                {/* Thesis Table */}
                {collegeData.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <ThesisManagementTable 
                    theses={collegeData.data?.data || []}
                    isLoading={collegeData.isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="senior-high" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Senior High Thesis Management</CardTitle>
                  <Button onClick={() => setAddThesisOpen(true)}>+ Add New Thesis</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search & Filters */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <SearchInput 
                    placeholder="Search senior high thesis..."
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Select 
                      value={seniorHighFilters.program || 'all'} 
                      onValueChange={(value) => handleFilterChange('senior-high', 'program', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        {seniorHighPrograms.map(program => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={seniorHighFilters.year?.toString() || 'all'} 
                      onValueChange={(value) => handleFilterChange('senior-high', 'year', value === 'all' ? undefined : value)}
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

                {/* Thesis Table */}
                {seniorHighData.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <ThesisManagementTable 
                    theses={seniorHighData.data?.data || []}
                    isLoading={seniorHighData.isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system preferences and options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    Settings configuration coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Thesis Dialog */}
      <AddThesisDialog 
        open={addThesisOpen} 
        onOpenChange={setAddThesisOpen}
        department={activeTab}
      />
    </div>
  );
};

export default AdminDashboard;
