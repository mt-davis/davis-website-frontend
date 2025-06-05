// src/app/articles/[slug]/page.tsx
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from "next/navigation";
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

// Update the type definition
interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function getArticle(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error('Failed to fetch article:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.data?.[0];
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

function UnderConstructionPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Fun Construction Animation */}
        <div className="relative h-40 w-40 mx-auto mb-8">
          <div className="absolute inset-0 animate-bounce">
            {"🚧"}
          </div>
          <div className="absolute inset-0 animate-ping opacity-75 delay-300">
            {"⚡"}
          </div>
          <div className="absolute inset-0 animate-pulse delay-500">
            {"✨"}
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Coming Soon!
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
          "{title}"
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Our writers are crafting something amazing. 
          This article is still under construction! 🏗️
        </p>

        {/* Fun Facts Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            While you wait, did you know? 🤔
          </h3>
          <p className="text-gray-600 mb-4">
            The average person spends 6 months of their lifetime waiting for red lights to turn green.
            This article won't take that long, we promise! 😉
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/articles" 
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg group"
          >
            Browse Other Articles
            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-3 bg-white/80 text-gray-700 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default async function ArticleDetail({
  params,
  searchParams,
}: PageProps) {
  const article = await getArticle(params.slug);

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

  return (
    <>
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
          <div className="prose prose-lg max-w-none">
            {description && (
              <div className="mb-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>
                  {description}
                </ReactMarkdown>
              </div>
            )}
            {blocks?.map((block: any, idx: number) => {
              switch (block.__component) {
                case "shared.rich-text":
                  return (
                    <div key={`${block.__component}-${block.id}-${idx}`} className="mb-8">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>
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