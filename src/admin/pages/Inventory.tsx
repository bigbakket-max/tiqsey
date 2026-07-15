import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Save,
  HelpCircle,
  TrendingUp,
  Percent,
  Users,
  DollarSign,
  Globe,
  Layers,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  Compass,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import { POPULAR_ATTRACTIONS, syncCustomAttractions } from "../../data/mockData";
import { Attraction } from "../../types";
import AttractionCard from "../../components/AttractionCard";

export default function Inventory() {
  const [attractions, setAttractions] = useState<Attraction[]>(() => {
    // Return live reference of POPULAR_ATTRACTIONS
    return [...POPULAR_ATTRACTIONS];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "capacity" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [activeTab, setActiveTab] = useState("Primary");

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("Europe");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  const [capacity, setCapacity] = useState<number>(500);
  const [supplier, setSupplier] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [fastTrack, setFastTrack] = useState(false);

  // Extract statistics in real-time
  const stats = useMemo(() => {
    const total = attractions.length;
    const avgPrice = total > 0 ? attractions.reduce((acc, curr) => acc + curr.price, 0) / total : 0;
    const promotions = attractions.filter(a => a.discountPrice !== undefined && a.discountPrice > 0).length;
    const lowCapacity = attractions.filter(a => (a.maxGroupSize || 500) < 150).length;

    return {
      total,
      avgPrice,
      promotions,
      lowCapacity
    };
  }, [attractions]);

  // Extract all categories dynamically for filter options
  const categories = useMemo(() => {
    const cats = new Set(attractions.map((a) => a.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [attractions]);

  // All unique regions dynamically
  const regions = useMemo(() => {
    const regs = new Set(attractions.map((a) => a.region).filter(Boolean));
    return ["All", ...Array.from(regs)];
  }, [attractions]);

  // All unique locations (cities) dynamically
  const locations = useMemo(() => {
    const locs = new Set(attractions.map((a) => a.city).filter(Boolean));
    return ["All", ...Array.from(locs)];
  }, [attractions]);

  // Preset popular categories for easy selection
  const categoryPresets = ["Museum", "Landmark", "Cruise", "Architecture", "Food & Drink", "Adventure", "Day Tour", "Nature"];

  // Handle opening modal for adding new activity
  const handleAddClick = () => {
    setEditingAttraction(null);
    setActiveTab("Primary");
    setName("");
    setLocation("");
    setCity("");
    setRegion("Europe");
    setCategory("Museum");
    setPrice("");
    setDiscountPrice("");
    setCapacity(500);
    setSupplier("Local Operator");
    setImageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80");
    setDescription("");
    setDuration("2-3 hours");
    setOpeningHours("Daily: 09:00 - 18:00");
    setHighlightsInput("");
    setIncludedInput("");
    setIsPopular(false);
    setFastTrack(false);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing an activity
  const handleEditClick = (attr: Attraction) => {
    setEditingAttraction(attr);
    setActiveTab("Primary");
    setName(attr.name || "");
    setLocation(attr.location || "");
    setCity(attr.city || "");
    setRegion(attr.region || "Europe");
    setCategory(attr.category || "");
    setPrice(attr.price ?? "");
    setDiscountPrice(attr.discountPrice ?? "");
    setCapacity(attr.maxGroupSize || 500);
    setSupplier(attr.provider || "Local Operator");
    setImageUrl(attr.imageUrl || "");
    setDescription(attr.description || "");
    setDuration(attr.duration || "");
    setOpeningHours(attr.openingHours || "");
    setHighlightsInput((attr.highlights || []).join("\n"));
    setIncludedInput((attr.included || []).join("\n"));
    setIsPopular(attr.isPopular ?? false);
    setFastTrack(attr.fastTrack ?? false);
    setIsModalOpen(true);
  };

  // Handle delete operation
  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this attraction? This will instantly sync with the main website catalogue.")) {
      const updated = attractions.filter((a) => a.id !== id);
      setAttractions(updated);
      syncCustomAttractions(updated);
    }
  };

  // Handle file import to base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset image URLs picker
  const handlePresetImageSelect = (url: string) => {
    setImageUrl(url);
  };

  // Handle saving changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Activity Name is required");
    if (!city.trim()) return alert("City is required");
    if (!price || Number(price) <= 0) return alert("Valid original price is required");
    if (!imageUrl.trim()) return alert("Image URL or Uploaded image is required");

    const highlights = highlightsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const included = includedInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const attractionData: Attraction = {
      id: editingAttraction ? editingAttraction.id : `custom-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || `${city.trim()}, ${region}`,
      city: city.trim(),
      region,
      category: category.trim() || "Activity",
      rating: editingAttraction ? editingAttraction.rating : 4.8,
      reviewsCount: editingAttraction ? editingAttraction.reviewsCount : 12,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      imageUrl: imageUrl.trim(),
      isPopular,
      fastTrack,
      description: description.trim(),
      highlights,
      included,
      duration: duration.trim() || "Flexible",
      openingHours: openingHours.trim() || "Daily",
      maxGroupSize: capacity,
      provider: supplier.trim() || "Local Operator",
    };

    let updatedList: Attraction[];
    if (editingAttraction) {
      updatedList = attractions.map((a) => (a.id === editingAttraction.id ? attractionData : a));
    } else {
      updatedList = [attractionData, ...attractions];
    }

    setAttractions(updatedList);
    syncCustomAttractions(updatedList);
    setIsModalOpen(false);
  };

  // Change sort configuration
  const handleSort = (field: "name" | "price" | "capacity" | "rating") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & sort list
  const filteredAndSortedAttractions = useMemo(() => {
    let result = attractions.filter((attr) => {
      const matchesSearch =
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attr.provider || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || attr.category === selectedCategory;
      const matchesRegion = selectedRegion === "All" || attr.region === selectedRegion;
      const matchesLocation = selectedLocation === "All" || attr.city === selectedLocation;

      return matchesSearch && matchesCategory && matchesRegion && matchesLocation;
    });

    // Sort result
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        const actualA = a.discountPrice || a.price;
        const actualB = b.discountPrice || b.price;
        comparison = actualA - actualB;
      } else if (sortBy === "capacity") {
        comparison = (a.maxGroupSize || 500) - (b.maxGroupSize || 500);
      } else if (sortBy === "rating") {
        comparison = (a.rating || 0) - (b.rating || 0);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [attractions, searchQuery, selectedCategory, selectedRegion, selectedLocation, sortBy, sortOrder]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedRegion, selectedLocation, sortBy, sortOrder]);

  // Derived Pagination
  const totalPages = Math.ceil(filteredAndSortedAttractions.length / itemsPerPage);
  const paginatedAttractions = filteredAndSortedAttractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const inventoryTable = useMemo(() => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
      {/* Advanced Filters Toolbar */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] transition-colors text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3 mr-1">
              <Layers className="w-4 h-4 text-slate-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer hover:text-[#5fa6d9] transition-colors"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-[#5fa6d9] cursor-pointer"
            >
              <option value="All">All Cities</option>
              {locations.filter(l => l !== "All").map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-[#5fa6d9] cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {(selectedCategory !== "All" || selectedRegion !== "All" || selectedLocation !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedRegion("All");
                  setSelectedLocation("All");
                  setSearchQuery("");
                }}
                className="text-sm font-semibold text-[#5fa6d9] hover:text-[#4b95cc] transition-colors px-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Real-Time Catalogue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[1000px] table-fixed">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1.5">
                  Activity & ID
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors" onClick={() => handleSort("price")}>
                <div className="flex items-center gap-1.5">
                  Price Configuration
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
            {filteredAndSortedAttractions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 bg-slate-50/20 dark:bg-slate-950/10">
                  <div className="max-w-md mx-auto space-y-3">
                    <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
                    <p className="text-base font-black text-slate-800 dark:text-white">No Activities Match Filters</p>
                    <p className="text-xs text-slate-400">
                      Try clearing or relaxing your search query and filters to review other operational inventory items.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAttractions.map((attr) => {
                const hasDiscount = attr.discountPrice !== undefined && attr.discountPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((attr.price - attr.discountPrice!) / attr.price) * 100)
                  : 0;
                const capValue = attr.maxGroupSize || 500;
                const isLowStock = capValue < 150;

                return (
                  <tr key={attr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Name / ID / Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 flex-shrink-0 group">
                          <img
                            src={attr.imageUrl}
                            alt={attr.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          {hasDiscount && (
                            <div className="absolute top-0 left-0 bg-emerald-500 text-white font-black text-[8px] px-1 py-0.5 rounded-br-md">
                              DEAL
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-900 dark:text-white font-black text-sm truncate" title={attr.name}>
                            {attr.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded">
                              ID: {attr.id}
                            </span>
                            <span className="flex items-center text-[10px] text-amber-500 font-bold gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                              {attr.rating || 4.8}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location details */}
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <p className="text-slate-900 dark:text-slate-200 font-bold truncate">{attr.city}</p>
                        <p className="text-slate-400 font-medium truncate text-[11px]">{attr.region}</p>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4">
                      <span className="bg-[#f0f7fc] dark:bg-[#102738]/30 text-[#5fa6d9] dark:text-[#5fa6d9] text-[11px] font-bold px-3 py-1 rounded-md border border-[#e0f0fa]/50 dark:border-[#1e4663]/30">
                        {attr.category}
                      </span>
                    </td>

                    {/* Price configurations with smart badges */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {hasDiscount ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm font-mono">
                                ${attr.discountPrice?.toFixed(2)}
                              </span>
                              <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded">
                                -{discountPercent}%
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-medium line-through font-mono">
                              Reg: ${attr.price.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-900 dark:text-white font-black text-sm font-mono">
                            ${attr.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Supplier brand */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-semibold" title={attr.provider}>
                        {attr.provider || "Local Operator"}
                      </p>
                    </td>

                    {/* Action Tools */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(attr)}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors group"
                          title="Edit Activity"
                        >
                          <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(attr.id)}
                          className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedAttractions.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900 dark:text-white">{filteredAndSortedAttractions.length}</span> activities
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {(() => {
                const pages: (number | string)[] = [];
                const maxButtons = 5;
                if (totalPages <= maxButtons) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);
                  
                  if (currentPage <= 2) {
                    end = 4;
                  } else if (currentPage >= totalPages - 1) {
                    start = totalPages - 3;
                  }
                  
                  if (start > 2) {
                    pages.push("...");
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  if (end < totalPages - 1) {
                    pages.push("...");
                  }
                  pages.push(totalPages);
                }
                
                return pages.map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-xs font-bold text-slate-400 dark:text-slate-600 select-none"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  const isPageActive = page === currentPage;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[32px] h-8 px-2.5 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                        isPageActive
                          ? "bg-[#5fa6d9] text-white shadow-sm shadow-[#5fa6d9]/15"
                          : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                });
              })()}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  ), [
    paginatedAttractions, 
    searchQuery, 
    selectedCategory, 
    selectedRegion, 
    selectedLocation, 
    sortBy, 
    sortOrder, 
    currentPage, 
    itemsPerPage, 
    totalPages, 
    filteredAndSortedAttractions.length,
    categories,
    regions,
    locations
  ]);

  return (
    <div className="space-y-8 w-full mx-auto pb-12">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-[#102738] to-slate-900 p-6 rounded-lg text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5fa6d9]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#5fa6d9] text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
              Operational Catalogue
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-300 font-bold">Auto-sync Active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Inventory Control Center</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Add, update, or remove activity details, custom pricing, discount vouchers, and daily capacities. All modifications synchronize instantly across user search fields.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="z-10 flex items-center gap-2 bg-[#5fa6d9] text-white px-6 py-3 rounded-lg font-black hover:bg-[#4b95cc] active:scale-95 transition-all shadow-lg hover:shadow-[#5fa6d9]/20 text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {/* Modern Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Listed Attractions</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#5fa6d9] transition-colors">
              {stats.total}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Across global regions</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-[#5fa6d9] rounded-md group-hover:bg-[#f0f7fc] dark:group-hover:bg-[#102738]/40 transition-colors">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Active Promotions</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.promotions}
            </p>
            <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <Percent className="w-3 h-3" /> Hot Deals displayed live
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-emerald-500 rounded-md group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 transition-colors">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Average Original Price</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              ${stats.avgPrice.toFixed(1)}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">Weighted mean price</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-sky-500 rounded-md group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 transition-colors">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Low Stock Alerts</p>
            <p className="text-3xl font-black text-amber-500">
              {stats.lowCapacity}
            </p>
            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Under 150 bookings limit
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950 text-amber-500 rounded-md group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition-colors">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs and Table Container */}
      {inventoryTable}

      {/* Editor Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Modal Header */}
          <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#5fa6d9]" />
                  {editingAttraction ? "Modify Attraction Parameters" : "Draft New Attraction Item"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure specific media, location mapping, group constraints, and promotional price deals.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#5fa6d9] p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Form View with real-time ticket preview on the right */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Form Input Column */}
              <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col border-r border-slate-200 dark:border-slate-800 h-full">
                {/* Tabs Header */}
                <div className="flex px-6 pt-4 border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold text-slate-400">
                  {["Primary", "Pricing", "Media & Info"].map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 border-b-2 transition-all ${
                        activeTab === tab
                          ? "border-[#5fa6d9] text-[#5fa6d9]"
                          : "border-transparent hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
                  {/* TAB 1: Primary */}
                  {activeTab === "Primary" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Visual Section: Basic Metadata */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Primary Information</h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Activity Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Skip-the-line Eiffel Tower Summit Access"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Paris"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Geographical Region
                              </label>
                              <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-bold text-slate-700 dark:text-slate-300"
                              >
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                                <option value="North America">North America</option>
                                <option value="Middle East">Middle East</option>
                                <option value="Oceania">Oceania</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Exact Location Coordinates/Address
                            </label>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Champ de Mars, 5 Avenue Anatole France, 75007 Paris"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] text-slate-700 dark:text-slate-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visual Section: Category & Provider */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Classification & Supplier</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Category Label *
                            </label>
                            <input
                              type="text"
                              required
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              placeholder="e.g. Museum, Landmark, Cruise, Day Tour"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-bold text-slate-800 dark:text-white"
                            />
                            {/* Presets suggestions */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {categoryPresets.map(p => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setCategory(p)}
                                  className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded hover:bg-[#f0f7fc] hover:text-[#5fa6d9] dark:hover:bg-[#102738]/30 transition-colors font-bold cursor-pointer"
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Registered Provider / Supplier
                            </label>
                            <input
                              type="text"
                              value={supplier}
                              onChange={(e) => setSupplier(e.target.value)}
                              placeholder="e.g. Paris Tours LLC"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] font-semibold text-slate-800 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visual Section: Badges */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Features & Badges</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] transition-colors">
                            <input
                              type="checkbox"
                              checked={isPopular}
                              onChange={(e) => setIsPopular(e.target.checked)}
                              className="w-4 h-4 text-[#5fa6d9] rounded border-slate-300 focus:ring-[#5fa6d9]"
                            />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Popular Activity</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] transition-colors">
                            <input
                              type="checkbox"
                              checked={fastTrack}
                              onChange={(e) => setFastTrack(e.target.checked)}
                              className="w-4 h-4 text-[#5fa6d9] rounded border-slate-300 focus:ring-[#5fa6d9]"
                            />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Fast Track / Skip-the-line</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Pricing */}
                  {activeTab === "Pricing" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Visual Section: Pricing & Capacity */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Pricing Configuration & Limits</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Original Price ($) *
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                              <input
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                                placeholder="85.00"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-8 pr-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9] font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Promo Discount Price ($)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-bold">$</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                                placeholder="e.g. 65.00"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-8 pr-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Max Capacity per Day
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={capacity}
                              onChange={(e) => setCapacity(Number(e.target.value))}
                              placeholder="500"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visual Section: Schedule & Logistics */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Logistics & Operational Hours</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Duration Description
                            </label>
                            <input
                              type="text"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="e.g. 2-3 hours, Full Day, 45 minutes"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Opening Operational Hours
                            </label>
                            <input
                              type="text"
                              value={openingHours}
                              onChange={(e) => setOpeningHours(e.target.value)}
                              placeholder="e.g. Daily: 09:00 - 18:00, Seasonal"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#5fa6d9]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Media & Info */}
                  {activeTab === "Media & Info" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Visual Section: Image URL & Media */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Media & Assets</h3>
                        </div>

                        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Cover Image URL *
                            </label>
                            <input
                              type="text"
                              required
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              placeholder="Paste a direct image URL (Unsplash or direct CDN)..."
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5fa6d9]"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <Upload className="w-4 h-4 text-[#5fa6d9]" />
                                <span>Upload File from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {/* Presets Gallery */}
                          <div className="space-y-1.5">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Quick-select beautiful stock landscape placeholders</span>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { name: "Paris", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
                                { name: "Rome", url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80" },
                                { name: "Tokyo", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
                                { name: "Dubai", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" }
                              ].map(preset => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => handlePresetImageSelect(preset.url)}
                                  className="group relative h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5fa6d9] cursor-pointer"
                                >
                                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-black text-white">
                                    {preset.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Section: Rich Description, Highlights & Included */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Rich Descriptions & Lists</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Catalogue Description
                            </label>
                            <textarea
                              rows={3}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Provide a glamorous introduction highlighting what makes this activity highly rated and globally popular..."
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-3 text-sm focus:outline-none focus:border-[#5fa6d9] font-medium text-slate-700 dark:text-slate-300"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-500" /> Key Highlights</span>
                                <span className="text-slate-400 font-normal lowercase">(one per line)</span>
                              </label>
                              <textarea
                                rows={5}
                                value={highlightsInput}
                                onChange={(e) => setHighlightsInput(e.target.value)}
                                placeholder="Rembrandt's masterpieces&#10;Stunning panoramic views&#10;Skip long ticket lines"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-3 text-sm focus:outline-none focus:border-[#5fa6d9] text-slate-700 dark:text-slate-300 leading-relaxed"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> What's Included</span>
                                <span className="text-slate-400 font-normal lowercase">(one per line)</span>
                              </label>
                              <textarea
                                rows={5}
                                value={includedInput}
                                onChange={(e) => setIncludedInput(e.target.value)}
                                placeholder="Admission ticket&#10;Professional tour guide&#10;Complimentary hot tea"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-3 text-sm focus:outline-none focus:border-[#5fa6d9] text-slate-700 dark:text-slate-300 leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submitting Buttons in Form */}
                <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-800 mt-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#5fa6d9] hover:bg-[#4b95cc] text-white px-6 py-2.5 rounded-md font-bold transition-colors shadow-sm text-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Attraction
                  </button>
                </div>
              </form>

              {/* Real-time Visual Card Live Preview Column */}
              <div className="lg:col-span-5 bg-slate-50/50 dark:bg-slate-950/40 p-6 lg:p-10 flex flex-col justify-start items-center space-y-6 overflow-y-auto h-full">
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-left mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5fa6d9] animate-pulse" />
                    Live Customer Ticket Preview
                  </p>
                  <p className="text-xs text-slate-400 text-left">
                    Review how this activity will render to travelers on the web application storefront in real-time as you modify parameters.
                  </p>
                </div>

                {/* Card Container Mock */}
                <div className="w-full max-w-sm pointer-events-none">
                  <AttractionCard 
                    attr={{
                      id: editingAttraction?.id || "preview-id",
                      name: name || "Untitled Activity Showcase",
                      location: location || "Mock Location",
                      city: city || "City",
                      category: category || "Category",
                      rating: 4.8,
                      reviewsCount: 12,
                      price: Number(price || 0),
                      discountPrice: discountPrice ? Number(discountPrice) : undefined,
                      imageUrl: imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
                      isPopular: isPopular,
                      fastTrack: fastTrack,
                      region: region || "Europe",
                      description: description || "Enter a descriptive operational review description above to preview catalog text cards automatically.",
                      highlights: highlightsInput.split('\n').filter(Boolean),
                      included: includedInput.split('\n').filter(Boolean),
                      duration: duration || "Flexible",
                      provider: supplier || "Provider",
                      openingHours: openingHours || ""
                    }} 
                  />
                </div>

                {/* Info Tip block */}
                <div className="w-full max-w-sm bg-[#f0f7fc] dark:bg-[#102738]/20 border border-[#e0f0fa] dark:border-[#1e4663]/30 p-4 rounded-lg flex gap-3 text-left">
                  <Sparkles className="w-5 h-5 text-[#5fa6d9] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-[#1e4663] dark:text-[#bce1f5]">Catalog Cohesiveness</p>
                    <p className="text-[10px] text-[#5fa6d9] dark:text-[#8ecaf0] leading-relaxed">
                      Always provide high-quality Unsplash cover links and precise regional tags so visitors can search with ease.
                    </p>
                  </div>
                </div>

              </div>

            </div>
        </div>
      )}
    </div>
  );
}
