export interface MediaFile {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio';
  summary: string;
  tags: string[];
  thumbnailUrl: string;
  fileUrl: string;
  status: 'processed' | 'processing';
}
export const mockData: MediaFile[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    type: 'video',
    summary: 'An insightful documentary exploring the role of artificial intelligence in shaping the future of web and software development, featuring interviews with industry leaders.',
    tags: ['AI', 'Web Development', 'Future Tech', 'Documentary'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Placeholder
    status: 'processed',
  },
  {
    id: '2',
    title: 'Cloudflare Q1 2024 Earnings Report',
    type: 'pdf',
    summary: 'A comprehensive financial report detailing Cloudflare\'s performance in the first quarter of 2024, including revenue, growth metrics, and future outlook.',
    tags: ['Finance', 'Earnings', 'Cloudflare', 'Report'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'processed',
  },
  {
    id: '3',
    title: 'Advanced React Patterns',
    type: 'video',
    summary: 'A deep-dive technical session on advanced React patterns for building scalable and maintainable applications, covering hooks, state management, and performance.',
    tags: ['React', 'Programming', 'Tech Talk', 'Scalability'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Placeholder
    status: 'processed',
  },
  {
    id: '4',
    title: 'Project CogniCanvas Architecture',
    type: 'pdf',
    summary: 'The official architectural design document for the CogniCanvas project, outlining the system design, data flow, and technology stack.',
    tags: ['Architecture', 'System Design', 'PDF', 'Internal'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1583521214690-7342de006929?q=80&w=2070&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'processed',
  },
  {
    id: '5',
    title: 'AI Agent Brainstorm Session',
    type: 'audio',
    summary: 'A recording of the initial brainstorming session for the AI agent, discussing core functionalities, model choices, and integration strategies.',
    tags: ['Audio', 'Meeting', 'AI', 'Brainstorming'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602843623-3f188215228e?q=80&w=1932&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Placeholder
    status: 'processing',
  },
  {
    id: '6',
    title: 'Design System Principles',
    type: 'pdf',
    summary: 'A guide to the principles and best practices behind our design system, ensuring consistency and quality across all products.',
    tags: ['Design', 'UI/UX', 'Guide', 'Principles'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1600783453993-610b23a4cf45?q=80&w=1974&auto=format&fit=crop',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'processed',
  },
];