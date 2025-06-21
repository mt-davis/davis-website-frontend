import { fetchAPI } from '@/lib/api';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mtdavis.info';

  // Fetch all articles
  const articles = await fetchAPI('articles', {
    populate: ['slug', 'updatedAt']
  }).catch(() => ({ data: [] }));

  // Fetch all projects
  const projects = await fetchAPI('projects', {
    populate: ['slug', 'updatedAt']
  }).catch(() => ({ data: [] }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as const;

  // Dynamic article pages
  const articlePages = articles.data?.map((article: any) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || [];

  // Dynamic project pages
  const projectPages = projects.data?.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || [];

  return [...staticPages, ...articlePages, ...projectPages];
} 