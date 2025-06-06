import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';

async function getProjects() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  // If no API URL is configured, return empty array
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_STRAPI_API_URL is not configured');
    return [];
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/projects?populate=*`,
      { next: { revalidate: 60 } }
    );
    
    if (!res.ok) {
      console.error('Failed to fetch projects:', res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

function EmptyProjectsState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="text-8xl mb-8">🚧</div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Projects Coming Soon!
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        We're currently working on some amazing projects.
        Check back soon to see what we've been building! 🔨
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg"
      >
        Back to Homepage →
      </Link>
    </div>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (!projects.length) {
    return notFound();
  }

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Projects & Work</h1>
            <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
          </div>

          {projects.length === 0 ? (
            <EmptyProjectsState />
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any) => {
                // Get the best available image format or fall back to the original
                const coverImage = project.cover?.formats?.medium?.url || 
                                 project.cover?.formats?.small?.url || 
                                 project.cover?.url || 
                                 '/images/default-project.jpg';

                // Combine with Strapi URL if it's a relative path
                const coverUrl = coverImage.startsWith('/')
                  ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverImage}`
                  : coverImage;

                return (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                      {/* Project Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={coverUrl}
                          alt={project.title || 'Project image'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        {project.status && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-sm rounded-full">
                            {project.status}
                          </div>
                        )}
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-pink-500 transition-colors">
                          {project.title || 'Untitled Project'}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description || 'No description available'}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.map((tech: string, index: number) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {project.attributes?.date 
                              ? new Date(project.attributes.date).toLocaleDateString()
                              : 'Date not available'}
                          </span>
                          <span className="text-pink-500 text-sm font-medium">View Project →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 