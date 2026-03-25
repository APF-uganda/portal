import { useNews } from '../hooks/useNews';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/NewsComponents/HeroSection';
import TopPickSection from "../components/NewsComponents/TopPickSection";
import OtherNewsSection from '../components/NewsComponents/OtherNewsSection';
import NewsletterSection from '../components/NewsComponents/NewsletterSection';

function NewsPage() {
    // Fetch data from the hook
    const { news } = useNews();

    
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
