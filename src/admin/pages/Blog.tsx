import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Clock, 
  Globe, 
  Bookmark, 
  Eye, 
  X,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useBlog } from '../../contexts/BlogContext';
import { BlogPost } from '../../components/BlogPage';
import { AdminPagination } from '../components/AdminPagination';

export default function Blog() {
  const navigate = useNavigate();
  const { posts, addPost, updatePost, deletePost } = useBlog();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-selection & Copy state
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'single'; post: BlogPost } | { type: 'bulk' } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Derived category list
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Statistics
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => !p.status || p.status === 'Published').length;
    const draft = posts.filter(p => p.status === 'Draft').length;
    const scheduled = posts.filter(p => p.status === 'Scheduled').length;
    return { total, published, draft, scheduled };
  }, [posts]);

  // Filtering and sorting
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(post => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        post.title?.toLowerCase().includes(q) || 
        post.author?.name?.toLowerCase().includes(q) ||
        post.city?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.tags?.some(t => t.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;

      const postStatus = (post.status || 'Published').toLowerCase();
      let matchesStatus = true;
      if (statusTab === 'published') matchesStatus = postStatus === 'published';
      else if (statusTab === 'draft') matchesStatus = postStatus === 'draft';
      else if (statusTab === 'scheduled') matchesStatus = postStatus === 'scheduled';

      return matchesSearch && matchesCategory && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      }
      // Sort by publication timestamp
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [posts, searchTerm, categoryFilter, statusTab, sortBy, sortOrder]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPosts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPosts, currentPage, itemsPerPage]);

  // Bulk handlers
  const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every(p => selectedPostIds.includes(p.id));
  const isSomeSelected = selectedPostIds.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPostIds(paginatedPosts.map(p => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleToggleRowSelection = (id: string) => {
    setSelectedPostIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkSetStatus = (newStatus: 'Published' | 'Draft') => {
    if (selectedPostIds.length === 0) return;
    selectedPostIds.forEach(id => {
      updatePost(id, { status: newStatus });
    });
    setSelectedPostIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedPostIds.length === 0) return;
    setDeleteConfirm({ type: 'bulk' });
  };

  const confirmDeleteAction = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'bulk') {
      selectedPostIds.forEach(id => deletePost(id));
      setSelectedPostIds([]);
    } else {
      deletePost(deleteConfirm.post.id);
    }
    setDeleteConfirm(null);
  };

  const handleTogglePostStatus = (post: BlogPost) => {
    const currentStatus = post.status || 'Published';
    const nextStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    updatePost(post.id, { status: nextStatus });
  };

  const handleCopyPostId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const { id: _unusedId, ...rest } = post;
    const cloned: Omit<BlogPost, 'id'> = {
      ...rest,
      title: `${post.title} (Copy)`,
      status: 'Draft',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    addPost(cloned);
  };

  const handleSort = (field: 'date' | 'title') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "all" || statusTab !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusTab("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Blog Posts</h1>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold">
              {stats.total} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage travel guides, insider stories, tips, and destination articles across the customer storefront.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="/#/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/70 rounded-xl transition-colors shadow-2xs"
            title="Open customer storefront blog in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Storefront Blog</span>
          </a>
          <button 
            type="button"
            onClick={() => navigate('/blog/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </button>
        </div>
      </div>
      
      {/* Table Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs relative">
        {/* Status Tabs Bar */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Posts', count: stats.total },
              { id: 'published', label: 'Published', count: stats.published },
              { id: 'draft', label: 'Drafts', count: stats.draft },
              { id: 'scheduled', label: 'Scheduled', count: stats.scheduled }
            ].map(tab => {
              const isActive = statusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusTab(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 min-h-[38px] rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono tabular-nums ${
                    isActive 
                      ? 'bg-blue-700/80 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filters Row */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white dark:bg-slate-900">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by title, author, city, excerpt, or tags..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400 text-slate-800 dark:text-slate-200" 
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-w-[36px] justify-center"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 min-h-[40px] text-xs flex-1 sm:flex-initial">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select 
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-2 w-full"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-sky-400 px-3 min-h-[40px] transition-colors cursor-pointer shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* High-Density Real-Time Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[950px] table-fixed">
            <colgroup>
              <col className="w-[4%]" />
              <col className="w-[36%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors" 
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1.5">
                    Post Title & ID
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author & Destination</th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors" 
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1.5">
                    Published Date
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-right">Publication & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {filteredAndSortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 bg-slate-50/20 dark:bg-slate-950/10">
                    <div className="max-w-md mx-auto space-y-3">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
                      <p className="text-base font-black text-slate-800 dark:text-white">No Blog Posts Match Filters</p>
                      <p className="text-xs text-slate-400">
                        Try clearing search terms or selecting another status tab to inspect travel guides and news updates.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);
                  const isPublished = !post.status || post.status === 'Published';
                  const isScheduled = post.status === 'Scheduled';
                  const isCopied = copiedPostId === post.id;
                  const liveStorefrontUrl = `${window.location.origin}/#/blog?post=${encodeURIComponent(post.id)}`;

                  return (
                    <tr 
                      key={post.id} 
                      className={`transition-colors duration-150 ${
                        isSelected 
                          ? "bg-blue-50/50 dark:bg-blue-950/25" 
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRowSelection(post.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                        />
                      </td>

                      {/* Post Thumbnail, Title, ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shrink-0 group">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-slate-900 dark:text-white font-bold text-sm truncate max-w-[280px]" title={post.title}>
                                {post.title}
                              </p>
                              <a
                                href={liveStorefrontUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors shrink-0"
                                title="View Live Post on storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleCopyPostId(post.id)}
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                title="Click to copy Post Slug / ID"
                              >
                                {isCopied ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                                <span className="truncate max-w-[150px]">{post.id}</span>
                              </button>
                              {post.readTime && (
                                <span className="flex items-center text-[10px] text-slate-400 font-semibold gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {post.readTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Unboxed Category */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {post.category || "General"}
                        </span>
                      </td>

                      {/* Author & Destination */}
                      <td className="px-4 py-3">
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-900 dark:text-slate-100 font-bold truncate">
                            {post.author?.name || "Editorial Team"}
                          </p>
                          <p className="text-slate-400 font-medium truncate text-[11px]">
                            {post.city || post.author?.role || "Global"}
                          </p>
                        </div>
                      </td>

                      {/* Published Date */}
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {post.publishedAt?.includes('T')
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : (post.publishedAt || 'Unpublished')}
                          </span>
                        </div>
                      </td>

                      {/* Live Toggle & Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Live toggle switch */}
                          <div className="flex items-center gap-1.5 select-none shrink-0">
                            <button
                              type="button"
                              onClick={() => handleTogglePostStatus(post)}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isPublished
                                  ? "bg-emerald-500"
                                  : isScheduled
                                  ? "bg-indigo-500"
                                  : "bg-slate-300 dark:bg-slate-700"
                              }`}
                              aria-label={`Toggle publication for ${post.title}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  isPublished || isScheduled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span className={`text-[10px] font-black uppercase tracking-wider w-14 text-left ${
                              isPublished 
                                ? "text-emerald-600 dark:text-emerald-400" 
                                : isScheduled 
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-400"
                            }`}>
                              {isPublished ? "LIVE" : isScheduled ? "SCHED" : "DRAFT"}
                            </span>
                          </div>

                          {/* Quick Action Tools */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicatePost(post)}
                              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group cursor-pointer"
                              title="Duplicate Post as Draft"
                            >
                              <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/blog/${post.id}`)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors group cursor-pointer"
                              title="Edit Post"
                            >
                              <Edit2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm({ type: 'single', post })}
                              className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (< lg) */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedPosts.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between text-xs font-bold text-slate-500">
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[36px]">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
                <span>Select all on page</span>
              </label>
              <button
                type="button"
                onClick={() => handleSort(sortBy === 'date' ? 'title' : 'date')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort: {sortBy === 'date' ? 'Date' : 'Title'}</span>
              </button>
            </div>
          )}

          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-14 px-4">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
              <p className="text-sm font-black text-slate-800 dark:text-white">No Blog Posts Match Filters</p>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing search terms or selecting another status tab.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 min-h-[40px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 rounded-xl text-xs font-bold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            paginatedPosts.map((post) => {
              const isSelected = selectedPostIds.includes(post.id);
              const isPublished = !post.status || post.status === 'Published';
              const isScheduled = post.status === 'Scheduled';
              const isCopied = copiedPostId === post.id;
              const liveStorefrontUrl = `${window.location.origin}/#/blog?post=${encodeURIComponent(post.id)}`;

              return (
                <div
                  key={post.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleRowSelection(post.id)}
                      className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shrink-0"
                    />
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shrink-0">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <a
                          href={liveStorefrontUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 -mt-1 text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 shrink-0"
                          title="View Live Post on storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleCopyPostId(post.id)}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                        >
                          {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                          <span className="truncate max-w-[120px]">{post.id}</span>
                        </button>
                        {post.readTime && (
                          <span className="flex items-center text-[11px] text-slate-400 font-semibold gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Category</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{post.category || 'General'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Author & City</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                        {post.author?.name || 'Editorial Team'} · {post.city || 'Global'}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Published</span>
                      <span className="font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                        {post.publishedAt?.includes('T')
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : (post.publishedAt || 'Unpublished')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => handleTogglePostStatus(post)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isPublished ? 'bg-emerald-500' : isScheduled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label={`Toggle publication for ${post.title}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                            isPublished || isScheduled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`text-[11px] font-black uppercase tracking-wider ${
                        isPublished ? 'text-emerald-600 dark:text-emerald-400' : isScheduled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}>
                        {isPublished ? 'LIVE' : isScheduled ? 'SCHED' : 'DRAFT'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDuplicatePost(post)}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                        title="Duplicate Post as Draft"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/blog/${post.id}`)}
                        className="w-10 h-10 flex items-center justify-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-xl transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'single', post })}
                        className="w-10 h-10 flex items-center justify-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Bulk Actions Bar */}
        <AnimatePresence>
          {isSomeSelected && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.18 }}
              className="m-3 sm:m-4 p-3 sm:p-3.5 bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold tabular-nums">
                  {selectedPostIds.length}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  posts selected on this page
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleBulkSetStatus('Published')}
                  className="px-3 min-h-[38px] text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Bulk Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSetStatus('Draft')}
                  className="px-3 min-h-[38px] text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Set as Draft
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 min-h-[38px] text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPostIds([])}
                  className="px-3 min-h-[38px] text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Footer */}
        {filteredAndSortedPosts.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={filteredAndSortedPosts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemUnitName="posts"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {deleteConfirm.type === 'bulk'
                      ? `Delete ${selectedPostIds.length} Selected Posts?`
                      : 'Delete Blog Post?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {deleteConfirm.type === 'bulk'
                      ? `Are you sure you want to permanently remove ${selectedPostIds.length} blog posts? This cannot be undone.`
                      : `Are you sure you want to permanently delete "${deleteConfirm.post.title}"? This action cannot be undone.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 min-h-[42px] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAction}
                  className="px-4 min-h-[42px] rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
