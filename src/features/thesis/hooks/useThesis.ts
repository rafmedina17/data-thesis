import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Thesis, ThesisResponse, ThesisFilters } from '@/types/thesis';
import { toast } from 'sonner';

// Mock data for development
const mockTheses: Thesis[] = [
  {
    id: '1',
    title: 'Machine Learning Applications in Healthcare Data Analysis',
    abstract: 'This research explores the implementation of machine learning algorithms for analyzing healthcare data patterns and improving diagnostic accuracy. The study focuses on developing predictive models that can assist healthcare professionals in making data-driven decisions.',
    authors: [{ id: '1', name: 'John Smith', email: 'john.smith@email.com' }],
    advisors: [{ id: '1', name: 'Dr. Sarah Johnson', title: 'Professor', department: 'Computer Science' }],
    department: 'college',
    program: 'Computer Science',
    year: 2024,
    dateSubmitted: '2024-03-15',
    keywords: ['Machine Learning', 'Healthcare', 'Data Analysis', 'Predictive Modeling'],
    status: 'published',
    downloadCount: 156,
    viewCount: 1243,
    category: 'Technology',
    language: 'English',
    pages: 120,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Climate Change Impact on Local Ecosystems: A Comprehensive Study',
    abstract: 'An in-depth analysis of how climate change affects local biodiversity and ecosystem dynamics. This research provides valuable insights into environmental conservation strategies and sustainable development practices.',
    authors: [
      { id: '2', name: 'Emily Davis', email: 'emily.davis@email.com' },
      { id: '3', name: 'Michael Brown', email: 'michael.brown@email.com' }
    ],
    advisors: [{ id: '2', name: 'Dr. Robert Wilson', title: 'Associate Professor', department: 'Environmental Science' }],
    department: 'college',
    program: 'Environmental Science',
    year: 2024,
    dateSubmitted: '2024-02-28',
    keywords: ['Climate Change', 'Ecosystem', 'Biodiversity', 'Conservation'],
    status: 'published',
    downloadCount: 98,
    viewCount: 876,
    category: 'Environment',
    language: 'English',
    pages: 95,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
  },
  {
    id: '3',
    title: 'Social Media Influence on Teen Mental Health Awareness',
    abstract: 'This capstone project examines the correlation between social media usage and mental health awareness among teenagers. The research includes surveys and analysis of digital behavior patterns.',
    authors: [{ id: '4', name: 'Ashley Rodriguez', email: 'ashley.rodriguez@email.com' }],
    advisors: [{ id: '3', name: 'Ms. Jennifer Lee', title: 'Senior Teacher', department: 'Social Studies' }],
    department: 'senior-high',
    program: 'Humanities and Social Sciences',
    year: 2024,
    dateSubmitted: '2024-01-20',
    keywords: ['Social Media', 'Mental Health', 'Teenagers', 'Digital Behavior'],
    status: 'published',
    downloadCount: 234,
    viewCount: 1876,
    category: 'Social Sciences',
    language: 'English',
    pages: 68,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  }
];

// Query Keys
export const thesisKeys = {
  all: ['thesis'] as const,
  lists: () => [...thesisKeys.all, 'list'] as const,
  list: (filters: ThesisFilters) => [...thesisKeys.lists(), filters] as const,
  details: () => [...thesisKeys.all, 'detail'] as const,
  detail: (id: string) => [...thesisKeys.details(), id] as const,
};

// Fetch thesis list with filters
export const useThesisList = (filters: ThesisFilters = {}) => {
  return useQuery({
    queryKey: thesisKeys.list(filters),
    queryFn: async (): Promise<ThesisResponse> => {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      let filteredTheses = mockTheses;
      
      // Apply filters
      if (filters.department) {
        filteredTheses = filteredTheses.filter(thesis => thesis.department === filters.department);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTheses = filteredTheses.filter(thesis => 
          thesis.title.toLowerCase().includes(searchLower) ||
          thesis.abstract.toLowerCase().includes(searchLower) ||
          thesis.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
          thesis.authors.some(author => author.name.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.year) {
        filteredTheses = filteredTheses.filter(thesis => thesis.year === filters.year);
      }
      
      if (filters.program) {
        filteredTheses = filteredTheses.filter(thesis => thesis.program === filters.program);
      }
      
      return {
        data: filteredTheses,
        total: filteredTheses.length,
        page: 1,
        limit: 20,
        totalPages: Math.ceil(filteredTheses.length / 20),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch single thesis details
export const useThesisDetail = (id: string) => {
  return useQuery({
    queryKey: thesisKeys.detail(id),
    queryFn: async (): Promise<Thesis> => {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const thesis = mockTheses.find(t => t.id === id);
      if (!thesis) {
        throw new Error('Thesis not found');
      }
      
      return thesis;
    },
    enabled: !!id,
  });
};

// Download thesis mutation
export const useDownloadThesis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (thesisId: string) => {
      // Mock download - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate download by opening a new tab (in real app, this would be a PDF download)
      toast.success('Download started', {
        description: 'The thesis PDF is being downloaded.',
      });
      
      return { success: true };
    },
    onSuccess: (data, thesisId) => {
      // Invalidate and refetch thesis data to update download count
      queryClient.invalidateQueries({ queryKey: thesisKeys.detail(thesisId) });
      queryClient.invalidateQueries({ queryKey: thesisKeys.lists() });
    },
    onError: (error) => {
      toast.error('Download failed', {
        description: 'Unable to download the thesis. Please try again.',
      });
    },
  });
};