export interface SeoData {
  title: string;
  description: string;
  keywords?: string[];
  type?: 'website' | 'article';
  robots?: string;
}
