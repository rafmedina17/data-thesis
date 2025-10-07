import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramManagement } from './ProgramManagement';
import { GeneralSettings } from './GeneralSettings';
import { UserManagement } from './UserManagement';

export const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure programs, branding, and system preferences
        </p>
      </div>

      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <ProgramManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
