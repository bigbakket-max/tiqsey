import React, { useState } from 'react';
import { Search, Plus, Home, ChevronRight, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../../contexts/BlogContext';

export default function Blog() {
  const navigate = useNavigate();
  const { posts, deletePost } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category?.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage travel guides, news, and destination updates.</p>
        </div>
        <button 
          onClick={() => navigate('/blog/new')}
          className="flex items-center gap-2 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          Create New Post
        </button>
      </div>
      
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] transition-colors placeholder-slate-400 text-slate-800 dark:text-slate-200" 
            />
          </div>
          <div className="w-full sm:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] transition-colors text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Categories</option>
              <option value="travel-tips">Travel Tips</option>
              <option value="destination-guides">Destination Guides</option>
              <option value="food-culture">Food & Culture</option>
              <option value="hidden-gems">Hidden Gems</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50/50 dark:bg-slate-900 text-slate-500 font-semibold text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 uppercase font-bold text-slate-400">Post</th>
                <th className="px-6 py-4 uppercase font-bold text-slate-400">Category</th>
                <th className="px-6 py-4 uppercase font-bold text-slate-400">Date</th>
                <th className="px-6 py-4 uppercase font-bold text-slate-400">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-16 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 max-w-[300px] truncate">{post.title}</p>
                        <p className="text-xs text-slate-500">{post.author.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {post.publishedAt?.includes('T') 
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
                        : post.publishedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${(!post.status || post.status === 'Published') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${post.status === 'Draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' : ''}
                      ${post.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : ''}
                    `}>
                      {(post.status || 'Published').toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/blog/${post.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-md"
                        title="Edit Post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            deletePost(post.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No blog posts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
