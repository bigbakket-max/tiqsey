import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Heart,
  Bookmark,
  Share2,
  ChevronLeft,
  Search,
  MessageSquare,
  Send,
  ArrowRight,
  BookOpen,
  Sparkles,
  Compass,
  Check,
  Star,
  Ticket
} from "lucide-react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from "motion/react";
import { POPULAR_ATTRACTIONS } from "../data/mockData";
import { Attraction } from "../types";
import { useBlog } from '../contexts/BlogContext';

// Blog Post Interface
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  category: "Travel Tips" | "Destination Guides" | "Food & Culture" | "Hidden Gems";
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  city: string; // Used to cross-reference real POPULAR_ATTRACTIONS
  tags: string[];
  slug?: string;
  status?: 'Published' | 'Draft' | 'Scheduled';
}

// Rich Mock Blog Posts

interface BlogPageProps {
  onBackToHome: () => void;
  onViewAttraction: (id: string) => void;
}

export default function BlogPage({ onBackToHome, onViewAttraction }: BlogPageProps) {
  const { posts } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) || null : null;
  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("blog_liked_posts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("blog_bookmarked_posts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showShareToast, setShowShareToast] = useState(false);
  const [comments, setComments] = useState<Record<string, Array<{ author: string; text: string; time: string }>>>({
    "paris-secrets": [
      { author: "Sarah Jenkins", text: "This is amazing! I visited Passage Jouffroy last year and it felt like stepping into Narnia. Thanks for the tip about weekdays!", time: "2 days ago" },
      { author: "Marc Dubois", text: "As a Parisian, I confirm that Cour de Damoye is a masterpiece of calm. Great article!", time: "1 day ago" }
    ],
    "tokyo-districts": [
      { author: "Liam Chen", text: "Excellent contrast comparison. Going to Tokyo next month and will definitely follow your morning/evening plan!", time: "3 hours ago" }
    ]
  });
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    localStorage.setItem("blog_liked_posts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem("blog_bookmarked_posts", JSON.stringify(bookmarkedPosts));
  }, [bookmarkedPosts]);

  // Handle Share link copy
  const handleShare = async (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blog?post=${post.id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or restricted iframes
        const textArea = document.createElement("textarea");
        textArea.value = url;
        // Move outside of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleBookmark = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setBookmarkedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !selectedPost) return;

    const newComment = {
      author: newCommentName.trim(),
      text: newCommentText.trim(),
      time: "Just now"
    };

    setComments((prev) => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment]
    }));

    setNewCommentName("");
    setNewCommentText("");
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const isPublished = !post.status || post.status === 'Published';
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return isPublished && matchesCategory && matchesSearch;
  });

  const categories = ["All", "Destination Guides", "Travel Tips", "Food & Culture", "Hidden Gems"];

  // Helper to get real matching attractions for a post's city
  const getRelatedAttractions = (city?: string): Attraction[] => {
    if (!city) return [];
    return POPULAR_ATTRACTIONS.filter(
      (attr) => attr.city.toLowerCase() === city.toLowerCase()
    ).slice(0, 3);
  };

  // Check if a URL query parameter specifies a post on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postQuery = params.get("post");
    if (postQuery) {
      const post = posts.find((p) => p.id === postQuery && (!p.status || p.status === 'Published'));
      if (post) {
        setSelectedPostId(post.id);
        window.scrollTo(0, 0);
      }
    }
  }, [posts]);

  // Update history states
  const viewPostDetails = (post: BlogPost) => {
    setSelectedPostId(post.id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("post", post.id);
      window.history.pushState({}, "", url.toString());
    } catch (e) {
      console.error(e);
    }
    window.scrollTo(0, 0);
  };

  const closePostDetails = () => {
    setSelectedPostId(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("post");
      window.history.pushState({}, "", url.toString());
    } catch (e) {
      console.error(e);
    }
    window.scrollTo(0, 0);
  };

  const featuredPost = posts.find(post => !post.status || post.status === 'Published');

  return (
    <div className="py-8 md:py-12 bg-[#F4F7F9] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Toast Notification */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-semibold text-sm"
          >
            <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            // ================= BLOG INDEX PAGE =================
            <motion.div
              key="blog-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
                <button
                  onClick={onBackToHome}
                  className="hover:text-brand transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Blog</span>
              </div>

              {/* Page Title Header */}
              <div className="text-center md:text-left mb-10 md:mb-14">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tiqsey Chronicles
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Your Ultimate Travel Journal
                </h1>
                <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                  Curated city guides, secret spots, local dining tours, and practical travel hacks for your upcoming bucket-list adventure.
                </p>
              </div>

              {/* Large Featured Post Banner */}
              {searchTerm === "" && selectedCategory === "All" && featuredPost && (
                <div
                  onClick={() => viewPostDetails(featuredPost)}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-12 cursor-pointer border border-slate-100 dark:border-slate-850 grid grid-cols-1 lg:grid-cols-12 gap-0"
                  id="featured-post"
                >
                  <div className="lg:col-span-7 h-[280px] sm:h-[380px] lg:h-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      Featured Story
                    </div>
                  </div>
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {featuredPost.publishedAt?.includes('T') ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : featuredPost.publishedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand transition-colors tracking-tight leading-snug">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-850 mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredPost.author.avatarUrl}
                          alt={featuredPost.author.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-brand/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-none">
                            {featuredPost.author.name}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {featuredPost.author.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLike(e, featuredPost.id)}
                          className={`p-2 rounded-full border transition-colors ${
                            likedPosts.includes(featuredPost.id)
                              ? "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/40"
                              : "border-slate-100 text-slate-400 hover:text-rose-500 dark:border-slate-800"
                          }`}
                          title="Like Post"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={(e) => handleBookmark(e, featuredPost.id)}
                          className={`p-2 rounded-full border transition-colors ${
                            bookmarkedPosts.includes(featuredPost.id)
                              ? "bg-brand/5 border-brand/20 text-brand"
                              : "border-slate-100 text-slate-400 hover:text-brand dark:border-slate-800"
                          }`}
                          title="Save Bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={(e) => handleShare(e, featuredPost)}
                          className="p-2 rounded-full border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                          title="Share Link"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters & Search Control Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-850 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Category Tags Slider */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none select-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-brand text-white shadow-md shadow-brand/10"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Inputs */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles, cities, tags..."
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand/40 dark:focus:border-brand/40 text-slate-800 dark:text-slate-200 transition-all"
                  />
                </div>
              </div>

              {/* Articles Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts
                    .filter((post) => !(searchTerm === "" && selectedCategory === "All" && featuredPost && post.id === featuredPost.id))
                    .map((post) => {
                    const isLiked = likedPosts.includes(post.id);
                    const isBookmarked = bookmarkedPosts.includes(post.id);
                    return (
                      <motion.article
                        key={post.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => viewPostDetails(post)}
                        className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-850 flex flex-col justify-between h-full cursor-pointer"
                      >
                        <div>
                          {/* Article Cover Image */}
                          <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 bg-slate-900/80 text-white dark:bg-slate-900/95 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md backdrop-blur-sm">
                              {post.category}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.publishedAt?.includes('T') ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : post.publishedAt}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime}
                              </span>
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-brand transition-colors line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Footer details */}
                        <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.author.avatarUrl}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand/5"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left">
                              <span className="block text-xs font-bold text-slate-800 dark:text-slate-300 leading-none">
                                {post.author.name}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block leading-none">
                                {post.author.role.split(" & ")[0]}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleLike(e, post.id)}
                              className={`p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                isLiked ? "text-rose-500" : "text-slate-400"
                              }`}
                              title="Like"
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                            </button>
                            <button
                              onClick={(e) => handleBookmark(e, post.id)}
                              className={`p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                isBookmarked ? "text-brand" : "text-slate-400"
                              }`}
                              title="Bookmark"
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                            </button>
                            <button
                              onClick={(e) => handleShare(e, post)}
                              className="p-1.5 rounded-full text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850">
                  <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                    No articles found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mt-2 max-w-sm mx-auto">
                    We couldn't find any articles matching "{searchTerm}". Try checking your spelling or adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="mt-6 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            // ================= BLOG DETAIL PAGE (READING MODE) =================
            <motion.div
              key="blog-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-[840px] mx-auto"
            >
              {/* Reading mode header bar */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-850/60">
                <button
                  onClick={closePostDetails}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-brand bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl shadow-sm transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Back to Journal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLike(e, selectedPost.id)}
                    className={`flex items-center gap-1.5 py-2 px-3.5 text-xs font-extrabold rounded-xl border transition-all ${
                      likedPosts.includes(selectedPost.id)
                        ? "bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/40"
                        : "bg-white border-slate-100 text-slate-500 hover:text-rose-500 dark:bg-slate-900 dark:border-slate-850"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts.includes(selectedPost.id) ? "fill-current" : ""}`} />
                    <span>{likedPosts.includes(selectedPost.id) ? "Liked" : "Like"}</span>
                  </button>

                  <button
                    onClick={(e) => handleBookmark(e, selectedPost.id)}
                    className={`flex items-center gap-1.5 py-2 px-3.5 text-xs font-extrabold rounded-xl border transition-all ${
                      bookmarkedPosts.includes(selectedPost.id)
                        ? "bg-brand/5 border-brand/20 text-brand dark:bg-brand/10"
                        : "bg-white border-slate-100 text-slate-500 hover:text-brand dark:bg-slate-900 dark:border-slate-850"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosts.includes(selectedPost.id) ? "fill-current" : ""}`} />
                    <span>{bookmarkedPosts.includes(selectedPost.id) ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(e, selectedPost)}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all"
                    title="Share Article Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cover Article details */}
              <article className="space-y-6">
                <div className="space-y-4">
                  <span className="inline-block bg-brand/10 text-brand dark:bg-brand/20 text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full">
                    {selectedPost.category}
                  </span>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {selectedPost.title}
                  </h1>

                  {/* Author / Date Bar */}
                  <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-850/80 justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPost.author.avatarUrl}
                        alt={selectedPost.author.name}
                        className="w-11 h-11 rounded-full object-cover ring-4 ring-brand/5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-none">
                          {selectedPost.author.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
                          {selectedPost.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-350" />
                        {selectedPost.publishedAt?.includes('T') ? new Date(selectedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : selectedPost.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-350" />
                        {selectedPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="rounded-3xl overflow-hidden h-[300px] sm:h-[420px] shadow-sm relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Article Prose Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg space-y-6 pt-4 font-normal markdown-body">
                  <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {(selectedPost.content || []).join('\n\n')}
                  </Markdown>
                </div>

                {/* Tags section */}
                <div className="flex flex-wrap items-center gap-2 pt-6 border-b border-slate-100 dark:border-slate-850 pb-8">
                  {(selectedPost.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* ================= INTEGRATED REAL BOOKING SECTION ================= */}
                {getRelatedAttractions(selectedPost.city).length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-850/80 shadow-sm space-y-6 mt-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-brand font-extrabold text-sm uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        Inspired to Explore?
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Top Activities & Attractions in {selectedPost.city}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Read the guide, now live the story. Book instant tickets with fast-track entry options on our verified platform.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getRelatedAttractions(selectedPost.city).map((attr) => (
                        <div
                          key={attr.id}
                          className="group/item flex flex-col justify-between bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden p-3 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800"
                        >
                          <div>
                            <div className="h-28 rounded-xl overflow-hidden relative mb-2.5 bg-slate-200 dark:bg-slate-800 shrink-0">
                              <img
                                src={attr.imageUrl}
                                alt={attr.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1 leading-snug">
                              {attr.name}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                                {attr.rating}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({attr.reviewsCount})
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-150/40 dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-slate-400 leading-none">Price starts at</p>
                              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                                €{attr.price}
                              </p>
                            </div>

                            <button
                              onClick={() => onViewAttraction(attr.id)}
                              className="px-3 py-1.5 bg-brand hover:bg-brand/95 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1 group/btn"
                            >
                              <Ticket className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" />
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= INTERACTIVE COMMENTS SECTION ================= */}
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-100 dark:border-slate-850/40 mt-10">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Comments ({(comments[selectedPost.id] || []).length})
                    </h3>
                  </div>

                  {/* Comment Feed */}
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-none">
                    {(comments[selectedPost.id] || []).length > 0 ? (
                      (comments[selectedPost.id] || []).map((cmt, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-850"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                              {cmt.author}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              {cmt.time}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                            {cmt.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        No comments yet. Be the first to start the conversation!
                      </div>
                    )}
                  </div>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Share your thoughts
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        placeholder="Your Name"
                        className="sm:col-span-1 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand/40 dark:focus:border-brand/40 text-slate-800 dark:text-slate-200 transition-all"
                        required
                      />
                      <div className="sm:col-span-2 relative">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-brand/40 dark:focus:border-brand/40 text-slate-800 dark:text-slate-200 transition-all"
                          required
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand hover:bg-brand/90 text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
