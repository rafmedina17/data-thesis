import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsStore } from '@/stores/settings-store';
import { useToast } from '@/hooks/use-toast';

const generalSettingsSchema = z.object({
  schoolName: z.string().min(3, 'School name must be at least 3 characters').max(200, 'School name is too long'),
  schoolLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  headerBackground: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  aboutContent: z.string().min(10, 'About content must be at least 10 characters').max(1000, 'About content is too long'),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export const GeneralSettings = () => {
  const { toast } = useToast();
  const { systemSettings, updateSystemSettings } = useSettingsStore();

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      schoolName: systemSettings.schoolName,
      schoolLogo: systemSettings.schoolLogo || '',
      headerBackground: systemSettings.headerBackground || '',
      aboutContent: systemSettings.aboutContent,
    },
  });

  const onSubmit = (data: GeneralSettingsFormValues) => {
    updateSystemSettings({
      schoolName: data.schoolName,
      schoolLogo: data.schoolLogo || undefined,
      headerBackground: data.headerBackground || undefined,
      aboutContent: data.aboutContent,
    });
    toast({
      title: 'Settings Updated',
      description: 'System settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your institution's branding and information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* School Name */}
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g., Tayabas Western Academy" className="pl-9" {...field} />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This name will appear in the header and throughout the site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* School Logo */}
              <FormField
                control={form.control}
                name="schoolLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Logo URL</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/logo.png" 
                              className="pl-9" 
                              {...field} 
                            />
                          </div>
                        </div>
                        {field.value && (
                          <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                            <img 
                              src={field.value} 
                              alt="Logo preview" 
                              className="h-12 w-12 object-contain rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="text-sm text-muted-foreground">Logo preview</div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the URL of your school logo image (leave empty to use default icon)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Header Background */}
              <FormField
                control={form.control}
                name="headerBackground"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Background Image URL</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/header-bg.jpg" 
                              className="pl-9" 
                              {...field} 
                            />
                          </div>
                        </div>
                        {field.value && (
                          <div className="relative h-32 border rounded-md overflow-hidden bg-muted">
                            <img 
                              src={field.value} 
                              alt="Header background preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <span className="text-white text-sm font-medium">Header Background Preview</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the URL of your header background image (leave empty to use default gradient)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* About Content */}
              <FormField
                control={form.control}
                name="aboutContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a description for your thesis archive system"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This text will appear on the landing page below the main heading
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Preview how your settings will appear on the public site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {/* Header Preview */}
            <div 
              className="border-b bg-background/80 backdrop-blur-sm p-4"
              style={form.watch('headerBackground') ? {
                backgroundImage: `url(${form.watch('headerBackground')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : undefined}
            >
              <div className="flex items-center space-x-3">
                {form.watch('schoolLogo') ? (
                  <img 
                    src={form.watch('schoolLogo')} 
                    alt="Logo" 
                    className="h-10 w-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                    <Building2 className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h2 className="text-base font-semibold">{form.watch('schoolName')}</h2>
                  <p className="text-xs text-muted-foreground">Academic Research Repository</p>
                </div>
              </div>
            </div>
            
            {/* Content Preview */}
            <div className="p-6 bg-gradient-subtle">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-3">
                  Discover Outstanding
                  <span className="block text-primary">Academic Research</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {form.watch('aboutContent')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
