// src/app/articles/[slug]/page.tsx
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkFlexibleMarkers from 'remark-flexible-markers';
import { notFound } from "next/navigation";
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import { fetchAPI } from '@/lib/api';
import Script from 'next/script';
import { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo';
import UnderConstructionPage from '@/components/UnderConstructionPage';

// Custom markdown components for consistent spacing, padding & headings
const mdComponents = {
  h1: ({ node, ...props }: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: ({ node, ...props }: any) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
  h3: ({ node, ...props }: any) => <h3 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
  h4: ({ node, ...props }: any) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
  h5: ({ node, ...props }: any) => <h5 className="text-lg font-semibold mt-3 mb-2" {...props} />,
  p:  ({ node, ...props }: any) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700" {...props} />,
  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700" {...props} />,
  li: ({ node, ...props }: any) => <li className="mb-2" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-600 mb-6 py-2 bg-gray-50" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a className="text-pink-500 hover:text-pink-600 underline transition-colors" {...props} />
  ),
  code: ({ node, ...props }: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
  ),
  pre: ({ node, ...props }: any) => (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />
  ),
};

async function getArticle(slug: string) {
  try {
    const article = await fetchAPI('articles', {
      filters: {
        slug: {
          $eq: slug
        }
      },
      populate: ['cover', 'categories', 'block', 'author']
    });

    if (!article.data?.[0]) {
      return null;
    }

    return article.data[0];
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await getArticle(params.slug);

    if (!article) {
      return defaultMetadata;
    }

    const seoBlock = article.block?.find((b: any) => b.__component === 'shared.seo');
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mtdavis.info';
    const canonicalUrl = new URL(`/articles/${params.slug}`, baseUrl).toString();

    return {
      ...defaultMetadata,
      title: seoBlock?.metaTitle || article.title,
      description: seoBlock?.metaDescription || article.description,
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: {
        ...defaultMetadata.openGraph,
        url: canonicalUrl,
        title: seoBlock?.metaTitle || article.title,
        description: seoBlock?.metaDescription || article.description,
        images: article.cover?.url ? [
          {
            url: article.cover.url,
            width: 1200,
            height: 630,
            alt: article.title
          }
        ] : defaultMetadata.openGraph?.images
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return defaultMetadata;
  }
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return notFound();
  }

  const { title, description, blocks, cover, publishedAt, categories, author } = article;
  
  // Show the under construction page if the article isn't published
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
  const fullCoverUrl = coverUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverUrl}` : undefined;

  // Prepare JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: fullCoverUrl,
    datePublished: publishedAt,
    dateModified: article.updatedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author?.name || 'Marquese T Davis',
      url: 'https://mtdavis.info'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Marquese T Davis',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`
    }
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeader />
      <article className="min-h-screen bg-white pt-20">
        {/* Hero Section with Cover Image */}
        <div className="relative w-full h-[60vh] min-h-[500px]">
          {coverUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverUrl}`}
              alt={title || 'Article cover image'}
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
            {categories && categories.length > 0 && (
              <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-2 max-w-[50%]">
                {categories.map((category: any) => (
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
                {publishedAt && (
                  <time dateTime={publishedAt} className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
                {author && (
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    {author.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-500 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
            {description && (
              <div className="mb-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkFlexibleMarkers]}
                  rehypePlugins={[rehypeRaw]}
                  components={mdComponents}
                >
                  {description}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Add ShareButtons component */}
            <ShareButtons 
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`}
              title={title}
              description={description}
            />

            {blocks?.map((block: any, idx: number) => {
              switch (block.__component) {
                case "shared.rich-text":
                  return (
                    <div key={`${block.__component}-${block.id}-${idx}`} className="mb-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkFlexibleMarkers]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          ...mdComponents,
                          // Override specific components for better markdown support
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const language = match ? match[1] : '';
                            
                            return inline ? (
                              <code className="bg-pink-50 text-pink-500 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                                <code className={`language-${language}`} {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          }
                        }}
                      >
                        {block.body}
                      </ReactMarkdown>
                    </div>
                  );
                case "shared.quote":
                  return (
                    <blockquote
                      key={`${block.__component}-${block.id}-${idx}`}
                      className="my-8 border-l-4 border-pink-500 pl-6 italic text-gray-700 py-4 bg-gray-50"
                    >
                      <p className="mb-2">{block.body}</p>
                      {block.title && (
                        <cite className="block text-sm font-semibold text-gray-900 not-italic">
                          — {block.title}
                        </cite>
                      )}
                    </blockquote>
                  );
                case "shared.media":
                  return (
                    <div key={`${block.__component}-${block.id}-${idx}`} className="my-8 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      [Media content will be rendered here]
                    </div>
                  );
                case "shared.slider":
                  return (
                    <div key={`${block.__component}-${block.id}-${idx}`} className="my-8 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
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