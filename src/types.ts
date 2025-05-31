
export enum DisplayCategory {
  INFOGRAPHIC = 'Infographic', // Changed from GENERAL
  ARTICLE = 'บทความ',
  TECHNOLOGY = 'เทคโนโลยี',
}

// Define the structure for an Infographic item
export interface Infographic {
  id: string; // Unique identifier, typically a UUID from Supabase
  created_at: string; // Timestamp of creation, ISO string format
  title: string;
  imageUrl: string;
  tags: string[];
  description?: string; // Optional description
  displayCategory: DisplayCategory; // Use the existing enum, aligned with DB schema
  date: string; // Client-provided date for the infographic content
  sourceUrl?: string; // Optional source URL
  summary: string; // Summary for display on cards
  content: string; // Full content for the detail page
}


export const ALL_TAGS_OPTION = 'ทั้งหมด';