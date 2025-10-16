import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Thesis, ThesisResponse, ThesisFilters } from '@/types/thesis';
import { toast } from 'sonner';

// Mock data for development
const mockTheses: Thesis[] = [
  // College - Computer Science
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
    title: 'Blockchain Technology for Supply Chain Management',
    abstract: 'An innovative approach to implementing blockchain technology in supply chain systems to improve transparency, traceability, and efficiency in logistics operations.',
    authors: [{ id: '5', name: 'David Chen', email: 'david.chen@email.com' }],
    advisors: [{ id: '1', name: 'Dr. Sarah Johnson', title: 'Professor', department: 'Computer Science' }],
    department: 'college',
    program: 'Computer Science',
    year: 2023,
    dateSubmitted: '2023-12-10',
    keywords: ['Blockchain', 'Supply Chain', 'Logistics', 'Technology'],
    status: 'published',
    downloadCount: 189,
    viewCount: 1567,
    category: 'Technology',
    language: 'English',
    pages: 105,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-12-10T00:00:00Z',
  },
  {
    id: '3',
    title: 'Cybersecurity Threats in IoT Devices: Detection and Prevention',
    abstract: 'This study examines security vulnerabilities in Internet of Things devices and proposes advanced detection mechanisms and prevention strategies.',
    authors: [{ id: '6', name: 'Lisa Wang', email: 'lisa.wang@email.com' }],
    advisors: [{ id: '4', name: 'Dr. Mark Thompson', title: 'Associate Professor', department: 'Computer Science' }],
    department: 'college',
    program: 'Computer Science',
    year: 2023,
    dateSubmitted: '2023-11-20',
    keywords: ['Cybersecurity', 'IoT', 'Network Security', 'Threat Detection'],
    status: 'published',
    downloadCount: 234,
    viewCount: 1892,
    category: 'Technology',
    language: 'English',
    pages: 98,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-11-20T00:00:00Z',
  },
  {
    id: '4',
    title: 'Natural Language Processing for Sentiment Analysis in Social Media',
    abstract: 'Developing NLP models to analyze sentiment patterns in social media posts and their applications in brand monitoring and market research.',
    authors: [{ id: '7', name: 'James Martinez', email: 'james.martinez@email.com' }],
    advisors: [{ id: '1', name: 'Dr. Sarah Johnson', title: 'Professor', department: 'Computer Science' }],
    department: 'college',
    program: 'Computer Science',
    year: 2024,
    dateSubmitted: '2024-01-15',
    keywords: ['NLP', 'Sentiment Analysis', 'AI', 'Social Media'],
    status: 'published',
    downloadCount: 178,
    viewCount: 1423,
    category: 'Technology',
    language: 'English',
    pages: 112,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  // College - Environmental Science
  {
    id: '5',
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
    id: '6',
    title: 'Sustainable Water Management in Urban Areas',
    abstract: 'Research on innovative water conservation techniques and sustainable management practices for urban environments facing water scarcity challenges.',
    authors: [{ id: '8', name: 'Sarah Green', email: 'sarah.green@email.com' }],
    advisors: [{ id: '2', name: 'Dr. Robert Wilson', title: 'Associate Professor', department: 'Environmental Science' }],
    department: 'college',
    program: 'Environmental Science',
    year: 2023,
    dateSubmitted: '2023-10-15',
    keywords: ['Water Management', 'Sustainability', 'Urban Planning', 'Conservation'],
    status: 'published',
    downloadCount: 145,
    viewCount: 1234,
    category: 'Environment',
    language: 'English',
    pages: 87,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2023-10-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Renewable Energy Sources and Their Environmental Impact',
    abstract: 'Comparative analysis of various renewable energy sources including solar, wind, and hydroelectric power, and their effects on local environments.',
    authors: [{ id: '9', name: 'Kevin Park', email: 'kevin.park@email.com' }],
    advisors: [{ id: '5', name: 'Dr. Elizabeth Moore', title: 'Professor', department: 'Environmental Science' }],
    department: 'college',
    program: 'Environmental Science',
    year: 2024,
    dateSubmitted: '2024-03-01',
    keywords: ['Renewable Energy', 'Solar Power', 'Wind Energy', 'Environment'],
    status: 'published',
    downloadCount: 201,
    viewCount: 1678,
    category: 'Environment',
    language: 'English',
    pages: 102,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  // College - Business Administration
  {
    id: '8',
    title: 'Digital Marketing Strategies for Small Businesses',
    abstract: 'Exploring effective digital marketing approaches and their implementation in small business environments to enhance brand visibility and customer engagement.',
    authors: [{ id: '10', name: 'Amanda Lee', email: 'amanda.lee@email.com' }],
    advisors: [{ id: '6', name: 'Prof. Richard Davis', title: 'Professor', department: 'Business Administration' }],
    department: 'college',
    program: 'Business Administration',
    year: 2024,
    dateSubmitted: '2024-02-20',
    keywords: ['Digital Marketing', 'Small Business', 'Brand Strategy', 'E-commerce'],
    status: 'published',
    downloadCount: 167,
    viewCount: 1445,
    category: 'Business',
    language: 'English',
    pages: 92,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: '9',
    title: 'Impact of Remote Work on Employee Productivity and Satisfaction',
    abstract: 'Analyzing the effects of remote work arrangements on employee performance, work-life balance, and overall job satisfaction in modern organizations.',
    authors: [{ id: '11', name: 'Robert Kim', email: 'robert.kim@email.com' }],
    advisors: [{ id: '7', name: 'Dr. Patricia White', title: 'Associate Professor', department: 'Business Administration' }],
    department: 'college',
    program: 'Business Administration',
    year: 2023,
    dateSubmitted: '2023-12-05',
    keywords: ['Remote Work', 'Productivity', 'Employee Satisfaction', 'Management'],
    status: 'published',
    downloadCount: 289,
    viewCount: 2134,
    category: 'Business',
    language: 'English',
    pages: 78,
    createdAt: '2023-10-15T00:00:00Z',
    updatedAt: '2023-12-05T00:00:00Z',
  },
  {
    id: '10',
    title: 'Sustainable Business Practices and Corporate Social Responsibility',
    abstract: 'Investigating how businesses integrate sustainability initiatives and CSR programs to create long-term value for stakeholders and society.',
    authors: [{ id: '12', name: 'Maria Santos', email: 'maria.santos@email.com' }],
    advisors: [{ id: '6', name: 'Prof. Richard Davis', title: 'Professor', department: 'Business Administration' }],
    department: 'college',
    program: 'Business Administration',
    year: 2024,
    dateSubmitted: '2024-01-30',
    keywords: ['Sustainability', 'CSR', 'Business Ethics', 'Corporate Strategy'],
    status: 'published',
    downloadCount: 156,
    viewCount: 1298,
    category: 'Business',
    language: 'English',
    pages: 85,
    createdAt: '2023-11-20T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
  },
  // College - Engineering
  {
    id: '11',
    title: 'Smart City Infrastructure: IoT Integration in Urban Systems',
    abstract: 'Design and implementation of IoT-based smart city solutions for traffic management, waste management, and energy optimization in urban areas.',
    authors: [{ id: '13', name: 'Daniel Wright', email: 'daniel.wright@email.com' }],
    advisors: [{ id: '8', name: 'Engr. Thomas Anderson', title: 'Professor', department: 'Engineering' }],
    department: 'college',
    program: 'Engineering',
    year: 2024,
    dateSubmitted: '2024-03-10',
    keywords: ['Smart City', 'IoT', 'Urban Planning', 'Infrastructure'],
    status: 'published',
    downloadCount: 198,
    viewCount: 1567,
    category: 'Engineering',
    language: 'English',
    pages: 135,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '12',
    title: 'Renewable Energy Grid Integration: Challenges and Solutions',
    abstract: 'Technical analysis of integrating renewable energy sources into existing power grids and addressing stability and efficiency challenges.',
    authors: [{ id: '14', name: 'Jennifer Taylor', email: 'jennifer.taylor@email.com' }],
    advisors: [{ id: '9', name: 'Dr. Christopher Lee', title: 'Associate Professor', department: 'Engineering' }],
    department: 'college',
    program: 'Engineering',
    year: 2023,
    dateSubmitted: '2023-11-30',
    keywords: ['Renewable Energy', 'Power Grid', 'Electrical Engineering', 'Sustainability'],
    status: 'published',
    downloadCount: 223,
    viewCount: 1789,
    category: 'Engineering',
    language: 'English',
    pages: 118,
    createdAt: '2023-09-20T00:00:00Z',
    updatedAt: '2023-11-30T00:00:00Z',
  },
  // Senior High - STEM
  {
    id: '13',
    title: 'Physics of Renewable Energy: Solar Panel Efficiency Study',
    abstract: 'Investigating factors affecting solar panel efficiency and proposing methods to optimize energy conversion in various environmental conditions.',
    authors: [{ id: '15', name: 'Chris Anderson', email: 'chris.anderson@email.com' }],
    advisors: [{ id: '10', name: 'Mr. Steven Garcia', title: 'Senior Teacher', department: 'Science' }],
    department: 'senior-high',
    program: 'STEM',
    year: 2024,
    dateSubmitted: '2024-02-15',
    keywords: ['Solar Energy', 'Physics', 'Renewable Energy', 'Efficiency'],
    status: 'published',
    downloadCount: 134,
    viewCount: 987,
    category: 'Science',
    language: 'English',
    pages: 56,
    createdAt: '2023-12-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '14',
    title: 'Mathematical Modeling of Disease Spread in Communities',
    abstract: 'Using mathematical models to understand and predict disease transmission patterns in local communities and evaluate intervention strategies.',
    authors: [{ id: '16', name: 'Nicole Chen', email: 'nicole.chen@email.com' }],
    advisors: [{ id: '11', name: 'Ms. Rachel Martinez', title: 'Math Teacher', department: 'Mathematics' }],
    department: 'senior-high',
    program: 'STEM',
    year: 2023,
    dateSubmitted: '2023-12-15',
    keywords: ['Mathematics', 'Epidemiology', 'Modeling', 'Public Health'],
    status: 'published',
    downloadCount: 167,
    viewCount: 1234,
    category: 'Science',
    language: 'English',
    pages: 62,
    createdAt: '2023-10-05T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z',
  },
  {
    id: '15',
    title: 'Chemistry of Natural Products: Plant-Based Medicine Research',
    abstract: 'Exploring the chemical composition and medicinal properties of local plant species for potential pharmaceutical applications.',
    authors: [{ id: '17', name: 'Marcus Johnson', email: 'marcus.johnson@email.com' }],
    advisors: [{ id: '12', name: 'Dr. Angela Brown', title: 'Science Coordinator', department: 'Science' }],
    department: 'senior-high',
    program: 'STEM',
    year: 2024,
    dateSubmitted: '2024-01-25',
    keywords: ['Chemistry', 'Natural Products', 'Medicine', 'Plants'],
    status: 'published',
    downloadCount: 145,
    viewCount: 1098,
    category: 'Science',
    language: 'English',
    pages: 58,
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  // Senior High - Humanities and Social Sciences
  {
    id: '16',
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
  },
  {
    id: '17',
    title: 'Cultural Identity and Language Preservation in Modern Society',
    abstract: 'Examining the importance of language preservation in maintaining cultural identity and proposing strategies for promoting indigenous languages.',
    authors: [{ id: '18', name: 'Sofia Reyes', email: 'sofia.reyes@email.com' }],
    advisors: [{ id: '13', name: 'Ms. Catherine Lopez', title: 'Language Teacher', department: 'Humanities' }],
    department: 'senior-high',
    program: 'Humanities and Social Sciences',
    year: 2023,
    dateSubmitted: '2023-11-10',
    keywords: ['Culture', 'Language', 'Identity', 'Preservation'],
    status: 'published',
    downloadCount: 189,
    viewCount: 1456,
    category: 'Social Sciences',
    language: 'English',
    pages: 71,
    createdAt: '2023-09-15T00:00:00Z',
    updatedAt: '2023-11-10T00:00:00Z',
  },
  {
    id: '18',
    title: 'Impact of Literature on Social Change and Awareness',
    abstract: 'Analyzing how literature influences social movements and raises awareness about important societal issues throughout history.',
    authors: [{ id: '19', name: 'Emma Wilson', email: 'emma.wilson@email.com' }],
    advisors: [{ id: '14', name: 'Mr. David Harris', title: 'Literature Teacher', department: 'Humanities' }],
    department: 'senior-high',
    program: 'Humanities and Social Sciences',
    year: 2024,
    dateSubmitted: '2024-02-05',
    keywords: ['Literature', 'Social Change', 'Culture', 'Awareness'],
    status: 'published',
    downloadCount: 156,
    viewCount: 1267,
    category: 'Social Sciences',
    language: 'English',
    pages: 64,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  // Senior High - Accountancy and Business Management
  {
    id: '19',
    title: 'Financial Literacy Among High School Students: A Survey Study',
    abstract: 'Assessing the level of financial literacy among senior high school students and proposing educational interventions to improve money management skills.',
    authors: [{ id: '20', name: 'Joshua Cruz', email: 'joshua.cruz@email.com' }],
    advisors: [{ id: '15', name: 'Ms. Mary Johnson', title: 'Business Teacher', department: 'ABM' }],
    department: 'senior-high',
    program: 'Accountancy and Business Management',
    year: 2024,
    dateSubmitted: '2024-03-05',
    keywords: ['Financial Literacy', 'Education', 'Money Management', 'Students'],
    status: 'published',
    downloadCount: 178,
    viewCount: 1389,
    category: 'Business',
    language: 'English',
    pages: 59,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '20',
    title: 'Entrepreneurship Skills Development in Secondary Education',
    abstract: 'Exploring methods to develop entrepreneurial mindset and skills among senior high school students through practical business projects.',
    authors: [{ id: '21', name: 'Isabella Garcia', email: 'isabella.garcia@email.com' }],
    advisors: [{ id: '16', name: 'Mr. Robert Santos', title: 'Entrepreneurship Teacher', department: 'ABM' }],
    department: 'senior-high',
    program: 'Accountancy and Business Management',
    year: 2023,
    dateSubmitted: '2023-12-20',
    keywords: ['Entrepreneurship', 'Business Skills', 'Education', 'Students'],
    status: 'published',
    downloadCount: 201,
    viewCount: 1534,
    category: 'Business',
    language: 'English',
    pages: 67,
    createdAt: '2023-10-10T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z',
  },
];

// Query Keys
export const thesisKeys = {
  all: ['thesis'] as const,
  lists: () => [...thesisKeys.all, 'list'] as const,
  list: (filters: ThesisFilters) => [...thesisKeys.lists(), filters] as const,
  details: () => [...thesisKeys.all, 'detail'] as const,
  detail: (id: string) => [...thesisKeys.details(), id] as const,
};

// Fetch thesis list with filters and pagination
export const useThesisList = (filters: ThesisFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...thesisKeys.list(filters), page, limit],
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

      // Apply pagination
      const total = filteredTheses.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTheses = filteredTheses.slice(startIndex, endIndex);
      
      return {
        data: paginatedTheses,
        total,
        page,
        limit,
        totalPages,
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