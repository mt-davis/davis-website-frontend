import Image from 'next/image';
import Link from 'next/link';
import ArticleHeader from '@/components/ArticleHeader';
import Footer from '@/components/Footer';
import { fetchAPI } from '@/lib/api';

async function getArticles() {
  try {
    const articles = await fetchAPI('articles', {
      populate: '*'
    });
    return articles.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

function EmptyArticlesState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      {/* Fun Animation Container */}
      <div className="relative w-72 h-72 mb-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top decorative elements */}
          <div className="absolute top-0 left-1/4 text-3xl animate-float-slow opacity-30">📝</div>
          <div className="absolute top-4 right-1/4 text-2xl animate-float-delay opacity-20">✨</div>
          <div className="absolute top-8 left-1/3 text-2xl animate-spin-slow opacity-25">🎨</div>
          
          {/* Middle-left decorative elements */}
          <div className="absolute top-1/3 left-0 text-2xl animate-float-delay-2 opacity-20">✏️</div>
          <div className="absolute top-1/2 left-4 text-3xl animate-spin-slow-delay opacity-25">🎯</div>
          
          {/* Middle-right decorative elements */}
          <div className="absolute top-1/3 right-0 text-2xl animate-float-delay-3 opacity-20">💡</div>
          <div className="absolute top-1/2 right-4 text-3xl animate-spin-slow-delay-2 opacity-25">🌟</div>
          
          {/* Bottom decorative elements */}
          <div className="absolute bottom-8 left-1/4 text-2xl animate-float-delay-4 opacity-20">📚</div>
          <div className="absolute bottom-4 right-1/3 text-3xl animate-spin-slow-delay-3 opacity-25">💭</div>
        </div>

        {/* Main elements */}
        {/* Floating Book with rotation */}
        <div className="absolute inset-0 animate-float-spin text-8xl flex items-center justify-center z-10">
          📚
        </div>
        {/* Coffee Cup with steam effect */}
        <div className="relative inset-0 animate-bounce-slow delay-300 text-7xl flex items-center justify-center translate-y-4 z-10">
          <span className="absolute -top-6 right-2 text-4xl animate-steam-right">☁️</span>
          <span className="absolute -top-8 left-2 text-3xl animate-steam-left">☁️</span>
          ☕
        </div>
        {/* Thinking Bubble with pulsing and floating */}
        <div className="absolute inset-0 animate-thought-bubble text-6xl flex items-center justify-center -translate-x-16 -translate-y-8 z-10">
          <span className="animate-bubble-pop">💭</span>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in -mt-4">
        The Library is Empty!
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-delay">
        I'm busy crafting amazing articles fueled by coffee and inspiration.
        Check back soon for brilliant insights! ✨
      </p>

      {/* Fun Facts with slide-up effect */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-xl animate-slide-up">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Random Fun Fact While You Wait 🎯
        </h3>
        <p className="text-gray-600">
          Did you know? The first blog was created in 1994 by a college student.
          Now there are over 600 million blogs on the internet! 
          Ours will be worth the wait. 😉
        </p>
      </div>

      {/* Action Button with bounce effect on hover */}
      <Link 
        href="/"
        className="mt-8 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-300 shadow-lg group animate-fade-in-delay-2 hover:scale-105"
      >
        Back to Homepage
        <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
          →
        </span>
      </Link>
    </div>
  );
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-black">Articles & Insights</h1>
            <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
          </div>

          {articles.length === 0 ? (
            <EmptyArticlesState />
          ) : (
            /* Articles Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => {
                // Get the best available image format or fall back to the original
                const coverImage = article.cover?.formats?.medium?.url || 
                                 article.cover?.formats?.small?.url || 
                                 article.cover?.url || 
                                 '/images/default-article.jpg';

                // Combine with Strapi URL if it's a relative path
                const coverUrl = coverImage.startsWith('/')
                  ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverImage}`
                  : coverImage;

                return (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                      {/* Article Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={coverUrl}
                          alt={article.title || 'Article image'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* Additional center overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Hover Content */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm px-4 text-center">
                            {article.description || 'Read more about this article'}
                          </p>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-pink-500 transition-colors">
                          {article.title || 'Untitled Article'}
                        </h2>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {article.publishedAt 
                              ? new Date(article.publishedAt).toLocaleDateString()
                              : 'Date not available'}
                          </span>
                          <span className="text-pink-500 text-sm font-medium">Read More →</span>
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