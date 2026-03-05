import { useNews } from '../hooks/useNews';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/NewsComponents/HeroSection';
import TopPickSection from "../components/NewsComponents/TopPickSection";
import OtherNewsSection from '../components/NewsComponents/OtherNewsSection';
import NewsletterSection from '../components/NewsComponents/NewsletterSection';
import { Loader2 } from 'lucide-react';

function NewsPage() {
    // Fetch data from the hook
    const { news, loading } = useNews();

    //  Handle the loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-purple-600" size={48} strokeWidth={3} />
                <p className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Loading Latest News...</p>
            </div>
        );
    }

    
    const topPick = news.find(item => item.isTopPick);
    
   
    const otherNews = news.filter(item => item.id !== topPick?.id);

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />

        {/* Pass the data into the sections. 
            
        */}
        <TopPickSection article={topPick} />        
        
        <OtherNewsSection articles={otherNews} />

        <NewsletterSection />
        <Footer />
      </div>
    );
}

export default NewsPage;