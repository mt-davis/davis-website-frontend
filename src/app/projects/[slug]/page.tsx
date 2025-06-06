import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from "next/navigation";
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import UnderConstructionPage from '@/components/UnderConstructionPage';
import ShareButtons from '@/components/ShareButtons';
import SafeEmail from '@/components/SafeEmail';

// Custom markdown components for consistent spacing, padding & headings
const mdComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-black" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-3xl font-semibold mt-6 mb-3 text-black" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-2xl font-semibold mt-5 mb-3 text-black" {...props} />,
  h4: ({ node, ...props }: any) => <h4 className="text-xl font-semibold mt-4 mb-2 text-black" {...props} />,
  h5: ({ node, ...props }: any) => <h5 className="text-lg font-semibold mt-3 mb-2 text-black" {...props} />,
  p:  ({ node, children, ...props }: any) => {
    // Check if the paragraph contains an email address
    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
    if (typeof children === 'string' && emailRegex.test(children)) {
      const parts = children.split('@');
      return (
        <p className="mb-4 leading-relaxed text-gray-700">
          <SafeEmail emailUser={parts[0]} emailDomain={parts[1]} />
        </p>
      );
    }
    return <p className="mb-4 leading-relaxed text-gray-700" {...props}>{children}</p>;
  },
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700" {...props} />,
  li: ({ node, children, ...props }: any) => {
    // Check if the list item contains an email address
    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
    if (typeof children === 'string' && emailRegex.test(children)) {
      const parts = children.split('@');
      return (
        <li className="mb-2">
          <SafeEmail emailUser={parts[0]} emailDomain={parts[1]} />
        </li>
      );
    }
    return <li className="mb-2" {...props}>{children}</li>;
  },
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 mb-6 py-2 bg-gray-50" {...props} />
  ),
  a: ({ node, href, children, ...props }: any) => {
    // Check if this is a mailto: link or contains an email
    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
    const mailtoRegex = /^mailto:(.+@.+\..+)$/i;
    
    if (href && mailtoRegex.test(href)) {
      // Extract email from mailto: link
      const email = href.replace('mailto:', '');
      const [user, domain] = email.split('@');
      return <SafeEmail emailUser={user} emailDomain={domain} className="text-pink-500 hover:text-pink-600" />;
    } else if (typeof children === 'string' && emailRegex.test(children)) {
      // Handle plain email text in link
      const [user, domain] = children.split('@');
      return <SafeEmail emailUser={user} emailDomain={domain} className="text-pink-500 hover:text-pink-600" />;
    }
    
    // Regular link handling
    return <a className="text-pink-500 hover:text-pink-600 underline transition-colors" {...props}>{children}</a>;
  },
  code: ({ node, ...props }: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
  ),
  pre: ({ node, ...props }: any) => (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />
  ),
};

async function getProject(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  // If no API URL is configured, return null
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_STRAPI_API_URL is not configured');
    return null;
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/projects?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error('Failed to fetch project:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return notFound();
  }

  const { title, description, block, cover, publishedAt } = project;
  
  // Show the under construction page if the project isn't published
  if (!publishedAt) {
    return (
      <>
        <ArticleHeader />
        <div className="pt-20">
          <UnderConstructionPage title={title} />
        </div>
        <Footer />
      </>
    );
  }

  const coverUrl = cover?.formats?.medium?.url || cover?.formats?.small?.url || cover?.url;

  return (
    <>
      <ArticleHeader />
      <article className="min-h-screen bg-white pt-20 relative">
        <ShareButtons url="" title={title} description={description} />
        <div className="relative w-full h-[60vh] min-h-[500px]">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

          {/* Content overlay */}
          <div className="absolute inset-0">
            {/* Categories - positioned in upper right */}
            {project.categories && project.categories.length > 0 && (
              <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-2 max-w-[50%]">
                {project.categories.map((category: any) => (
                  <span
                    key={category.id}
                    className="text-sm text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Centered content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-6 max-w-4xl">
                {title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
                {project.publishedAt && (
                  <time dateTime={project.publishedAt} className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(project.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
                {project.author && (
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    {project.author.name}
                  </div>
                )}
                {project.status && (
                  <div className="px-4 py-1 bg-pink-500 text-white rounded-full shadow-lg">
                    {project.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Project Link */}
          {project.link && (
            <div className="mb-8 text-center">
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg group"
              >
                <span className="mr-2">🔗</span>
                View Project
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {description && (
              <div className="mb-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>
                  {description}
                </ReactMarkdown>
              </div>
            )}
            {block?.map((contentBlock: any, idx: number) => {
              switch (contentBlock.__component) {
                case "shared.rich-text":
                  return (
                    <div key={`${contentBlock.__component}-${contentBlock.id}-${idx}`} className="mb-8">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>
                        {contentBlock.body}
                      </ReactMarkdown>
                    </div>
                  );
                case "shared.quote":
                  return (
                    <blockquote
                      key={`${contentBlock.__component}-${contentBlock.id}-${idx}`}
                      className="my-8 border-l-4 border-pink-500 pl-6 italic text-gray-700 py-4 bg-gray-50"
                    >
                      <p className="mb-2">{contentBlock.body}</p>
                      {contentBlock.title && (
                        <cite className="block text-sm font-semibold text-gray-900 not-italic">
                          — {contentBlock.title}
                        </cite>
                      )}
                    </blockquote>
                  );
                case "shared.media":
                  return (
                    <div key={`${contentBlock.__component}-${contentBlock.id}-${idx}`} className="my-8 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      [Media content will be rendered here]
                    </div>
                  );
                case "shared.slider":
                  return (
                    <div key={`${contentBlock.__component}-${contentBlock.id}-${idx}`} className="my-8 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      [Slider content will be rendered here]
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
