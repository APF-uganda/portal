import React, { useState, useMemo } from "react";
import { useNews } from "../../hooks/useNews";
import { Loader2 } from "lucide-react";

const categories = ["All Categories", "Policy Update", "Thought Leadership", "Announcements", "Ethics & Governance", "SME Support"];

const OtherNewsSection: React.FC = () => {
    const { news, loading } = useNews();
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const STRAPI_URL = "http://localhost:1337";

    const filteredItems = useMemo(() => {
        // top pick
        const others = news.filter(item => !item.isTopPick);
        return selectedCategory === "All Categories"
            ? others
            : others.filter((item) => item.category === selectedCategory);
    }, [news, selectedCategory]);

    if (loading) return null; 

    return (
        <section className="bg-[#FBFBFF] py-20 px-6 md:px-12 border-t border-slate-100">
            <h2 className="text-center text-3xl font-black text-gray-900 uppercase tracking-tighter mb-10">
                Explore More News
            </h2>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === cat
                                ? "bg-purple-700 text-white shadow-lg"
                                : "bg-white text-slate-400 border border-slate-200 hover:border-purple-300 hover:text-purple-600"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* News Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredItems.map((item) => {
                    const imageUrl = item.image?.startsWith('http') ? item.image : `${STRAPI_URL}${item.image}`;
                    
                    return (
                        <div key={item.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-slate-50 overflow-hidden">
                            <div className="h-52 overflow-hidden relative">
                                <img
                                    src={imageUrl || "/images/placeholder.jpg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow italic">
                                    {item.summary}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        {item.readTime}
                                    </span>
                                    <button className="text-purple-700 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                                        Read Article →
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OtherNewsSection;