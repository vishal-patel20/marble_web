import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance.js';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBlog, setActiveBlog] = useState(null); // Detailed article view when set

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/misc/blogs');
        setBlogs(res.data.data);
      } catch (err) {
        console.error('Failed to load blog posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Detailed article reading view
  if (activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        <button
          onClick={() => { setActiveBlog(null); window.scrollTo(0,0); }}
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-gold-400 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Articles
        </button>

        <article className="space-y-6">
          <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase">{activeBlog.tags?.join(', ') || 'Blog'}</span>
          <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-800 dark:text-white leading-tight">{activeBlog.title}</h1>
          
          <div className="flex items-center space-x-6 text-xs text-slate-400 font-semibold uppercase tracking-wider pb-6 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center"><User className="h-4 w-4 mr-1.5 text-gold-400" />{activeBlog.author}</span>
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5 text-gold-400" />{new Date(activeBlog.createdAt).toLocaleDateString()}</span>
          </div>

          {activeBlog.image && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={activeBlog.image} alt={activeBlog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-slate-600 dark:text-slate-350 text-base leading-relaxed space-y-6 whitespace-pre-line pt-6">
            {activeBlog.content}
          </div>
        </article>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Blogs & Care Guides</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Learn expert methods on protecting marble kitchen countertops, sealing travertine, and stone matching from our geologists.
        </p>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton count={3} />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md mx-auto">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">No articles found</h3>
          <p className="text-sm text-slate-400 font-medium">Blogs and guidelines will be uploaded shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => { setActiveBlog(blog); window.scrollTo(0,0); }}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider block mb-2">
                    {blog.tags?.slice(0, 2).join(' • ') || 'Expert Insight'}
                  </span>
                  <h3 className="text-base font-bold font-serif text-slate-850 dark:text-white group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug mb-3">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                    {blog.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 font-semibold">{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs font-semibold text-gold-400 group-hover:underline flex items-center">
                    Read Article <ArrowRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
