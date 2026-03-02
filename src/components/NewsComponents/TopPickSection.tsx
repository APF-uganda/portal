import React from "react";
import { useNews } from "../../hooks/useNews";
import { Loader2 } from "lucide-react";

const TopPickSection: React.FC = () => {
    const { news, loading } = useNews();
    const STRAPI_URL = "http://localhost:1337";

   
    const topPick = news.find(item => item.isTopPick) || news[0];

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;
    if (!topPick) return null;

    const imageUrl = topPick.image?.startsWith('http') ? topPick.image : `${STRAPI_URL}${topPick.image}`;

    return (
        <section className="bg-white py-12 px-6 md:px-12">
            <h2 className="text-center text-3xl font-black text-gray-900 uppercase tracking-tighter mb-10">
                Our Latest News: Top Pick
            </h2>

            <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden md:flex border border-slate-100 transition-transform hover:scale-[1.01] duration-500">
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex gap-2 mb-6">
                            <span className="bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                Featured
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                {topPick.category}
                            </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900">
                            {topPick.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed italic">
                            {topPick.summary}
                        </p>
                        <div className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-wide">
                            {new Date(topPick.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                            <span className="mx-3 opacity-30">|</span> 
                            {topPick.readTime}
                        </div>
                    </div>

                    <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 rounded-2xl w-full transition-all shadow-lg active:scale-95">
                        Read Full Article
                    </button>
                </div>
                
                <div className="md:w-1/2 relative h-64 md:h-auto">
                    <img
                        src={imageUrl || "/images/placeholder.jpg"}
                        alt={topPick.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
};

export default TopPickSection;